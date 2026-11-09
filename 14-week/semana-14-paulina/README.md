<!-- CONFIG
FULL_NAME: Paulina Diaz Perdomo
GITHUB_USER: Palinapau
-->

# Semana 14 — Movie Rater: GPS y conectividad

**Autora:** Paulina Diaz Perdomo ([@Palinapau](https://github.com/Palinapau))

Entrega individual del Corte 3 (Programación Móvil). App Ionic React + Capacitor que usa el GPS del dispositivo y consume la API de Movie Rater con autenticación por token.

## Qué incluye

| Requisito | Dónde está |
|---|---|
| Plugin de Capacitor (GPS) con permisos | `src/pages/LocationPage.tsx` (`@capacitor/geolocation`) |
| Login por token + petición protegida | `src/api/client.ts` (`login`, `getReviews`) |
| Manejo de 401 y sin red | `src/api/client.ts` (`UnauthorizedError`, `NetworkError`) |
| UX: navegación + estados carga/datos/error | `src/App.tsx`, `src/pages/Reviews.tsx`, `src/hooks/useAsync.ts` |
| Pruebas unitarias | `src/api/client.test.ts`, `src/utils/geo.test.ts` (`npm test`) |

## API

La app consume la API de Movie Rater. Para probarla sin el backend real se incluye una API de prueba (`mock-api/server.js`):

| Método | Ruta | Acceso | Respuesta |
|---|---|---|---|
| POST | `/api/auth/login` | público | `{ token, usuario }` (401 si las credenciales son incorrectas) |
| GET | `/api/resenas` | Bearer token | lista de reseñas (401 si el token es inválido) |

Usuario de prueba: `paulina@movierater.com` / `paulina123`.

## Cómo ejecutarla

```bash
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:3000/api
npm run mock              # terminal 1: API de prueba
npm run dev               # terminal 2: app en el navegador
npm test

# Android
npx cap add android
npm run cap:sync
npx cap open android
```

En `android/app/src/main/AndroidManifest.xml` agrega:

```xml
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

Emulador: `VITE_API_URL=http://10.0.2.2:3000/api`. Celular real: la IP de tu PC en la misma red.

## Quality & connectivity

Location access is handled with the Capacitor Geolocation plugin, which asks for permission only when the user taps the button. Before reading the GPS, the app checks the current permission state and requests it only if it has not been granted yet. If the user refuses, a clear message explains where to enable the location permission, and the app keeps working normally. Login is token-based: the API returns a JWT that is saved on the device and attached as a Bearer header to every protected request, such as loading the user's reviews. A 401 response means the token expired or is invalid, so the client deletes it and returns the user to the login screen. When the device is offline the request fails before reaching the server, and the app turns that failure into a typed network error with a friendly message and a retry button. Each screen that loads data shows the three states (loading, data and error), and the unit tests check the 401 flow, the offline message and the coordinate formatting helper.
