// .docs/builder/user-manual.md
/**
 * @file .docs/builder/user-manual.md
 * @description Manual de usuario y técnico combinado para el Constructor de Campañas.
 *              Define la arquitectura para el equipo de ingeniería y proporciona
 *              una guía práctica para el usuario final.
 * @author Raz Podestá
 * @version 1.0.0
 */
# Manual de Élite: El Constructor de Campañas de ConvertiKit

## 1. INTRODUCCIÓN: LA MISIÓN DEL CONSTRUCTOR

El Constructor de Campañas de ConvertiKit es el pilar de nuestra plataforma, diseñado para empoderar a los usuarios a crear y optimizar landing pages de alta conversión sin escribir una sola línea de código. Concebido como un "reloj suizo", cada "aparato" dentro del constructor ha sido atomizado y orquestado para funcionar de manera impecable.

## 2. BLUEPRINT ARQUITECTÓNICO (PARA EL EQUIPO DE INGENIERÍA)

El módulo "Builder" es un ejemplo canónico de la "Filosofía LEGO" en acción. Se basa en una red de aparatos especializados:

- **Server Component (`page.tsx`):** Capa inicial de seguridad y preparación de datos.
- **Client Components (`layout.tsx`, `Canvas.tsx`, `*Panel.tsx`):** Orquestadores de la UI interactiva.
- **Zustand Slices:** Máquinas de estado globales, modulares y reactivas.
- **Manifiestos y Registros:** Fuentes de verdad declarativas para la configuración.
- **Hooks Personalizados:** Encapsulan comportamientos complejos y reutilizables.

(Para un desglose detallado de la arquitectura, consulte `.docs/builder/architectural-blueprint.md`)

## 3. MANUAL DEL USUARIO (PARA EL USUARIO FINAL)

¡Bienvenido al corazón de ConvertiKit! Esta guía te ayudará a aprovechar al máximo nuestra herramienta de diseño.

### 3.1. NAVEGANDO POR LA INTERFAZ

La interfaz del constructor se divide en tres áreas principales:

1.  **Encabezado Superior (`BuilderHeader`):** Tu centro de control.
    *   **Volver al Dashboard:** Te permite regresar a tu panel principal.
    *   **Controles de Historial (`HistoryControls`):** Deshace (`Undo`) y rehace (`Redo`) tus cambios.
    *   **Vistas de Dispositivo (`DevicePreviewControls`):** Cambia la vista del lienzo entre Escritorio, Tableta y Móvil.
    *   **Estado de Guardado (`SaveStatusButton`):** Te informa si tienes cambios pendientes (`Guardar Cambios`), si se está guardando (`Guardando...`) o si tu trabajo está a salvo (`Guardado`).
    *   **Previsualizar:** Abre tu campaña en una nueva pestaña para verla como lo haría un visitante.

2.  **Barra Lateral Izquierda (Panel de Edición):**
    *   **Pestaña "Añadir":** Aquí encontrarás la `BlocksPalette`, una lista de bloques pre-diseñados (Encabezados, Héroes, etc.). Simplemente arrástralos y suéltalos en el lienzo.
    *   **Pestaña "Ajustes":** Al seleccionar un bloque en el lienzo, esta pestaña se activa mostrando el `SettingsPanel`, con todas las opciones para personalizar textos, imágenes, colores y estilos.

3.  **Lienzo Central (`Canvas`):**
    *   **Tu Página en Vivo:** Aquí ves tu diseño en tiempo real.
    *   **Seleccionar Bloques:** Haz clic en cualquier bloque para seleccionarlo. Verás un borde resaltado y se activará la pestaña "Ajustes".
    *   **Arrastrar y Soltar:** Al seleccionar un bloque, puedes arrastrar el icono de agarre (`⋮⋮`) para reordenarlo.
    *   **Opciones Rápidas:** Al pasar el ratón sobre un bloque, aparece un menú para Duplicar, Mover o Eliminar el bloque.

### 3.2. CÓMO CONSTRUIR TU PRIMERA PÁGINA

1.  **Añade un Bloque:** Ve a la pestaña "Añadir" y arrastra un bloque como "Héroe - Principal" al lienzo.
2.  **Personaliza el Contenido:** Haz clic en el bloque. La pestaña "Ajustes" se activará. Cambia el "Título Principal" y el "Subtítulo".
3.  **Ajusta los Estilos:** En "Ajustes", ve a la pestaña "Estilo" para cambiar colores de fondo, texto, etc.
4.  **Guarda Tu Trabajo:** Haz clic en "Guardar Cambios" en el encabezado.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización y Rebranding**: ((Implementada)) El manual ha sido actualizado para reflejar los nombres de los componentes atómicos reales y la nueva marca "ConvertiKit".
 * 2. **Claridad Mejorada**: ((Implementada)) La separación clara entre la sección técnica y el manual de usuario mejora la legibilidad para ambas audiencias.
 *
 * =====================================================================
 */
// .docs/builder/user-manual.md