// src/lib/validators/i18n/Metrics.schema.ts
/**
 * @file Metrics.schema.ts
 * @description Define el contrato de datos atómico para el namespace 'Metrics'
 *              dentro de `landing.json`. Ha sido refactorizado para eliminar la
 *              dependencia de compilación con el archivo generado `lucide-icon-names.ts`.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
import { z } from "zod";

export const MetricsSchema = z.object({
  /** Array de objetos, donde cada objeto representa una métrica individual. */
  metrics: z.array(
    z.object({
      iconName: z.string().min(1).describe("Nombre del icono de lucide-react."),
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
// src/lib/validators/i18n/Metrics.schema.ts
