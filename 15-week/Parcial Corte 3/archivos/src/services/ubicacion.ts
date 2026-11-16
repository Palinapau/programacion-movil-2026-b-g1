import { Geolocation } from '@capacitor/geolocation';

// Plugin nativo de hardware (Capacitor Geolocation) con solicitud de permiso y manejo del caso "denegado".
//
// Why permissions matter (English):
// Apps must request permission because location data is private, and the operating system
// requires the user's explicit consent before an app can read it. When the user denies access,
// the app should handle it gracefully: explain why the feature is unavailable, keep working,
// and let the user try again or enable the permission later in the device settings.

export type ResultadoUbicacion =
  | { estado: 'concedido'; latitud: number; longitud: number }
  | { estado: 'denegado' }
  | { estado: 'error'; mensaje: string };

// En la web el navegador no usa los mismos códigos que Android/iOS, por eso se revisa el texto también.
const esPermisoDenegado = (err: unknown): boolean => {
  const texto = String((err as { message?: string })?.message ?? err).toLowerCase();

  return (
    texto.includes('denied') ||
    texto.includes('permission') ||
    (err as { code?: number })?.code === 1
  );
};

export const obtenerUbicacion = async (): Promise<ResultadoUbicacion> => {
  try {
    // 1) Revisar el permiso actual (en algunos navegadores no está soportado).
    let permiso = 'prompt';

    try {
      permiso = (await Geolocation.checkPermissions()).location;
    } catch {
      // Se pedirá al leer la posición.
    }

    // 2) Si el usuario aún no ha decidido, se le pide explícitamente (Android/iOS).
    if (permiso === 'prompt' || permiso === 'prompt-with-rationale') {
      try {
        permiso = (await Geolocation.requestPermissions()).location;
      } catch {
        // En la web el navegador pregunta al llamar getCurrentPosition.
      }
    }

    // 3) Permiso negado: no se intenta leer la ubicación.
    if (permiso === 'denied') {
      return { estado: 'denegado' };
    }

    const posicion = await Geolocation.getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 10000,
    });

    return {
      estado: 'concedido',
      latitud: posicion.coords.latitude,
      longitud: posicion.coords.longitude,
    };
  } catch (err) {
    if (esPermisoDenegado(err)) {
      return { estado: 'denegado' };
    }

    return {
      estado: 'error',
      mensaje: 'No pudimos obtener tu ubicación. Intenta de nuevo.',
    };
  }
};
