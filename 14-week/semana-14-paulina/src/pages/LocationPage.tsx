import { useState } from 'react';
import {
  IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonPage,
  IonSpinner, IonText, IonTitle, IonToolbar,
} from '@ionic/react';
import { Geolocation } from '@capacitor/geolocation';
import { formatCoords, mapsLink, type Coords } from '../utils/geo';

type View =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'data'; coords: Coords }
  | { kind: 'denied' }
  | { kind: 'error'; message: string };

export default function LocationPage() {
  const [view, setView] = useState<View>({ kind: 'idle' });

  async function locateMe() {
    setView({ kind: 'loading' });
    try {
      // Permisos: consultar primero, pedir solo si hace falta.
      let perm = await Geolocation.checkPermissions();
      if (perm.location !== 'granted') {
        perm = await Geolocation.requestPermissions();
      }
      if (perm.location !== 'granted') {
        setView({ kind: 'denied' });
        return;
      }
      const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 });
      setView({ kind: 'data', coords: pos.coords });
    } catch (e) {
      const msg = String((e as Error)?.message ?? '');
      setView(
        /denied/i.test(msg)
          ? { kind: 'denied' }
          : { kind: 'error', message: 'No pudimos obtener tu ubicación. Activa el GPS e inténtalo otra vez.' },
      );
    }
  }

  return (
    <IonPage>
      <IonHeader><IonToolbar><IonTitle>Cines cerca de ti</IonTitle></IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        <p>Usamos tu ubicación para saber desde dónde calificas tus películas.</p>

        {view.kind === 'loading' && <div className="ion-text-center"><IonSpinner /><p>Buscando señal GPS…</p></div>}

        {view.kind === 'data' && (
          <IonCard>
            <IonCardHeader><IonCardTitle>Tu ubicación</IonCardTitle></IonCardHeader>
            <IonCardContent>
              <p>{formatCoords(view.coords)}</p>
              {view.coords.accuracy !== undefined && <p>Precisión: ±{Math.round(view.coords.accuracy)} m</p>}
              <a href={mapsLink(view.coords)} target="_blank" rel="noreferrer">Ver en el mapa</a>
            </IonCardContent>
          </IonCard>
        )}

        {view.kind === 'denied' && (
          <IonText color="danger">
            <p role="alert">Sin permiso de ubicación. Actívalo en Ajustes → Apps → Movie Rater → Permisos → Ubicación.</p>
          </IonText>
        )}
        {view.kind === 'error' && <IonText color="danger"><p role="alert">{view.message}</p></IonText>}

        <IonButton expand="block" onClick={locateMe} disabled={view.kind === 'loading'}>
          {view.kind === 'data' ? 'Actualizar ubicación' : 'Obtener mi ubicación'}
        </IonButton>
      </IonContent>
    </IonPage>
  );
}
