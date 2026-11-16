
import {
  IonBadge,
  IonButton,
  IonCard,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonSearchbar,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { bookmarkOutline, searchOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { getMovie, searchMovies, Movie } from '../services/tmdb';
import { mensajeDeError, obtenerResenas, Resena } from '../services/api';
import {
  borrarBusquedas,
  guardarBusqueda,
  obtenerBusquedas,
} from '../services/busquedas';
import {
  ordenarPorRecientes,
  rachaSemanal,
  resumirMemoria,
} from '../services/memoria';
import { obtenerToken } from '../services/storage';
import UbicacionCard from '../components/UbicacionCard';
import './Home.css';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const POSTER_PEQUENO_URL = 'https://image.tmdb.org/t/p/w185';
const MAXIMO_RECUERDOS = 10;

interface Recuerdo extends Resena {
  movie?: Movie;
}

const Home: React.FC = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [misResenas, setMisResenas] = useState<Resena[]>([]);
  const [recuerdos, setRecuerdos] = useState<Recuerdo[]>([]);
  const [cargandoMemoria, setCargandoMemoria] = useState(true);
  const [errorMemoria, setErrorMemoria] = useState('');
  const [recientes, setRecientes] = useState<string[]>([]);

  const resumen = resumirMemoria(misResenas);
  const racha = rachaSemanal(misResenas);

  const cargarRecientes = async () => {
    setRecientes(await obtenerBusquedas());
  };

  // Se guarda al confirmar la búsqueda, no en cada letra: "fig" no es una búsqueda reciente.
  const recordarBusqueda = async (texto: string) => {
    setRecientes(await guardarBusqueda(texto));
  };

  const limpiarRecientes = async () => {
    await borrarBusquedas();
    setRecientes([]);
  };

  // Lo que hace distinta a la app: lo que la persona ya vio y lo que pensó de cada película.
  const cargarMemoria = async () => {
    const token = obtenerToken();

    if (!token) {
      setCargandoMemoria(false);
      return;
    }

    try {
      setCargandoMemoria(true);
      setErrorMemoria('');

      const resenas = ordenarPorRecientes(await obtenerResenas(token));

      setMisResenas(resenas);

      const conPelicula = await Promise.all(
        resenas.slice(0, MAXIMO_RECUERDOS).map(async (resena) => {
          try {
            const movie = await getMovie(resena.pelicula_id_tmdb);

            return { ...resena, movie };
          } catch {
            return resena;
          }
        })
      );

      setRecuerdos(conPelicula);
    } catch (err) {
      console.error('Error cargando la memoria de cine:', err);
      setErrorMemoria(
        mensajeDeError(err, 'No pudimos cargar tu memoria de cine.')
      );
    } finally {
      setCargandoMemoria(false);
    }
  };

  // Ionic no avisa de la primera entrada justo después del login, así que se carga al montar.
  useEffect(() => {
    cargarMemoria();
    cargarRecientes();
  }, []);

  // Ionic deja la pantalla montada: al volver de reseñar hay que ver lo nuevo.
  useIonViewWillEnter(() => {
    cargarMemoria();
    cargarRecientes();
  });

  const handleSearch = async (value: string) => {
    setQuery(value);
    setError('');

    if (!value.trim()) {
      setMovies([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const results = await searchMovies(value);
      setMovies(results);
    } catch (err) {
      console.error('Error buscando películas:', err);
      setMovies([]);
      setError('No pudimos cargar las películas. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage className="movie-home">
      <IonHeader className="home-header">
        <IonToolbar>
          <div className="home-brand">
            <span className="brand-mark">MR</span>
            <IonTitle>
              <span className="brand-name">MOVIE</span>
              <span className="brand-accent">RATER</span>
            </IonTitle>
          </div>

          <IonButton
            slot="end"
            fill="clear"
            routerLink="/por-ver"
            className="lista-button"
            aria-label="Ir a mi lista por ver"
          >
            <IonIcon icon={bookmarkOutline} />
          </IonButton>

          <IonButton
            slot="end"
            fill="clear"
            routerLink="/profile"
            className="profile-button"
            aria-label="Ir a mi perfil"
          >
            <span className="profile-avatar">MR</span>
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="home-content">
        <main className="home-container">
          <section className="hero-section">
            <div className="hero-copy">
              <IonBadge className="hero-badge">
                <span className="badge-star">★</span>
                PARA CINÉFILOS DE CORAZÓN
              </IonBadge>

              <h1>
                ¿Ya la viste?
                <br />
                <span>Tu memoria de cine lo sabe.</span>
              </h1>

              <p>
                Lo que ves se pierde entre notas sueltas y redes sociales.
                Aquí queda guardado qué viste y qué te pareció, solo para ti.
              </p>

              <div className="hero-search-wrap">
                <IonSearchbar
                  value={query}
                  placeholder="Busca una película..."
                  animated
                  debounce={500}
                  onIonInput={(event) =>
                    handleSearch(event.detail.value ?? '')
                  }
                  className="movie-search"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      void recordarBusqueda(query);
                    }
                  }}
                />
                <IonIcon icon={searchOutline} className="search-decoration" />
              </div>

              {!query.trim() && recientes.length > 0 && (
                <div className="recientes">
                  <span className="recientes-titulo">RECIENTES</span>

                  {recientes.map((busqueda) => (
                    <IonChip
                      key={busqueda}
                      className="reciente-chip"
                      onClick={() => {
                        void recordarBusqueda(busqueda);
                        void handleSearch(busqueda);
                      }}
                    >
                      {busqueda}
                    </IonChip>
                  ))}

                  <IonButton
                    fill="clear"
                    size="small"
                    className="recientes-borrar"
                    onClick={limpiarRecientes}
                  >
                    Borrar
                  </IonButton>
                </div>
              )}

              <div className="hero-tags">
                <span>BUSCA</span>
                <i />
                <span>CALIFICA</span>
                <i />
                <span>RECUERDA</span>
              </div>
            </div>

            <div className="hero-art" aria-hidden="true">
              <div className="art-orbit orbit-one" />
              <div className="art-orbit orbit-two" />
              <div className="art-poster poster-back poster-left">
                <span>YA LA VISTE</span>
                <strong>★★★★★ Te encantó</strong>
              </div>
              <div className="art-poster poster-back poster-right">
                <span>YA LA VISTE</span>
                <strong>★★ No la repetirías</strong>
              </div>
              <div className="art-poster poster-front">
                <div className="art-poster-visual">
                  <span>✦</span>
                </div>
                <div className="art-poster-caption">
                  <span>TU RESEÑA</span>
                  <strong>“El final me dejó sin palabras.”</strong>
                </div>
              </div>
              <span className="art-spark spark-one">✦</span>
              <span className="art-spark spark-two">✦</span>
            </div>
          </section>

          {!query.trim() && (
            <IonCard button routerLink="/por-ver" className="que-veo-card">
              <span className="section-eyebrow">¿NO SABES QUÉ VER?</span>
              <h2>¿Qué veo hoy?</h2>
              <p>Te escogemos una de tu lista según el tiempo que tengas.</p>
            </IonCard>
          )}

          {!query.trim() && <UbicacionCard />}

          {!query.trim() && (
            <section className="memoria-section" aria-labelledby="memoria-titulo">
              <span className="section-eyebrow">TU MEMORIA DE CINE</span>
              <h2 id="memoria-titulo">Lo que ya viste, guardado para ti</h2>

              {cargandoMemoria && (
                <div className="home-state">
                  <IonSpinner name="crescent" />
                  <p>Recordando lo que viste...</p>
                </div>
              )}

              {!cargandoMemoria && errorMemoria && (
                <div className="home-state error-state">
                  <p>{errorMemoria}</p>
                  <IonButton onClick={cargarMemoria}>
                    Intentar de nuevo
                  </IonButton>
                </div>
              )}

              {!cargandoMemoria && !errorMemoria && misResenas.length === 0 && (
                <div className="memoria-vacia">
                  <h3>Tu memoria de cine está vacía</h3>
                  <p>
                    Busca una película que ya hayas visto y califícala.
                    Desde ese momento la app la recordará por ti.
                  </p>
                </div>
              )}

              {!cargandoMemoria && !errorMemoria && misResenas.length > 0 && (
                <>
                  <div className="memoria-cifras">
                    <div>
                      <strong>{resumen.total}</strong>
                      <span>
                        {resumen.total === 1
                          ? 'película vista'
                          : 'películas vistas'}
                      </span>
                    </div>
                    <div>
                      <strong>★ {resumen.promedio}</strong>
                      <span>tu promedio</span>
                    </div>
                    <div>
                      <strong>🔥 {racha}</strong>
                      <span>{racha === 1 ? 'semana seguida' : 'semanas seguidas'}</span>
                    </div>
                  </div>

                  <div className="memoria-carrusel">
                    {recuerdos.map((recuerdo) => (
                      <IonCard
                        key={recuerdo.id}
                        button
                        routerLink={`/movie/${recuerdo.pelicula_id_tmdb}`}
                        className="memoria-card"
                      >
                        {recuerdo.movie?.poster_path ? (
                          <img
                            src={`${POSTER_PEQUENO_URL}${recuerdo.movie.poster_path}`}
                            alt={`Póster de ${recuerdo.movie.title}`}
                          />
                        ) : (
                          <div className="memoria-sin-poster">
                            Sin póster disponible
                          </div>
                        )}

                        <span
                          className="memoria-card-nota"
                          aria-label={`Le diste ${recuerdo.calificacion} de 5 estrellas`}
                        >
                          {'★'.repeat(recuerdo.calificacion)}
                        </span>

                        <span className="memoria-card-titulo">
                          {recuerdo.movie?.title ||
                            `Película #${recuerdo.pelicula_id_tmdb}`}
                        </span>
                      </IonCard>
                    ))}
                  </div>
                </>
              )}
            </section>
          )}

          <section className="results-section">
            <div className="section-heading">
              <div>
                <span className="section-eyebrow">
                  {query.trim() ? 'TU BÚSQUEDA' : 'EL SÉPTIMO ARTE TE ESPERA'}
                </span>
                <h2>
                  {query.trim()
                    ? 'Resultados de búsqueda'
                    : 'Explora el universo del cine'}
                </h2>
                <p>
                  {query.trim()
                    ? `Películas relacionadas con “${query}”.`
                    : 'Escribe un título y te decimos si ya la viste.'}
                </p>
              </div>
              {movies.length > 0 && (
                <span className="results-count">
                  {movies.length} resultados
                </span>
              )}
            </div>

            {loading && (
              <div className="home-state">
                <IonSpinner name="crescent" />
                <p>Buscando películas...</p>
              </div>
            )}

            {!loading && error && (
              <div className="home-state error-state">
                <p>{error}</p>
                <IonButton onClick={() => handleSearch(query)}>
                  Intentar de nuevo
                </IonButton>
              </div>
            )}

            {!loading && !error && query.trim() && movies.length === 0 && (
              <div className="home-state">
                <h3>No encontramos resultados</h3>
                <p>Prueba con otro título de película.</p>
              </div>
            )}

            {!loading && !error && !query.trim() && (
              <div className="home-state welcome-state">
                <span className="welcome-star">✦</span>
                <h3>¿Qué película tienes en mente?</h3>
                <p>
                  Utiliza el buscador para encontrar películas,
                  saber si ya las viste y guardar lo que te parecieron.
                </p>
              </div>
            )}

            {!loading && !error && movies.length > 0 && (
              <div className="movie-list">
                {movies.map((movie) => {
                  const miResena = misResenas.find(
                    (resena) => resena.pelicula_id_tmdb === movie.id
                  );

                  return (
                  <IonCard
                    key={movie.id}
                    button
                    routerLink={`/movie/${movie.id}`}
                    className="movie-card"
                    onClick={() => void recordarBusqueda(query)}
                  >
                    <div className="movie-card-layout">
                      <div className="movie-poster-container">
                        {movie.poster_path ? (
                          <img
                            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                            alt={`Póster de ${movie.title}`}
                            className="movie-poster"
                          />
                        ) : (
                          <div className="poster-placeholder">
                            Sin póster disponible
                          </div>
                        )}
                      </div>

                      <div className="movie-info">
                        <div className="movie-info-top">
                          <span className="movie-category">PELÍCULA</span>
                          <span className="movie-rating">
                            <span className="rating-star">★</span>{' '}
                            {Number(movie.vote_average).toFixed(1)}
                            <span className="rating-total"> / 10 TMDB</span>
                          </span>
                        </div>

                        <h3 className="movie-title">{movie.title}</h3>

                        <span className="movie-year">
                          {movie.release_date
                            ? movie.release_date.substring(0, 4)
                            : 'Fecha desconocida'}
                        </span>

                        {miResena ? (
                          <div className="ya-la-viste">
                            <span className="ya-la-viste-tag">✓ Ya la viste</span>
                            <span
                              className="ya-la-viste-nota"
                              aria-label={`Le diste ${miResena.calificacion} de 5 estrellas`}
                            >
                              Le diste {'★'.repeat(miResena.calificacion)}
                            </span>
                            {miResena.texto && <p>“{miResena.texto}”</p>}
                          </div>
                        ) : (
                          <p className="movie-overview">
                            {movie.overview?.trim() ||
                              'No hay una descripción disponible para esta película.'}
                          </p>
                        )}

                        <span className="movie-link">
                          {miResena ? 'Ver mi reseña' : 'Ver película'}{' '}
                          <span aria-hidden="true">→</span>
                        </span>
                      </div>
                    </div>
                  </IonCard>
                  );
                })}
              </div>
            )}
          </section>

          <footer className="home-footer">
            <span className="footer-star">★</span>
            <IonText>
              Movie Rater · Tu memoria de cine. Datos e imágenes de TMDB;
              esta aplicación usa su API, pero TMDB no la avala ni la certifica.
            </IonText>
          </footer>
        </main>
      </IonContent>
    </IonPage>
  );
};

export default Home;
