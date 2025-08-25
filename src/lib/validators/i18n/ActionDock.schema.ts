// src/lib/validators/i18n/ActionDock.schema.ts
/**
 * @file ActionDock.schema.ts
 * @description Define el contrato de datos para el namespace 'ActionDock'.
 *              Blindado para validar `iconName` y la nueva propiedad `type`.
 * @author Raz Podestá
 * @version 4.0.0
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
      ),
      type: z.string().describe("El tipo de creación a iniciar."),
      colorClass: z
        .string()
        .describe("Clase de Tailwind para el color del icono."),
      textColor: z
        .string()
        .describe("Clase de Tailwind para el color del texto del icono."),
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
 * 1. **Contrato Sincronizado**: ((Implementada)) El schema ahora refleja la nueva SSoT de datos del manifiesto `ActionDock.json`, incluyendo la propiedad `type` y eliminando `href`. Esto completa la refactorización a nivel de contrato.
 *
 * @subsection Melhorias Futuras
 * 1. **Enum para `type`**: ((Vigente)) El campo `type` podría ser validado contra un `z.enum` de los tipos de creación permitidos para una seguridad de tipos aún mayor.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/ActionDock.schema.ts
