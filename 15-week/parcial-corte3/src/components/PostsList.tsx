import { useCallback, useEffect, useState } from 'react';

interface Post { id: number; title: string }

type State =
  | { status: 'loading' }
  | { status: 'data'; posts: Post[] }
  | { status: 'error'; message: string };

const API_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=5';

export default function PostsList() {
  const [state, setState] = useState<State>({ status: 'loading' });
  // Interruptor para simular un fallo de red y comprobar el estado de error.
  const [simulateFailure, setSimulateFailure] = useState(false);

  const load = useCallback(async () => {
    setState({ status: 'loading' });
    try {
      if (simulateFailure) throw new TypeError('Failed to fetch (simulado)');
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Error del servidor (${res.status})`);
      const posts: Post[] = await res.json();
      setState({ status: 'data', posts });
    } catch (e) {
      const message = e instanceof TypeError
        ? 'Sin conexión: no se pudo contactar al servidor.'
        : (e as Error).message;
      setState({ status: 'error', message });
    }
  }, [simulateFailure]);

  useEffect(() => { load(); }, [load]);

  return (
    <section>
      <h2>Problema 2 · Conectividad</h2>
      <label>
        <input
          type="checkbox"
          checked={simulateFailure}
          onChange={(e) => setSimulateFailure(e.target.checked)}
        />{' '}
        Simular fallo de red
      </label>

      {state.status === 'loading' && <p>Cargando…</p>}

      {state.status === 'data' && (
        <ul>{state.posts.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
      )}

      {state.status === 'error' && (
        <>
          <p className="error">⚠️ {state.message}</p>
          <button className="secondary" onClick={load}>Reintentar</button>
        </>
      )}
    </section>
  );
}
