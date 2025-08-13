// src/lib/validators/i18n/DevConsoleSidebar.schema.ts
/**
 * @file DevConsoleSidebar.schema.ts
 * @description Define el contrato de datos para el namespace 'DevConsoleSidebar'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const DevConsoleSidebarSchema = z.object({
  overview: z.string(),
  userManagement: z.string(),
  campaignViewer: z.string(),
  telemetry: z.string(),
  auditLogs: z.string(),
  routeViewer: z.string(),
  loadingRoutes: z.string(),
  signOut: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad**: ((Implementada)) Schema aislado para su namespace.
 * =====================================================================
 */
// src/lib/validators/i18n/DevConsoleSidebar.schema.ts
