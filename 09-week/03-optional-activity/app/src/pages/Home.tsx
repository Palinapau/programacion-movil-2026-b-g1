import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Home.css';

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
}

const API_URL = 'http://localhost:3000';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const cargarTareas = async () => {
    try {
      setError('');
      setCargando(true);

      const response = await fetch(`${API_URL}/tareas`);

      if (!response.ok) {
        throw new Error('No se pudieron cargar las tareas.');
      }

      const data: Tarea[] = await response.json();
      setTareas(data);
    } catch (error) {
      setError('No se pudieron cargar las tareas. Verifica que la API esté funcionando.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarTareas();
  }, []);

  const crearTarea = async () => {
    if (!titulo.trim() || !descripcion.trim()) {
      setError('El título y la descripción son obligatorios.');
      return;
    }

    try {
      setError('');

      const response = await fetch(`${API_URL}/tareas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo: titulo.trim(),
          descripcion: descripcion.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'No se pudo crear la tarea.');
      }

      const nuevaTarea: Tarea = await response.json();

      setTareas((tareasActuales) => [...tareasActuales, nuevaTarea]);

      setTitulo('');
      setDescripcion('');
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudo crear la tarea.'
      );
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mis tareas</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="home-container">
          <h1>Lista de tareas</h1>

          {error && (
            <IonText color="danger">
              <p className="error-message">{error}</p>
            </IonText>
          )}

          {cargando ? (
            <p>Cargando tareas...</p>
          ) : (
            <IonList>
              {tareas.map((tarea) => (
                <IonItem
                  key={tarea.id}
                  button
                  onClick={() =>
                    navigate(`/detail/${tarea.id}`, {
                      state: { tarea },
                    })
                  }
                >
                  <IonLabel>
                    <h2>{tarea.titulo}</h2>
                    <p>{tarea.descripcion}</p>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          )}

          <div className="form-container">
            <h2>Nueva tarea</h2>

            <IonItem>
              <IonInput
                label="Título"
                labelPlacement="stacked"
                placeholder="Escribe el título"
                value={titulo}
                onIonInput={(event) =>
                  setTitulo(event.detail.value ?? '')
                }
              />
            </IonItem>

            <IonItem>
              <IonInput
                label="Descripción"
                labelPlacement="stacked"
                placeholder="Escribe la descripción"
                value={descripcion}
                onIonInput={(event) =>
                  setDescripcion(event.detail.value ?? '')
                }
              />
            </IonItem>

            <IonButton
              expand="block"
              className="create-button"
              onClick={crearTarea}
            >
              Crear tarea
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;