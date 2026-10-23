
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

  const [tocado, setTocado] = useState({
    nombre: false,
    correo: false,
    contrasena: false,
    confirmarContrasena: false,
  });

  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());

  const errores = {
    nombre: nombre.trim() ? '' : 'El nombre es obligatorio.',
    correo: !correo.trim()
      ? 'El correo es obligatorio.'
      : !correoValido
        ? 'Ingresa un correo válido.'
        : '',
    contrasena: contrasena ? '' : 'La contraseña es obligatoria.',
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

    if (!formularioValido) return;

    try {
      setError('');

      const data = await registrarUsuario(
        nombre.trim(),
        correo.trim(),
        contrasena
      );

      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      navigate('/home');
    } catch (err) {
      console.error('Error registrando usuario:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo crear la cuenta.'
      );
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Movie Rater</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="auth-container">
          <h1>Crear cuenta</h1>

          <IonItem>
            <IonLabel position="stacked">Nombre</IonLabel>
            <IonInput
              value={nombre}
              placeholder="Tu nombre"
              aria-label="Nombre"
              onIonInput={(event) => {
                setNombre(event.detail.value ?? '');
                setTocado((prev) => ({ ...prev, nombre: true }));
              }}
            />
          </IonItem>
          {tocado.nombre && errores.nombre && (
            <IonText color="danger">
              <p className="field-error">{errores.nombre}</p>
            </IonText>
          )}

          <IonItem>
            <IonLabel position="stacked">Correo</IonLabel>
            <IonInput
              type="email"
              value={correo}
              placeholder="correo@ejemplo.com"
              aria-label="Correo electrónico"
              onIonInput={(event) => {
                setCorreo(event.detail.value ?? '');
                setTocado((prev) => ({ ...prev, correo: true }));
              }}
            />
          </IonItem>
          {tocado.correo && errores.correo && (
            <IonText color="danger">
              <p className="field-error">{errores.correo}</p>
            </IonText>
          )}

          <IonItem>
            <IonLabel position="stacked">Contraseña</IonLabel>
            <IonInput
              type="password"
              value={contrasena}
              placeholder="Tu contraseña"
              aria-label="Contraseña"
              onIonInput={(event) => {
                setContrasena(event.detail.value ?? '');
                setTocado((prev) => ({ ...prev, contrasena: true }));
              }}
            />
          </IonItem>
          {tocado.contrasena && errores.contrasena && (
            <IonText color="danger">
              <p className="field-error">{errores.contrasena}</p>
            </IonText>
          )}

          <IonItem>
            <IonLabel position="stacked">Confirmar contraseña</IonLabel>
            <IonInput
              type="password"
              value={confirmarContrasena}
              placeholder="Repite tu contraseña"
              aria-label="Confirmar contraseña"
              onIonInput={(event) => {
                setConfirmarContrasena(event.detail.value ?? '');
                setTocado((prev) => ({
                  ...prev,
                  confirmarContrasena: true,
                }));
              }}
            />
          </IonItem>
          {tocado.confirmarContrasena && errores.confirmarContrasena && (
            <IonText color="danger">
              <p className="field-error">{errores.confirmarContrasena}</p>
            </IonText>
          )}

          {error && (
            <IonText color="danger">
              <p role="alert">{error}</p>
            </IonText>
          )}

          <IonButton expand="block" onClick={handleRegister}>
            Registrarme
          </IonButton>

          <IonButton
            expand="block"
            fill="clear"
            onClick={() => navigate('/login')}
          >
            Ya tengo una cuenta
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
