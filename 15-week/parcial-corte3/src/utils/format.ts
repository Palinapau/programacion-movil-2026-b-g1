/**
 * Formatea coordenadas para mostrarlas al usuario (usado en el Problema 1).
 * Ejemplo: formatCoords(2.9273, -75.2819) -> "2.9273° N, 75.2819° W"
 */
export function formatCoords(lat: number, lng: number, decimals = 4): string {
  const ns = lat >= 0 ? 'N' : 'S';
  const ew = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(decimals)}° ${ns}, ${Math.abs(lng).toFixed(decimals)}° ${ew}`;
}
