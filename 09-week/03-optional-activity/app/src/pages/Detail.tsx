import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useLocation } from 'react-router-dom';

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
}

const Detail: React.FC = () => {
  const location = useLocation();

  const tarea = (location.state as { tarea?: Tarea } | null)?.tarea;

  if (!tarea) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home" />
            </IonButtons>
            <IonTitle>Detalle</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          <h2>Tarea no encontrada</h2>
          <p>No se encontró información para esta tarea.</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>

          <IonTitle>Detalle de tarea</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h1>{tarea.titulo}</h1>

        <p>
          <strong>Descripción:</strong>
        </p>

        <p>{tarea.descripcion}</p>

        <p>
          <strong>ID:</strong> {tarea.id}
        </p>
      </IonContent>
    </IonPage>
  );
};

export default Detail;