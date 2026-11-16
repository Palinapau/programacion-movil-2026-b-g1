import { beforeEach, describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

// Problema 2: la búsqueda del Home muestra cargando / datos / error y permite reintentar
// cuando falla la red. El fallo de red se simula haciendo que searchMovies rechace igual que
// fetch sin conexión (TypeError: Failed to fetch).
//
// La búsqueda se lanza tocando un chip de "recientes": ejecuta exactamente la misma función
// que escribir en el buscador (handleSearch), pero es un clic normal y funciona en pruebas.

const tmdb = vi.hoisted(() => ({ searchMovies: vi.fn(), getMovie: vi.fn() }));

vi.mock('../services/tmdb', () => tmdb);
vi.mock('../services/storage', () => ({ obtenerToken: () => null, obtenerUsuario: () => null }));
vi.mock('../services/busquedas', () => ({
  obtenerBusquedas: async () => ['matrix'],
  guardarBusqueda: async () => ['matrix'],
  borrarBusquedas: async () => undefined,
}));
vi.mock('../components/UbicacionCard', () => ({ default: () => null }));

import Home from './Home';

const pelicula = {
  id: 603,
  title: 'The Matrix',
  overview: '',
  poster_path: null,
  backdrop_path: null,
  release_date: '1999-03-30',
  vote_average: 8.2,
};

describe('búsqueda de películas sin conexión', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  test('avisa cuando falla la red y permite reintentar hasta ver los resultados', async () => {
    // Primer intento: sin red. Segundo intento: la red vuelve y responde bien.
    tmdb.searchMovies
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce([pelicula]);

    render(<Home />);

    // Estado "cargando" -> "error": la app avisa en lugar de quedarse colgada.
    fireEvent.click(await screen.findByText('matrix'));

    expect(await screen.findByText(/No pudimos cargar las películas/i)).toBeTruthy();
    expect(screen.queryByText('The Matrix')).toBeNull();

    // Reintento: aparecen los datos y desaparece el error.
    fireEvent.click(screen.getByText('Intentar de nuevo'));

    expect(await screen.findByText('The Matrix')).toBeTruthy();
    await waitFor(() =>
      expect(screen.queryByText(/No pudimos cargar las películas/i)).toBeNull()
    );
    expect(tmdb.searchMovies).toHaveBeenCalledTimes(2);
    expect(tmdb.searchMovies).toHaveBeenLastCalledWith('matrix');
  });
});
