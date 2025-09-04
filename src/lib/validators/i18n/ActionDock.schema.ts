// src/lib/validators/i18n/ActionDock.schema.ts
/**
 * @file ActionDock.schema.ts
 * @description Define el contrato de datos para el namespace 'shared.ActionDock'.
 *              Sincronizado con la Directiva 3.4 (IMAS) y con la SSoT de iconos
 *              para una validación de élite.
 * @author L.I.A Legacy
 * @version 4.0.0
 */
import { z } from "zod";
import { LucideIconNameSchema } from "@/config/lucide-icon-names";

/**
 * @private
 * @constant ServiceSchema
 * @description Define la estructura para un único servicio en el Action Dock.
 */
const ServiceSchema = z.object({
  id: z.string(),
  label: z.string(),
  iconName: LucideIconNameSchema.describe(
    "Nombre del icono de lucide-react en PascalCase."
  ),
  type: z.string().describe("El tipo de creación a iniciar."),
  colorClass: z.string().describe("Clase de Tailwind para el color del icono."),
  textColor: z
    .string()
    .describe("Clase de Tailwind para el color del texto del icono."),
});

/**
 * @public
 * @constant ActionDockSchema
 * @description El schema Zod que valida la estructura completa del archivo de
 *              mensajes para el componente ActionDock.
 */
export const ActionDockSchema = z.object({
  services: z.record(ServiceSchema),
  more_button_label: z.string(),
});
// src/lib/validators/i18n/ActionDock.schema.ts
