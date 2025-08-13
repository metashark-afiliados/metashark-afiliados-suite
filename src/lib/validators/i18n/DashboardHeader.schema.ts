// src/lib/validators/i18n/DashboardHeader.schema.ts
/**
 * @file DashboardHeader.schema.ts
 * @description Define el contrato de datos para el namespace 'DashboardHeader'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const DashboardHeaderSchema = z.object({
  mobile_openMenu_sr: z.string(),
  search_placeholder: z.string(),
  search_command: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad**: ((Implementada)) Schema aislado para su namespace.
 * =====================================================================
 */
// src/lib/validators/i18n/DashboardHeader.schema.ts
