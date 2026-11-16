import { describe, expect, test } from 'vitest';
import { formatearCoordenadas } from './formato';

describe('formatearCoordenadas', () => {
  // Prueba 1 (caso normal): Neiva está al norte del ecuador y al oeste de Greenwich.
  // Verifica que se quite el signo negativo del número, se agregue la letra N/O
  // y se usen 4 decimales por defecto.
  test('muestra N y O con 4 decimales para una ubicación como Neiva', () => {
    expect(formatearCoordenadas(2.9273, -75.2819)).toBe('2.9273° N, 75.2819° O');
  });

  // Prueba 2 (caso borde): hemisferio sur y este, con decimales personalizados.
  // Verifica que latitud negativa dé "S", longitud positiva dé "E"
  // y que el parámetro `decimales` redondee bien.
  test('usa S y E para el hemisferio opuesto y respeta los decimales pedidos', () => {
    expect(formatearCoordenadas(-33.8688, 151.2093, 2)).toBe('33.87° S, 151.21° E');
  });
});
