// src/lib/validators/i18n/errors/AdminErrors.schema.ts
/**
 * @file AdminErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de error de acciones de administración (suplantación,
 *              eliminación de sitios, actualización de roles) sin un prefijo de dominio.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 1.0.0
 * @see .docs-espejo/lib/validators/i18n/errors/AdminErrors.schema.ts.md
 */
import { z } from "zod";

export const AdminErrorsSchema = z.object({
  impersonation_user_id_missing: z.string(),
  impersonation_self_impersonation_forbidden: z.string(),
  impersonation_user_not_found: z.string(),
  impersonation_link_generation_failed: z.string(),
  delete_site_subdomain_missing: z.string(),
  delete_site_failed: z.string(),
  update_user_role_self_role_change_forbidden: z.string(),
  update_user_role_failed: z.string(),
});
// src/lib/validators/i18n/errors/AdminErrors.schema.ts
