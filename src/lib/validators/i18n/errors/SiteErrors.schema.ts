// src/lib/validators/i18n/errors/SiteErrors.schema.ts
/**
 * @file SiteErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de error y éxito de acciones de sitios (crear, actualizar,
 *              eliminar, verificar subdominio) sin un prefijo de dominio.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 1.0.0
 * @see .docs-espejo/lib/validators/i18n/errors/SiteErrors.schema.ts.md
 */
import { z } from "zod";

export const SiteErrorsSchema = z.object({
  // Subdomain check
  check_subdomain_invalid_input: z.string(),
  check_subdomain_server_error: z.string(),
  subdomain_already_in_use: z.string(),

  // Create site
  create_permission_denied: z.string(),
  create_failed: z.string(),
  create_success: z.string(),

  // Generic find
  not_found: z.string(),

  // Update site
  update_permission_denied: z.string(),
  update_failed: z.string(),
  update_success: z.string(),

  // Delete site
  delete_permission_denied: z.string(),
  delete_invalid_id: z.string(),
  delete_failed: z.string(),
  delete_success: z.string(),
});
// src/lib/validators/i18n/errors/SiteErrors.schema.ts
