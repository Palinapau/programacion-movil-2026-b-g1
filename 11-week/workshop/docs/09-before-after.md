# CP9 — Antes y después e historias de usuario

## 1. Comparación antes y después

### Antes
- La validación del formulario no mostraba claramente todos los errores por campo.
- Los estados de carga y error podían resultar poco claros para el usuario.
- La navegación al detalle necesitaba indicar de forma clara cómo regresar al listado.

### Después
- El formulario muestra mensajes de validación y feedback al enviar.
- La pantalla de detalle contempla estados de carga, error y contenido.
- El botón de regreso dirige al listado principal de películas.

## 2. Historias de usuario y criterios de aceptación

### HU1 — Registro con validación
**Historia:** Como usuario, quiero recibir mensajes claros al completar el formulario de registro para corregir los datos antes de enviarlos.

**Criterios de aceptación:**
- Se muestran mensajes cuando los campos no cumplen las reglas.
- El botón de envío permanece deshabilitado mientras existan errores.
- Se informa al usuario si el envío termina correctamente o falla.

### HU2 — Consultar el detalle de una película
**Historia:** Como usuario, quiero abrir una película y consultar su información para decidir si me interesa.

**Criterios de aceptación:**
- La pantalla obtiene el identificador de la película desde la ruta.
- Se muestra un indicador mientras se carga la información.
- Se informa si ocurre un error o no se encuentra la película.

### HU3 — Regresar al listado
**Historia:** Como usuario, quiero regresar fácilmente al listado después de consultar una película para continuar explorando.

**Criterios de aceptación:**
- Existe un control visible para regresar.
- Al usarlo, se vuelve al listado principal.
- La navegación funciona sin mostrar una pantalla vacía ni un error.
