import { useEffect, useState } from 'react';
import {
  IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { locate, chatbubbles } from 'ionicons/icons';
import { api } from './api/client';
import Login from './pages/Login';
import Reviews from './pages/Reviews';
import LocationPage from './pages/LocationPage';

setupIonicReact();

export default function App() {
  const [logged, setLogged] = useState(api.isLoggedIn());

  // Si cualquier petición recibe 401, la API limpia el token y volvemos al login.
  useEffect(() => {
    const onUnauthorized = () => setLogged(false);
    window.addEventListener('auth:unauthorized', onUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', onUnauthorized);
  }, []);

  if (!logged) {
    return (
      <IonApp>
        <Login onLogged={() => setLogged(true)} />
      </IonApp>
    );
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/reviews"><Reviews onLogout={() => { api.logout(); setLogged(false); }} /></Route>
            <Route exact path="/location"><LocationPage /></Route>
            <Route exact path="/"><Redirect to="/reviews" /></Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="reviews" href="/reviews">
              <IonIcon icon={chatbubbles} />
              <IonLabel>Reseñas</IonLabel>
            </IonTabButton>
            <IonTabButton tab="location" href="/location">
              <IonIcon icon={locate} />
              <IonLabel>Ubicación</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
}
