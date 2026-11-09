import { useCallback, useEffect, useState } from 'react';

export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: unknown };

/** Ejecuta una función async y expone los tres estados: carga / datos / error. */
export function useAsync<T>(fn: () => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' });

  const run = useCallback(async () => {
    setState({ status: 'loading' });
    try {
      setState({ status: 'success', data: await fn() });
    } catch (error) {
      setState({ status: 'error', error });
    }
  }, [fn]);

  useEffect(() => {
    run();
  }, [run]);

  return { state, reload: run };
}
