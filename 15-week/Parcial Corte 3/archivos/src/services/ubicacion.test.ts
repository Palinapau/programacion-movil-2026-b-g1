import { beforeEach, describe, expect, test, vi } from 'vitest';

const geolocation = vi.hoisted(() => ({
  checkPermissions: vi.fn(),
  requestPermissions: vi.fn(),
  getCurrentPosition: vi.fn(),
}));

vi.mock('@capacitor/geolocation', () => ({ Geolocation: geolocation }));

import { obtenerUbicacion } from './ubicacion';

describe('obtenerUbicacion', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('si el permiso está concedido devuelve las coordenadas', async () => {
    geolocation.checkPermissions.mockResolvedValue({ location: 'granted' });
    geolocation.getCurrentPosition.mockResolvedValue({
      coords: { latitude: 2.9273, longitude: -75.2819 },
    });

    await expect(obtenerUbicacion()).resolves.toEqual({
      estado: 'concedido',
      latitud: 2.9273,
      longitud: -75.2819,
    });
  });

  test('si el usuario niega el permiso no lee la ubicación y avisa que fue denegado', async () => {
    geolocation.checkPermissions.mockResolvedValue({ location: 'prompt' });
    geolocation.requestPermissions.mockResolvedValue({ location: 'denied' });

    await expect(obtenerUbicacion()).resolves.toEqual({ estado: 'denegado' });
    expect(geolocation.getCurrentPosition).not.toHaveBeenCalled();
  });

  test('si el navegador rechaza la lectura por permisos también se trata como denegado', async () => {
    geolocation.checkPermissions.mockRejectedValue(new Error('not supported'));
    geolocation.requestPermissions.mockRejectedValue(new Error('Not implemented on web'));
    geolocation.getCurrentPosition.mockRejectedValue(new Error('User denied Geolocation'));

    await expect(obtenerUbicacion()).resolves.toEqual({ estado: 'denegado' });
  });
});
