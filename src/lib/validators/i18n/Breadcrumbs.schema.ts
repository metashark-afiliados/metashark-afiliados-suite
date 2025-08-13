// src/lib/validators/i18n/Breadcrumbs.schema.ts
/**
 * @file Breadcrumbs.schema.ts
 * @description Define el contrato de datos para el namespace 'Breadcrumbs'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const BreadcrumbsSchema = z.object({
  dashboard: z.string(),
  sites: z.string(),
  settings: z.string(),
  campaigns: z.string(),
  "dev-console": z.string(),
  users: z.string(),
  logs: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad**: ((Implementada)) Schema aislado para su namespace.
 * =====================================================================
 */
// src/lib/validators/i18n/Breadcrumbs.schema.ts
