# Parcial práctico · Corte 3

**Estudiante:** Paulina Díaz Perdomo

Proyecto React + Vite + Capacitor.

## Cómo correr
```bash
npm install
npm run dev      # abrir en el navegador
npm test         # pruebas unitarias (Problema 3)
npx cap add android && npm run build && npx cap sync   # opcional, para el dispositivo
```

## Problema 1 — Hardware (Capacitor Geolocation)
`src/components/LocationCard.tsx`: revisa el permiso, lo solicita, y maneja el caso **denegado**
mostrando un mensaje claro sin romper la app. Si se concede, muestra las coordenadas.

**Why permissions matter (English):**
Apps must request permission because the camera, location and similar sensors expose private user data,
and the operating system requires the user's explicit consent before the app can use them.
When the user denies access, the app should handle it gracefully: explain why the feature is unavailable,
avoid crashing, and let the user retry or enable the permission later in settings.

## Problema 2 — Conectividad
`src/components/PostsList.tsx`: consume una API con `fetch` y muestra los tres estados
(cargando / datos / error). El checkbox "Simular fallo de red" fuerza un error y aparece el botón **Reintentar**.

## Problema 3 — Testing
`src/utils/format.test.ts`: 2 pruebas unitarias de `formatCoords` (cada una explicada en comentarios).
