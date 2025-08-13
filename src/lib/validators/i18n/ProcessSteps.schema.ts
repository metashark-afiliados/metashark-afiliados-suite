// src/lib/validators/i18n/ProcessSteps.schema.ts
/**
 * @file src/lib/validators/i18n/ProcessSteps.schema.ts
 * @description Define el contrato de datos atómico para el namespace 'ProcessSteps'.
 *              Este schema valida la estructura completa de la sección "Pasos del Proceso",
 *              incluyendo su array de objetos de pasos, garantizando la integridad de
 *              los datos para el componente `ProcessSteps.tsx`.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

/**
 * @public
 * @constant ProcessStepsSchema
 * @description Define la estructura y los tipos de datos esperados para las
 *              traducciones de la sección de Pasos del Proceso. Este contrato
 *              permite que toda la sección sea gestionada desde los archivos de
 *              mensajes de i18n.
 */
export const ProcessStepsSchema = z.object({
  /** Texto para el enlace de navegación que apunta a esta sección (ej. "Cómo Funciona"). */
  navLink: z.string(),
  /** Etiqueta que se muestra sobre el título principal (ej. "El Proceso"). */
  tag: z.string(),
  /** Título principal de la sección. */
  title: z.string(),
  /** Descripción o subtítulo de la sección. */
  description: z.string(),
  /** Array de objetos, donde cada objeto representa un paso del proceso. */
  steps: z.array(
    z.object({
      stepNumber: z.string().describe("El número del paso, ej. '01'."),
      iconName: z.string().describe("El nombre de un icono de lucide-react."),
      title: z.string().describe("El título del paso."),
      description: z.string().describe("La descripción detallada del paso."),
      checklist: z
        .array(z.string())
        .describe("Una lista de puntos clave para el paso."),
    })
  ),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Contrato de Datos**: ((Implementada)) Se ha definido la estructura correcta para la clave `steps` como un `z.array(z.object(...))`, alineando el schema con el archivo de mensajes y resolviendo otro `TypeError` de runtime.
 * 2. **Contrato Anidado Robusto**: ((Implementada)) Valida una estructura de datos compleja con un array de objetos, permitiendo que toda la sección `ProcessSteps` sea gestionada desde los archivos de mensajes.
 * 3. **Documentación Embebida (TSDoc + Zod)**: ((Implementada)) Se ha añadido documentación verbosa y `.describe()` a las propiedades del schema, mejorando la experiencia del desarrollador y la claridad para los traductores.
 *
 * @subsection Melhorias Futuras
 * 1. **Tipo ENUM para `iconName`**: ((Vigente)) Para una seguridad de tipos de élite, el campo `iconName` podría ser validado contra un `z.enum([...])` que contenga una lista predefinida de todos los nombres de iconos válidos de `lucide-react`.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/ProcessSteps.schema.ts
