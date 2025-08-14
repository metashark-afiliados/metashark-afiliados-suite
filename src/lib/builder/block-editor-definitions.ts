// src/lib/builder/block-editor-definitions.ts
/**
 * @file src/lib/builder/block-editor-definitions.ts
 * @description Manifiesto central que define declarativamente las propiedades
 *              editables y los estilos de cada tipo de bloque en el constructor.
 *              Esta es la Única Fuente de Verdad para la configuración de la UI
 *              del `SettingsPanel`, adhiriéndose al principio de "Configuración sobre Código".
 * @author Raz Podestá
 * @version 1.0.0
 */
import { type BlockEditableDefinition } from "./types.d";

/**
 * @public
 * @constant blockEditorDefinitions
 * @description Un registro que mapea cada `block.type` (ej. "Header1", "Hero1")
 *              a su definición de propiedades y estilos editables. Cada entrada
 *              especifica la etiqueta para la UI, el tipo de control y valores
 *              por defecto o placeholders.
 */
export const blockEditorDefinitions: Record<string, BlockEditableDefinition> = {
  Header1: {
    properties: {
      logoText: {
        label: "Texto del Logo",
        type: "text",
        defaultValue: "Mi Empresa",
        placeholder: "Introduce el texto del logo",
      },
      ctaText: {
        label: "Texto del Botón CTA",
        type: "text",
        defaultValue: "Comprar Ahora",
        placeholder: "Introduce el texto del botón",
      },
    },
    styles: {
      backgroundColor: {
        label: "Color de Fondo",
        type: "color",
        defaultValue: "#333333",
      },
      textColor: {
        label: "Color del Texto",
        type: "color",
        defaultValue: "#FFFFFF",
      },
      paddingTop: {
        label: "Padding Superior (px)",
        type: "text",
        defaultValue: "16px",
      },
      paddingBottom: {
        label: "Padding Inferior (px)",
        type: "text",
        defaultValue: "16px",
      },
    },
  },

  Hero1: {
    properties: {
      title: {
        label: "Título Principal",
        type: "textarea",
        defaultValue: "Título Impactante",
        placeholder: "Introduce el título principal de tu Hero",
      },
      subtitle: {
        label: "Subtítulo",
        type: "textarea",
        defaultValue: "Un subtítulo convincente para tu oferta.",
        placeholder: "Introduce el subtítulo",
      },
    },
    styles: {
      backgroundColor: {
        label: "Color de Fondo",
        type: "color",
        defaultValue: "#F3F4F6",
      },
      textColor: {
        label: "Color del Texto",
        type: "color",
        defaultValue: "#333333",
      },
      paddingTop: {
        label: "Padding Superior (px)",
        type: "text",
        defaultValue: "80px",
      },
      paddingBottom: {
        label: "Padding Inferior (px)",
        type: "text",
        defaultValue: "80px",
      },
    },
  },
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **SSoT para el Editor**: ((Implementada)) Este manifiesto actúa como la fuente única de verdad para la configuración de la UI de edición, mejorando drásticamente la mantenibilidad y la escalabilidad del constructor. Añadir un nuevo campo editable a un bloque ahora requiere únicamente una modificación en este archivo.
 * 2. **Arquitectura Declarativa**: ((Implementada)) Se adhiere al principio de "Configuración sobre Código", desacoplando la definición de la UI de su implementación en el `SettingsPanel`.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación Zod para Definiciones**: ((Vigente)) Definir esquemas Zod para `EditablePropertyDefinition` y `BlockEditableDefinition` y validar este objeto `blockEditorDefinitions` en tiempo de desarrollo para garantizar la consistencia del manifiesto.
 * 2. **Tipos de Controles Avanzados**: ((Vigente)) Expandir `BlockPropertyType` en `types.d.ts` para incluir tipos como `number` (con min/max/step), `select` (con opciones), o `image` (para un futuro selector de assets).
 *
 * =====================================================================
 */
// src/lib/builder/block-editor-definitions.ts
