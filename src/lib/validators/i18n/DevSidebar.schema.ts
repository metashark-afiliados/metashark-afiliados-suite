// src/lib/validators/i18n/DevSidebar.schema.ts
/**
 * @file DevSidebar.schema.ts
 * @description Define el contrato de datos para el namespace 'components.dev-console.DevSidebar'.
 *              Este aparato atómico de validación garantiza la seguridad de tipos
 *              para la barra lateral del panel de desarrollador.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { z } from "zod";

export const DevSidebarSchema = z.object({
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
 *
 * @subsection Melhorias Adicionadas
 * 1. **Restauración de Integridad**: ((Implementada)) La creación de este schema resuelve otra dependencia crítica para la infraestructura de i18n.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/DevSidebar.schema.ts
