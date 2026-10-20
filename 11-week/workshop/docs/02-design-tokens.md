# CP2 — Navegación y design tokens

## 1. Contexto

La aplicación Movie Rater permite iniciar sesión, crear una cuenta, buscar películas, consultar sus detalles y administrar reseñas personales. La interfaz está construida con Ionic React.

Las pantallas seleccionadas para este taller son Login, Home y MovieDetail. También se considera Profile para definir el patrón de navegación principal.

## 2. Patrón de navegación

Se utiliza una navegación por pestañas inferiores para las secciones principales de la aplicación:

- **Inicio:** permite buscar películas y acceder a sus detalles.
- **Mi perfil:** permite consultar y administrar las reseñas del usuario.

Login y Register permanecen fuera de las pestañas porque son pantallas de acceso y registro. MovieDetail también permanece fuera de las pestañas porque representa una vista secundaria a la que se accede al seleccionar una película.

El botón de regreso del detalle permite volver a la pantalla anterior, mientras que las pestañas facilitan el cambio entre Inicio y Mi perfil.

## 3. Design tokens

Los siguientes tokens establecen una base visual coherente para los componentes de Movie Rater.

| Token | Valor | Uso |
|---|---|---|
| `--ion-color-primary` | `#4F46E5` | Acciones principales y navegación activa |
| `--ion-color-secondary` | `#64748B` | Acciones secundarias |
| `--ion-color-success` | `#16A34A` | Confirmaciones de acciones |
| `--ion-color-danger` | `#DC2626` | Errores y acciones destructivas |
| `--ion-background-color` | `#F8FAFC` | Fondo general |
| `--ion-text-color` | `#1E293B` | Texto principal |
| `--ion-font-family` | `Arial, sans-serif` | Tipografía general |
| Espaciado pequeño | `8px` | Separación entre elementos |
| Espaciado mediano | `16px` | Separación entre campos y tarjetas |
| Espaciado grande | `24px` | Separación entre secciones |
| Texto base | `16px` | Texto de lectura y formularios |
| Títulos principales | `28px` | Encabezados de pantallas |

## 4. Contraste y legibilidad

Se prioriza el texto oscuro sobre fondos claros y el texto blanco sobre el color primario de los botones. Para cumplir WCAG AA, el texto normal debe alcanzar una relación de contraste mínima de 4.5:1 y el texto grande de 3:1.

Los valores de la tabla son la propuesta de diseño. La conformidad definitiva debe comprobarse sobre los colores realmente renderizados en la aplicación, incluidos los estados de botones, pestañas y mensajes.

## 5. Aplicación en Movie Rater

Los tokens deben definirse en `app/src/theme/variables.css`, archivo de tema global de Ionic. Los componentes deben reutilizar los colores semánticos de Ionic en lugar de declarar colores distintos en cada pantalla.

La navegación por pestañas debe mantener accesibles Inicio y Mi perfil, mientras que Login, Register y MovieDetail conservan sus rutas específicas.

## 6. Validación

- Comprobar que las pestañas Inicio y Mi perfil abren las pantallas correctas.
- Comprobar que seleccionar una película abre MovieDetail.
- Comprobar que el botón de regreso del detalle funciona.
- Revisar los colores de texto, fondo, botones y mensajes de error.
- Verificar el contraste con una herramienta de accesibilidad antes de afirmar que cumple WCAG AA.
