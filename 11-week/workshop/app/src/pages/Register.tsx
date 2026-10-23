import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  IonToast,
} from '@ionic/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrarUsuario } from '../services/api';
import './Auth.css';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [toastAbierto, setToastAbierto] = useState(false);
  const [mensajeToast, setMensajeToast] = useState('');
  const [tocado, setTocado] = useState({
    nombre: false,
    correo: false,
    contrasena: false,
    confirmarContrasena: false,
  });

  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    correo.trim()
  );

  const errores = {
    nombre: nombre.trim() ? '' : 'El nombre es obligatorio.',
    correo: !correo.trim()
      ? 'El correo es obligatorio.'
      : !correoValido
        ? 'Ingresa un correo válido.'
        : '',
    contrasena: contrasena
      ? ''
      : 'La contraseña es obligatoria.',
    confirmarContrasena: !confirmarContrasena
      ? 'Confirma tu contraseña.'
      : confirmarContrasena !== contrasena
        ? 'Las contraseñas no coinciden.'
        : '',
  };

  const formularioValido = Object.values(errores).every(
    (mensaje) => mensaje === ''
  );

  const handleRegister = async () => {
    setTocado({
      nombre: true,
      correo: true,
      contrasena: true,
      confirmarContrasena: true,
    });

    if (!formularioValido || cargando) {
      return;
    }

    setCargando(true);
    setError('');

    try {
      const respuesta = await registrarUsuario(
        nombre.trim(),
        correo.trim(),
        contrasena
      );

      localStorage.setItem('token', respuesta.token);
      localStorage.setItem(
        'usuario',
        JSON.stringify(respuesta.usuario)
      );

      setMensajeToast('¡Cuenta creada correctamente!');
      setToastAbierto(true);

      navigate('/home');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No fue posible crear la cuenta. Inténtalo de nuevo.'
      );
      setMensajeToast('No se pudo crear la cuenta. Verifica el servidor.');
      setToastAbierto(true);
    } finally {
      setCargando(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Crear cuenta</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="auth-container">
          <h1>Crear cuenta</h1>

          <IonItem>
            <IonLabel position="stacked">Nombre</IonLabel>
            <IonInput
              aria-label="Nombre"
              placeholder="Tu nombre"
              value={nombre}
              autocomplete="name"
              onIonInput={(event) => {
                setNombre(event.detail.value ?? '');
                setTocado((prev) => ({ ...prev, nombre: true }));
              }}
            />
          </IonItem>
          {tocado.nombre && errores.nombre && (
            <IonText color="danger">
              <p>{errores.nombre}</p>
            </IonText>
          )}

          <IonItem>
            <IonLabel position="stacked">Correo</IonLabel>
            <IonInput
              aria-label="Correo electrónico"
              type="email"
              placeholder="correo@ejemplo.com"
              value={correo}
              autocomplete="email"
              onIonInput={(event) => {
                setCorreo(event.detail.value ?? '');
                setTocado((prev) => ({ ...prev, correo: true }));
              }}
            />
          </IonItem>
          {tocado.correo && errores.correo && (
            <IonText color="danger">
              <p>{errores.correo}</p>
            </IonText>
          )}

          <IonItem>
            <IonLabel position="stacked">Contraseña</IonLabel>
            <IonInput
              aria-label="Contraseña"
              type="password"
              placeholder="Tu contraseña"
              value={contrasena}
              autocomplete="new-password"
              onIonInput={(event) => {
                setContrasena(event.detail.value ?? '');
                setTocado((prev) => ({
                  ...prev,
                  contrasena: true,
                }));
              }}
            />
          </IonItem>
          {tocado.contrasena && errores.contrasena && (
            <IonText color="danger">
              <p>{errores.contrasena}</p>
            </IonText>
          )}

          <IonItem>
            <IonLabel position="stacked">
              Confirmar contraseña
            </IonLabel>
            <IonInput
              aria-label="Confirmar contraseña"
              type="password"
              placeholder="Repite tu contraseña"
              value={confirmarContrasena}
              autocomplete="new-password"
              onIonInput={(event) => {
                setConfirmarContrasena(event.detail.value ?? '');
                setTocado((prev) => ({
                  ...prev,
                  confirmarContrasena: true,
                }));
              }}
            />
          </IonItem>
          {tocado.confirmarContrasena &&
            errores.confirmarContrasena && (
              <IonText color="danger">
                <p>{errores.confirmarContrasena}</p>
              </IonText>
            )}

          {error && (
            <IonText color="danger">
              <p role="alert">{error}</p>
            </IonText>
          )}

          <IonButton
  expand="block"
  onClick={handleRegister}
  disabled={cargando || !formularioValido}
>
  {cargando ? 'Registrando…' : 'Registrarme'}
</IonButton>

          <IonButton
            expand="block"
            fill="clear"
            onClick={() => navigate('/login')}
            disabled={cargando}
          >
            Ya tengo una cuenta
          </IonButton>
          <IonToast
  isOpen={toastAbierto}
  message={mensajeToast}
  duration={2500}
  onDidDismiss={() => setToastAbierto(false)}
  position="top"
/>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;