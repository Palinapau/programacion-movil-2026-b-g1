import { FormEvent, useState } from 'react';
import {
  IonButton, IonContent, IonHeader, IonInput, IonItem, IonPage, IonSpinner, IonText, IonTitle, IonToolbar,
} from '@ionic/react';
import { api, describeError } from '../api/client';

export default function Login({ onLogged }: { onLogged: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.login(email.trim(), password);
      onLogged();
    } catch (err) {
      setError(describeError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <IonPage>
      <IonHeader><IonToolbar><IonTitle>Movie Rater</IonTitle></IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={submit}>
          <IonItem>
            <IonInput label="Correo" labelPlacement="floating" type="email" value={email}
              onIonInput={(e) => setEmail(String(e.detail.value ?? ''))} required />
          </IonItem>
          <IonItem>
            <IonInput label="Contraseña" labelPlacement="floating" type="password" value={password}
              onIonInput={(e) => setPassword(String(e.detail.value ?? ''))} required />
          </IonItem>
          {error && <IonText color="danger"><p role="alert">{error}</p></IonText>}
          <IonButton expand="block" type="submit" disabled={loading} className="ion-margin-top">
            {loading ? <IonSpinner name="dots" /> : 'Iniciar sesión'}
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
}
