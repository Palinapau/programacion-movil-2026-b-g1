# CP1 — Auditoría UX de Movie Rater

## Pantallas seleccionadas

1. Login: inicio de sesión.
2. Home: búsqueda y listado de películas.
3. MovieDetail: detalle de una película.

## Hallazgos de auditoría

| Pantalla | Problema observado | Principio UX | Severidad | Arreglo propuesto |
|---|---|---|---|---|
| Login | El usuario puede necesitar orientación sobre los datos que debe ingresar. | Claridad | Media | Mantener etiquetas visibles y mensajes de validación claros. |
| Login | No se ha verificado un mensaje de error visible después de un inicio de sesión fallido. | Retroalimentación | Alta | Mostrar el motivo del error y cómo continuar. |
| Home | La búsqueda se ejecuta en cada evento de escritura. | Eficiencia | Media | Añadir debounce para reducir solicitudes repetidas. |
| Home | Al borrar el texto de búsqueda, se vacía la lista sin explicar qué debe hacer el usuario. | Visibilidad del estado | Media | Mostrar una indicación para buscar películas. |
| Home | No hay un mensaje específico cuando la búsqueda termina sin resultados. | Estado vacío | Media | Mostrar “No encontramos películas. Prueba otra búsqueda”. |
| Home | El estado de carga está implementado, pero las búsquedas rápidas pueden producir respuestas en distinto orden. | Prevención de errores | Media | Controlar solicitudes anteriores o cancelar las que ya no correspondan. |
| Home | Cuando ocurre un error se muestra un mensaje, pero no hay una acción directa para reintentar. | Recuperación de errores | Alta | Añadir un botón para reintentar la búsqueda. |
| Home | Las tarjetas no muestran un póster alternativo cuando una película no tiene imagen. | Consistencia | Baja | Mostrar una imagen o marcador alternativo. |

## Flujo actual

```mermaid
flowchart TD
    A[Inicio de sesión] --> B[Home]
    B --> C[Escribir búsqueda]
    C --> D{Resultado}
    D --> E[Mostrar películas]
    D --> F[Mostrar error]
    E --> G[Seleccionar película]
    G --> H[MovieDetail]
    B --> I[Mi perfil]