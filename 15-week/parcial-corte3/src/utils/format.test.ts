import { describe, it, expect } from 'vitest';
import { formatCoords } from './format';

describe('formatCoords', () => {
  // Prueba 1: caso normal con el hemisferio norte y oeste (Neiva, Huila).
  // Verifica que se agreguen las letras N/W y que el signo negativo se quite
  // del número, dejando 4 decimales por defecto.
  it('formatea coordenadas de Neiva con N y W', () => {
    expect(formatCoords(2.9273, -75.2819)).toBe('2.9273° N, 75.2819° W');
  });

  // Prueba 2: caso borde con el hemisferio sur y este, y decimales personalizados.
  // Verifica que latitud negativa dé "S", longitud positiva dé "E"
  // y que el parámetro `decimals` redondee correctamente.
  it('usa S y E para valores opuestos y respeta el número de decimales', () => {
    expect(formatCoords(-33.8688, 151.2093, 2)).toBe('33.87° S, 151.21° E');
  });
});
