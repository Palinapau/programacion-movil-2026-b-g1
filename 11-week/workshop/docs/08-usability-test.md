# CP8 — Prueba de usabilidad

## Objetivo
Evaluar si los usuarios pueden buscar una película, abrir su detalle y regresar al listado de manera intuitiva.

## Participantes
- P1: Participante de prueba A.
- P2: Participante de prueba B.

**Nota:** Los siguientes resultados son datos simulados para preparar el formato del informe; deben reemplazarse por observaciones reales antes de presentarlos como una prueba realizada.

## Tareas
1. Encontrar una película usando la búsqueda.
2. Abrir el detalle de la película.
3. Regresar al listado de películas.

## Resultados de ejemplo (simulados)

| Participante | Tarea | ¿Completada? | Tiempo de ejemplo | Dificultad de ejemplo |
|---|---|---|---|---|
| P1 | Buscar película | Sí | 18 s | No identificó inmediatamente el campo de búsqueda |
| P1 | Abrir detalle | Sí | 12 s | Ninguna |
| P1 | Regresar al listado | Sí | 8 s | Dudó dónde regresar |
| P2 | Buscar película | Sí | 25 s | Necesitó revisar la pantalla |
| P2 | Abrir detalle | Sí | 15 s | Ninguna |
| P2 | Regresar al listado | Sí | 10 s | El botón de regreso no era evidente |

## Comentarios de ejemplo (simulados)
- P1: Sería útil que el campo de búsqueda tuviera una indicación más clara.
- P2: Me gustaría identificar más fácilmente cómo volver al listado.

## Problema priorizado
La navegación de regreso al listado puede no resultar evidente para usuarios nuevos.

## Mejora propuesta
Se verificó que la pantalla de detalle cuente con un botón de regreso y que su destino sea `/tabs/home`, correspondiente al listado principal de películas.

## Verificación posterior
Ejecutar la aplicación, abrir una película desde el listado y pulsar el botón de regreso. Confirmar que se vuelve al listado sin errores.
