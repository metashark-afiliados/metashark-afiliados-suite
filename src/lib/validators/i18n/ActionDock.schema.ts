// src/lib/validators/i18n/ActionDock.schema.ts
/**
 * @file ActionDock.schema.ts
 * @description Define el contrato de datos para el namespace 'ActionDock'.
 *              Este schema valida la estructura del array de "servicios"
 *              que se mostrarán en el dock de acciones del nuevo dashboard.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const ActionDockSchema = z.object({
  services: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      iconName: z.string().describe("Nombre del icono de lucide-react."),
      href: z.string().describe("La ruta de navegación para la acción."),
      colorClass: z.string().describe("Clase de Tailwind para el color de fondo."),
    })
  ),
  more_button_label: z.string()
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contrato para "Hub Creativo"**: ((Implementada)) Este nuevo schema establece la SSoT para el contenido del `ActionDock`.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/ActionDock.schema.ts