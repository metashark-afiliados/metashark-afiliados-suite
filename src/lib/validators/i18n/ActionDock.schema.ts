// src/lib/validators/i18n/ActionDock.schema.ts
/**
 * @file ActionDock.schema.ts
 * @description Define el contrato de datos para el namespace 'ActionDock'.
 *              Blindado para validar `iconName` contra la SSoT de iconos.
 * @author Raz Podestá
 * @version 2.0.0
 */
import { z } from "zod";
import { LucideIconNameSchema } from "@/config/lucide-icon-names";

export const ActionDockSchema = z.object({
  services: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      iconName: LucideIconNameSchema.describe(
        "Nombre del icono de lucide-react."
      ), // <-- BLINDAJE
      href: z.string().describe("La ruta de navegación para la acción."),
      colorClass: z
        .string()
        .describe("Clase de Tailwind para el color de fondo."),
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
 * 1. **Contrato Blindado**: ((Implementada)) El `iconName` ahora está validado por la SSoT, previniendo errores.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/ActionDock.schema.ts
