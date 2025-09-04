// src/lib/validators/i18n/ProcessSteps.schema.ts
/**
 * @file ProcessSteps.schema.ts
 * @description Define el contrato de datos atómico para el namespace 'ProcessSteps'.
 *              Este schema valida la estructura completa de la sección "Pasos del Proceso",
 *              incluyendo su array de objetos de pasos y el array anidado `checklist`.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
import { z } from "zod";

export const ProcessStepsSchema = z.object({
  navLink: z.string(),
  tag: z.string(),
  title: z.string(),
  description: z.string(),
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
// src/lib/validators/i18-n/ProcessSteps.schema.ts
