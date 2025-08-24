// src/lib/validators/i18n/ActionDock.schema.ts
/**
 * @file ActionDock.schema.ts
 * @description Define el contrato de datos para el namespace 'ActionDock'.
 *              Blindado para validar `iconName` contra la SSoT de iconos.
 * @author Raz Podestá
 * @version 3.0.0
 */
import { z } from "zod";
import { LucideIconNameSchema } from "@/config/lucide-icon-names";

export const ActionDockSchema = z.object({
  services: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      iconName: LucideIconNameSchema.describe(
        "Nombre del icono de lucide-react en PascalCase."
      ), // <-- BLINDAJE
      href: z.string().describe("La ruta de navegación para la acción."),
      colorClass: z
        .string()
        .describe("Clase de Tailwind para el color de fondo del icono."),
      textColor: z
        .string()
        .describe("Clase de Tailwind para el color del icono."),
    })
  ),
  more_button_label: z.string(),
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contrato Blindado y Sincronizado**: ((Implementada)) El schema ahora valida `iconName` contra la SSoT `LucideIconNameSchema` y refleja la nueva estructura de datos sin `ICONS` map, completando la re-arquitectura.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/ActionDock.schema.ts
