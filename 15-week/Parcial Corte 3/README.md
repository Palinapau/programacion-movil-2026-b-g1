# Parcial práctico · Corte 3 — Programación Móvil (Movie Rater)

**Estudiante:** Paulina Díaz Perdomo
**Proyecto:** Movie Rater (Ionic React 9 + Capacitor 8 + Vite + Vitest). Los cambios están hechos sobre `mr-app-entrega`.

## Cómo aplicarlo al proyecto
```bash
cd mr-app-entrega
git apply ../parcial-corte3.patch      # o copiar la carpeta archivos/ encima del proyecto
npm install                            # instala @capacitor/geolocation
npm run test.unit -- --run             # 39 pruebas (33 que ya existían + 6 nuevas)
npm run dev
```

## Problema 1 — Hardware (Capacitor Geolocation)
- `src/services/ubicacion.ts`: revisa el permiso, lo solicita y devuelve `concedido` (con coordenadas),
  `denegado` o `error`. Si se niega, **no** intenta leer la ubicación.
- `src/components/UbicacionCard.tsx`: tarjeta en el Home con el botón "Usar mi ubicación". Muestra las
  coordenadas (foto o coordenadas: aquí coordenadas) o un mensaje claro cuando el permiso fue denegado,
  y la app sigue funcionando.
- Para probar en dispositivo: `npx cap add android && npm run build && npx cap sync android`, y en
  `AndroidManifest.xml` agregar `ACCESS_COARSE_LOCATION` y `ACCESS_FINE_LOCATION`. En iOS, la clave
  `NSLocationWhenInUseUsageDescription` en `Info.plist`.

**Why permissions matter (English):**
Apps must request permission because location data is private, and the operating system requires the
user's explicit consent before an app can read it. When the user denies access, the app should handle it
gracefully: explain why the feature is unavailable, keep working, and let the user try again or enable the
permission later in the device settings.

## Problema 2 — Conectividad
La búsqueda del Home (`handleSearch` en `src/pages/Home.tsx`) ya consume la API de TMDB con `fetch` y muestra
los tres estados: **cargando** (spinner), **datos** (lista de películas) y **error** con el botón
"Intentar de nuevo". Lo que se agregó es la comprobación:
`src/pages/Home.busqueda.test.tsx` simula el fallo de red (`fetch` rechaza con `TypeError: Failed to fetch`),
verifica que la app **avisa**, y que al tocar **reintentar** con la red de vuelta aparecen los resultados.
Prueba manual: en el navegador, DevTools → Network → *Offline*, buscar una película, ver el aviso, volver a *Online* y reintentar.

## Problema 3 — Testing
`src/services/formato.test.ts`: 2 pruebas unitarias de `formatearCoordenadas` (la función que usa la tarjeta
del Problema 1). Cada prueba explica en comentarios qué verifica:
1. Caso normal: Neiva (`2.9273, -75.2819`) → `2.9273° N, 75.2819° O` (letra de hemisferio, sin signo negativo, 4 decimales).
2. Caso borde: `-33.8688, 151.2093` con 2 decimales → `33.87° S, 151.21° E` (hemisferio opuesto y redondeo).

Además hay pruebas extra de `ubicacion.ts` (concedido / denegado / error del navegador) en `ubicacion.test.ts`.
