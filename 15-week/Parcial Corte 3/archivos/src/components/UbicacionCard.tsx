import { IonButton, IonCard, IonSpinner } from '@ionic/react';
import { useState } from 'react';
import { formatearCoordenadas } from '../services/formato';
import { obtenerUbicacion, ResultadoUbicacion } from '../services/ubicacion';

// Tarjeta que usa el plugin de ubicación: pide el permiso, muestra las coordenadas
// y, si el usuario lo niega, explica qué pasó sin romper el resto de la app.

type Estado = ResultadoUbicacion | { estado: 'inicial' } | { estado: 'cargando' };

const UbicacionCard: React.FC = () => {
  const [resultado, setResultado] = useState<Estado>({ estado: 'inicial' });

  const usarMiUbicacion = async () => {
    setResultado({ estado: 'cargando' });
    setResultado(await obtenerUbicacion());
  };

  return (
    <IonCard className="que-veo-card ubicacion-card">
      <span className="section-eyebrow">CERCA DE TI</span>
      <h2>Tu ubicación</h2>

      {resultado.estado === 'inicial' && (
        <p>Permite el acceso a tu ubicación para saber desde dónde estás viendo cine.</p>
      )}

      {resultado.estado === 'cargando' && (
        <div className="home-state">
          <IonSpinner name="crescent" />
          <p>Obteniendo tu ubicación...</p>
        </div>
      )}

      {resultado.estado === 'concedido' && (
        <p>📍 {formatearCoordenadas(resultado.latitud, resultado.longitud)}</p>
      )}

      {resultado.estado === 'denegado' && (
        <p role="alert">
          Sin permiso de ubicación no podemos mostrarte dónde estás. La app sigue funcionando
          igual; puedes activar el permiso en los ajustes del dispositivo y volver a intentar.
        </p>
      )}

      {resultado.estado === 'error' && <p role="alert">{resultado.mensaje}</p>}

      <IonButton
        onClick={usarMiUbicacion}
        disabled={resultado.estado === 'cargando'}
      >
        {resultado.estado === 'inicial' ? 'Usar mi ubicación' : 'Intentar de nuevo'}
      </IonButton>
    </IonCard>
  );
};

export default UbicacionCard;
