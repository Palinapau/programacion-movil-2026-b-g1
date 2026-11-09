/**
 * Cliente HTTP de Movie Rater.
 * - Agrega el token Bearer a las peticiones protegidas.
 * - Traduce los fallos a errores tipados: sin red, 401 y error del servidor.
 */

export class NetworkError extends Error {
  constructor(message = 'No hay conexión a internet') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class UnauthorizedError extends Error {
  constructor(message = 'Tu sesión expiró. Inicia sesión de nuevo.') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

export interface TokenStore {
  get(): string | null;
  set(token: string): void;
  clear(): void;
}

export const localTokenStore: TokenStore = {
  get: () => localStorage.getItem('token'),
  set: (t) => localStorage.setItem('token', t),
  clear: () => localStorage.removeItem('token'),
};

export interface ApiClientOptions {
  baseUrl: string;
  tokenStore: TokenStore;
  fetchImpl?: typeof fetch;
  /** Se llama cuando el servidor responde 401 (token vencido o inválido). */
  onUnauthorized?: () => void;
}

export function createApiClient(opts: ApiClientOptions) {
  const doFetch = opts.fetchImpl ?? ((...args: Parameters<typeof fetch>) => fetch(...args));

  async function request<T>(path: string, init: RequestInit = {}, auth = true): Promise<T> {
    const headers = new Headers(init.headers);
    headers.set('Content-Type', 'application/json');
    if (auth) {
      const token = opts.tokenStore.get();
      if (token) headers.set('Authorization', `Bearer ${token}`);
    }

    let res: Response;
    try {
      res = await doFetch(`${opts.baseUrl}${path}`, { ...init, headers });
    } catch {
      // fetch solo lanza excepción cuando no hay red / el servidor no es alcanzable.
      throw new NetworkError();
    }

    if (res.status === 401 && auth) {
      opts.tokenStore.clear();
      opts.onUnauthorized?.();
      throw new UnauthorizedError();
    }

    const body = await res.json().catch(() => null);
    if (!res.ok) {
      const msg = (body && (body.message || body.error || body.mensaje)) || `Error ${res.status}`;
      throw new HttpError(res.status, String(msg));
    }
    return body as T;
  }

  return {
    /** Login por token: guarda el JWT que devuelve la API. */
    async login(email: string, password: string) {
      const data = await request<{ token?: string; accessToken?: string }>(
        '/auth/login',
        { method: 'POST', body: JSON.stringify({ email, password }) },
        false,
      );
      const token = data.token ?? data.accessToken;
      if (!token) throw new HttpError(500, 'La API no devolvió un token');
      opts.tokenStore.set(token);
    },
    logout() {
      opts.tokenStore.clear();
    },
    isLoggedIn: () => !!opts.tokenStore.get(),
    /** Petición protegida: reseñas del usuario autenticado. */
    getReviews: () => request<Review[]>('/resenas'),
  };
}

export interface Review {
  id: number | string;
  pelicula_id_tmdb?: number | string;
  calificacion?: number;
  comentario?: string;
  resena?: string;
  texto?: string;
}

/** Mensaje amigable para mostrar al usuario según el tipo de error. */
export function describeError(err: unknown): string {
  if (err instanceof NetworkError) return 'Sin conexión. Revisa tu internet e inténtalo de nuevo.';
  if (err instanceof UnauthorizedError) return err.message;
  if (err instanceof HttpError) return err.message;
  return 'Ocurrió un error inesperado.';
}

export const api = createApiClient({
  baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  tokenStore: localTokenStore,
  onUnauthorized: () => window.dispatchEvent(new Event('auth:unauthorized')),
});
