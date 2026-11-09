export interface Coords {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

/** Formatea coordenadas como "2.9273° N, 75.2819° W". */
export function formatCoords({ latitude, longitude }: Coords, decimals = 4): string {
  const ns = latitude >= 0 ? 'N' : 'S';
  const ew = longitude >= 0 ? 'E' : 'W';
  return `${Math.abs(latitude).toFixed(decimals)}° ${ns}, ${Math.abs(longitude).toFixed(decimals)}° ${ew}`;
}

/** Enlace de Google Maps para abrir la ubicación. */
export function mapsLink({ latitude, longitude }: Coords): string {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}
