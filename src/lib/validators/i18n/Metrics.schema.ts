// src/lib/validators/i18n/Metrics.schema.ts
/**
 * @file src/lib/validators/i18n/Metrics.schema.ts
 * @description Define el contrato de datos atómico para el namespace 'Metrics'.
 *              Valida la estructura del array de objetos de métricas para la landing page.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

/**
 * @public
 * @constant MetricsSchema
 * @description Define la estructura y los tipos de datos esperados para las
 *              traducciones relacionadas con la sección de métricas.
 */
export const MetricsSchema = z.object({
  /** Array de objetos, donde cada objeto representa una métrica individual. */
  metrics: z.array(
    z.object({
      iconName: z.string().describe("Nombre del icono de lucide-react."),
      prefix: z
        .string()
        .optional()
        .describe("Prefijo opcional para el valor (ej. '+')."),
      value: z.number().describe("El valor numérico de la métrica."),
      suffix: z.string().describe("Sufijo para el valor (ej. '%', '+')."),
      label: z.string().describe("La descripción de la métrica."),
    })
  ),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contrato de Datos Estructurado**: ((Implementada)) El schema valida un array de objetos, permitiendo que la sección de métricas sea completamente dinámica y gestionada desde los archivos de mensajes.
 * 2. **Integridad de Tipos**: ((Implementada)) Se valida que `value` sea un `number` y que `prefix` sea opcional, garantizando la robustez de los datos consumidos por el componente de contador animado.
 *
 * @subsection Melhorias Futuras
 * 1. **Animación Configurable**: ((Vigente)) El objeto de métrica podría extenderse para incluir una prop `animationDuration: number` para controlar la duración de la animación del contador para cada métrica individualmente.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/Metrics.schema.ts
