# CP3 — Estados de la lista de películas

## Pantalla evaluada

Home — búsqueda y listado de películas.

## Estados de interfaz

- **Loading:** mientras se consulta la API se muestra un indicador con el texto «Buscando películas...».
- **Error:** cuando falla la consulta se muestra un mensaje visible y un botón «Reintentar búsqueda».
- **Empty:** cuando una búsqueda finaliza sin resultados debe mostrarse un mensaje que indique que no se encontraron películas.
- **Success:** cuando la consulta devuelve resultados se muestran las tarjetas de las películas.

## Evidencia y pruebas

La captura `docs/img/cp3-error.png` muestra el mensaje de error y la acción de reintento en la pantalla Home.

La búsqueda de prueba no obtuvo resultados de la API porque la solicitud falló. Por tanto, es necesario distinguir esta prueba del estado vacío y de una búsqueda exitosa. La acción de reintento debe probarse para confirmar que vuelve a ejecutar la consulta.
