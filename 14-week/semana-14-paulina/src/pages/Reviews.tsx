import {
  IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonSpinner,
  IonText, IonTitle, IonToolbar,
} from '@ionic/react';
import { api, describeError, NetworkError, type Review } from '../api/client';
import { useAsync } from '../hooks/useAsync';

const fetchReviews = () => api.getReviews();

export default function Reviews({ onLogout }: { onLogout: () => void }) {
  const { state, reload } = useAsync<Review[]>(fetchReviews);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mis reseñas</IonTitle>
          <IonButtons slot="end"><IonButton onClick={onLogout}>Salir</IonButton></IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* Estado 1: carga */}
        {state.status === 'loading' && (
          <div className="ion-text-center ion-padding">
            <IonSpinner />
            <p>Cargando reseñas…</p>
          </div>
        )}

        {/* Estado 2: error (sin red, 401, servidor) con opción de reintentar */}
        {state.status === 'error' && (
          <div className="ion-text-center ion-padding">
            <IonText color="danger">
              <h3>{state.error instanceof NetworkError ? 'Sin conexión' : 'No pudimos cargar'}</h3>
              <p role="alert">{describeError(state.error)}</p>
            </IonText>
            <IonButton onClick={reload}>Reintentar</IonButton>
          </div>
        )}

        {/* Estado 3: datos (incluye lista vacía) */}
        {state.status === 'success' && (state.data.length === 0 ? (
          <p className="ion-text-center ion-padding">Aún no tienes reseñas.</p>
        ) : (
          <IonList>
            {state.data.map((r) => (
              <IonItem key={r.id}>
                <IonLabel>
                  <h2>Película #{r.pelicula_id_tmdb ?? r.id} · {r.calificacion ?? '–'}/5</h2>
                  <p>{r.comentario ?? r.resena ?? r.texto ?? 'Sin comentario'}</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        ))}
      </IonContent>
    </IonPage>
  );
}
