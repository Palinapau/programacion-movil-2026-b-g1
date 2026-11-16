// Formateo de coordenadas para mostrarlas al usuario (se usa en la tarjeta de ubicación del Home).
// Ejemplo: formatearCoordenadas(2.9273, -75.2819) -> "2.9273° N, 75.2819° O"

export const formatearCoordenadas = (
  latitud: number,
  longitud: number,
  decimales = 4
): string => {
  const ns = latitud >= 0 ? 'N' : 'S';
  const eo = longitud >= 0 ? 'E' : 'O';

  return `${Math.abs(latitud).toFixed(decimales)}° ${ns}, ${Math.abs(longitud).toFixed(decimales)}° ${eo}`;
};
