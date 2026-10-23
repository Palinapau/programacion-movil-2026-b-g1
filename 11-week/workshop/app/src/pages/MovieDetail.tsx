import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonPage,
  IonSpinner,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovie, Movie } from '../services/tmdb';
import { crearResena } from '../services/api';
import './MovieDetail.css';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    let activo = true;

    const loadMovie = async () => {
      const movieId = Number(id);

      if (!id || !Number.isInteger(movieId) || movieId <= 0) {
        setMovie(null);
        setError('El identificador de la película no es válido.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        setMovie(null);

        const result = await getMovie(movieId);

        if (!activo) return;

        if (!result) {
          setError('No se encontró la película solicitada.');
          return;
        }

        setMovie(result);
      } catch (err) {
        console.error('Error cargando película:', err);
        if (activo) {
          setError('No se pudo cargar la película. Inténtalo de nuevo.');
        }
      } finally {
        if (activo) setLoading(false);
      }
    };

    loadMovie();

    return () => {
      activo = false;
    };
  }, [id]);

  const handleSaveReview = async () => {
    if (rating === 0) {
      setSaveMessage('Selecciona una calificación de 1 a 5.');
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      setSaveMessage('Debes iniciar sesión para guardar una reseña.');
      return;
    }

    try {
      setSaveMessage('Guardando reseña...');

      await crearResena(Number(id), rating, review, token);

      setSaveMessage('¡Reseña guardada correctamente!');
      setReview('');
    } catch (err) {
      console.error('Error guardando reseña:', err);
      setSaveMessage('No se pudo guardar la reseña.');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/home" />
          </IonButtons>
          <IonTitle>Detalle</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {loading && (
          <div className="detail-loading">
            <IonSpinner />
            <p>Cargando película...</p>
          </div>
        )}

        {!loading && error && (
          <IonText color="danger">
            <p className="detail-error">{error}</p>
          </IonText>
        )}

        {!loading && !error && !movie && (
          <IonText>
            <p className="detail-error">No se encontró la película.</p>
          </IonText>
        )}

        {!loading && movie && (
          <div className="movie-detail">
            {movie.poster_path && (
              <IonImg
                className="movie-detail-poster"
                src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                alt={`Póster de ${movie.title}`}
              />
            )}

            <IonCard>
              <IonCardContent>
                <h1>{movie.title}</h1>

                <p>
                  <strong>Fecha de estreno:</strong>{' '}
                  {movie.release_date || 'No disponible'}
                </p>

                <p>
                  <strong>Calificación TMDB:</strong>{' '}
                  ⭐ {Number(movie.vote_average ?? 0).toFixed(1)}
                </p>

                <h2>Sinopsis</h2>
                <p>{movie.overview || 'No hay una sinopsis disponible.'}</p>

                <h2>Tu calificación</h2>
                <div className="rating-buttons">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <IonButton
                      key={value}
                      aria-label={`Calificar película con ${value} estrellas`}
                      fill={rating === value ? 'solid' : 'outline'}
                      onClick={() => setRating(value)}
                    >
                      {value} ⭐
                    </IonButton>
                  ))}
                </div>

                <IonItem>
                  <IonLabel position="stacked">Tu reseña</IonLabel>
                  <IonTextarea
                    value={review}
                    placeholder="Escribe tu opinión sobre la película..."
                    autoGrow={true}
                    onIonInput={(event) =>
                      setReview(event.detail.value ?? '')
                    }
                  />
                </IonItem>

                <IonButton expand="block" onClick={handleSaveReview}>
                  Guardar reseña
                </IonButton>

                {saveMessage && (
                  <IonText>
                    <p>{saveMessage}</p>
                  </IonText>
                )}
              </IonCardContent>
            </IonCard>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default MovieDetail;