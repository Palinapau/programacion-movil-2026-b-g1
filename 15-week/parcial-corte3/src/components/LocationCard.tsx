import { useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { formatCoords } from '../utils/format';

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'granted'; lat: number; lng: number }
  | { status: 'denied' }
  | { status: 'error'; message: string };

const isDenied = (e: unknown) => {
  const msg = String((e as { message?: string })?.message ?? e).toLowerCase();
  return msg.includes('denied') || msg.includes('permission') || (e as { code?: number })?.code === 1;
};

export default function LocationCard() {
  const [state, setState] = useState<State>({ status: 'idle' });

  async function getLocation() {
    setState({ status: 'loading' });
    try {
      // 1) Revisar el permiso actual (en web puede no estar soportado).
      let permission = 'prompt';
      try {
        permission = (await Geolocation.checkPermissions()).location;
      } catch { /* se pedirá al llamar getCurrentPosition */ }

      // 2) Si aún no se ha decidido, pedirlo explícitamente (nativo).
      if (permission === 'prompt' || permission === 'prompt-with-rationale') {
        try {
          permission = (await Geolocation.requestPermissions()).location;
        } catch { /* en web el navegador pregunta en getCurrentPosition */ }
      }

      // 3) Caso negado: no se intenta leer la ubicación.
      if (permission === 'denied') {
        setState({ status: 'denied' });
        return;
      }

      const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 });
      setState({ status: 'granted', lat: pos.coords.latitude, lng: pos.coords.longitude });
    } catch (e) {
      if (isDenied(e)) setState({ status: 'denied' });
      else setState({ status: 'error', message: 'No se pudo obtener la ubicación. Intenta de nuevo.' });
    }
  }

  return (
    <section>
      <h2>Problema 1 · Geolocalización</h2>
      <button onClick={getLocation} disabled={state.status === 'loading'}>
        {state.status === 'loading' ? 'Obteniendo…' : 'Obtener mi ubicación'}
      </button>

      {state.status === 'granted' && (
        <p>📍 {formatCoords(state.lat, state.lng)}</p>
      )}

      {state.status === 'denied' && (
        <p className="warn">
          Permiso de ubicación denegado. La app sigue funcionando, pero no podemos mostrar tu
          posición. Puedes activarlo en los ajustes del dispositivo y volver a intentar.
        </p>
      )}

      {state.status === 'error' && <p className="error">{state.message}</p>}
    </section>
  );
}
