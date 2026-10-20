
import { Navigate, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { homeOutline, personOutline } from 'ionicons/icons';

import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import './theme/variables.css';

setupIonicReact();

const MainTabs: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route
        path="/tabs/home"
        element={<Home />}
      />
      <Route
        path="/tabs/profile"
        element={<Profile />}
      />
      <Route
        path="/tabs"
        element={<Navigate to="/tabs/home" replace />}
      />
    </IonRouterOutlet>

    <IonTabBar slot="bottom">
      <IonTabButton tab="home" href="/tabs/home">
        <IonIcon icon={homeOutline} />
        <IonLabel>Inicio</IonLabel>
      </IonTabButton>

      <IonTabButton tab="profile" href="/tabs/profile">
        <IonIcon icon={personOutline} />
        <IonLabel>Mi perfil</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tabs/*" element={<MainTabs />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
