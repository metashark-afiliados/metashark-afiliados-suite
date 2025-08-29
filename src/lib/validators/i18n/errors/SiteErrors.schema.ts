// src/lib/validators/i18n/errors/SiteErrors.schema.ts
/**
 * @file SiteErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de error de acciones de sitios (crear, actualizar, eliminar,
 *              verificar subdominio) sin un prefijo de dominio.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 */
import { z } from "zod";

export const SiteErrorsSchema = z.object({
  check_subdomain_invalid_input: z.string(),
  check_subdomain_server_error: z.string(),
  subdomain_already_in_use: z.string(),
  create_permission_denied: z.string(),
  create_failed: z.string(),
  not_found: z.string(),
  update_permission_denied: z.string(),
  update_failed: z.string(),
  delete_permission_denied: z.string(),
  delete_invalid_id: z.string(),
  delete_failed: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de Placeholders**: Si alguna clave de error necesitara placeholders (ej. `not_found_with_id: "Site {siteId} not found"`), se podría añadir `.describe("Placeholder: {siteId}")` para documentar la expectativa.
 * 2. **Errores de Dominio Personalizado**: Añadir claves para el flujo de validación de dominios personalizados (ej. `custom_domain_dns_mismatch`, `custom_domain_in_use`).
 *
 * =====================================================================
 */
// src/lib/validators/i18n/errors/SiteErrors.schema.ts
