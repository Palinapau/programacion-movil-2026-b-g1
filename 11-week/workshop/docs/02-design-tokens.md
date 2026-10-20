# CP2 — Navegación y tokens de diseño

## 1. Objetivo

Definir el patrón de navegación y documentar los principales elementos visuales de Movie Rater para mantener una interfaz consistente, clara y fácil de utilizar.

## 2. Patrón de navegación implementado

Se implementó una navegación inferior mediante pestañas de Ionic, que permite acceder a las secciones principales de la aplicación.

| Pestaña | Ruta | Función |
|---|---|---|
| Inicio | `/tabs/home` | Buscar películas y consultar los resultados. |
| Mi perfil | `/tabs/profile` | Consultar la información del usuario y gestionar sus reseñas. |

La pantalla de detalle de película conserva la ruta `/movie/:id`. Las pantallas de inicio de sesión y registro permanecen disponibles mediante `/login` y `/register`.

La navegación inferior incluye iconos y etiquetas para identificar las opciones. La pestaña activa se distingue visualmente de la inactiva. Se comprobó manualmente que la barra aparece en la pantalla de Inicio y que es posible acceder a Mi perfil.

## 3. Tokens de diseño

La interfaz observada utiliza un tema claro, fondos gris muy claro, superficies blancas, texto oscuro y elementos de acción violetas.

| Token | Aplicación en la interfaz | Referencia de implementación |
|---|---|---|
| Color primario | Botones principales, acciones y pestaña activa. | Variable `--ion-color-primary` en `src/theme/variables.css`. |
| Color secundario | Acciones complementarias y elementos secundarios. | Variable `--ion-color-secondary`, si está definida. |
| Color de éxito | Confirmaciones de acciones completadas. | Variable `--ion-color-success`, si está definida. |
| Color de error | Mensajes de error y validación. | Variable `--ion-color-danger` y estilos de error. |
| Fondo | Fondo claro de las pantallas. | Variables de fondo de Ionic y estilos de cada pantalla. |
| Superficie | Tarjetas, campos y barras de navegación. | Componentes Ionic y estilos CSS. |
| Texto principal | Títulos, etiquetas y contenido. | Variables de texto y tipografía de Ionic. |
| Espaciado | Separación entre campos, botones y secciones. | Propiedades `margin` y `padding` de los archivos CSS. |
| Tipografía | Títulos, textos descriptivos, etiquetas y botones. | Estilos de Ionic y CSS de cada pantalla. |

Los valores efectivos de los colores y las medidas deben corresponder a los definidos en `src/theme/variables.css` y en los archivos CSS de la aplicación. No se asignan códigos HEX ni tamaños numéricos sin verificarlos en el código fuente.

## 4. Criterios visuales

- Mantener una jerarquía clara entre títulos, descripciones, formularios y acciones.
- Utilizar el color primario de forma consistente en las acciones principales.
- Conservar un contraste suficiente entre el texto y el fondo.
- Mantener etiquetas visibles en los campos de los formularios.
- Utilizar iconos acompañados de etiquetas en la navegación inferior.
- Conservar los componentes y estilos de Ionic para mantener una presentación coherente entre pantallas.

## 5. Accesibilidad y contraste

Para texto normal se establece como objetivo una relación de contraste mínima de **4.5:1**. Para texto grande, el objetivo es de **3:1**.

Los colores reales de texto, fondo, botones y estados activos deben comprobarse con una herramienta de contraste. La apariencia visual por sí sola no demuestra que se cumplan estos valores.

También se debe comprobar que las etiquetas sean legibles, que las acciones tengan un área táctil adecuada y que la navegación no dependa exclusivamente del color para comunicar el estado seleccionado.

## 6. Evidencia de implementación

La comprobación visual se realizó en la aplicación ejecutada localmente mediante Vite.

La captura de la navegación inferior debe guardarse en `docs/img/` y mostrar las pestañas Inicio y Mi perfil. La evidencia debe corresponder a la versión implementada de la aplicación.

## 7. Resultado

Se implementó y comprobó visualmente el patrón de navegación inferior para las secciones principales de Movie Rater. La documentación identifica los tokens y los archivos donde se definen, y establece los criterios de contraste y consistencia que deben verificarse para completar la validación visual.
