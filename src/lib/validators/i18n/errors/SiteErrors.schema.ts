// src/lib/validators/i18n/errors/SiteErrors.schema.ts
/**
 * @file SiteErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de error de acciones de sitios (crear, actualizar, eliminar,
 *              verificar subdominio) sin un prefijo de dominio.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 */
import { z } from "zod";

export const SiteErrorsSchema = z.object({
  check_subdomain_invalid_input: z.string(),
  check_subdomain_server_error: z.string(),
  subdomain_already_in_use: z.string(),
  site_create_permission_denied: z.string(),
  site_create_failed: z.string(),
  site_not_found: z.string(), // Para cuando un siteId no existe (ej. en update/delete)
  site_update_permission_denied: z.string(),
  site_update_failed: z.string(),
  site_delete_permission_denied: z.string(),
  site_delete_invalid_id: z.string(),
  site_delete_failed: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este nuevo aparato encapsula los errores específicos de la entidad `sites`, mejorando la modularidad y la organización de la capa de validación.
 * 2. **Consistencia con Prefijos**: ((Implementada)) Las claves se definen sin prefijo, lo que permite que el ensamblador `ValidationErrors.schema.ts` aplique el prefijo `sites_` de forma consistente, manteniendo el esquema JSON de i18n más limpio para los traductores.
 * 3. **Granularidad de Errores**: ((Implementada)) Se han definido errores específicos para cada escenario (`check_subdomain_invalid_input`, `subdomain_already_in_use`, `site_create_failed`, etc.), lo que permite un feedback más preciso al usuario y una mejor trazabilidad para la depuración.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de Placeholders**: ((Vigente)) Si alguna clave de error necesitara placeholders (ej., `site_not_found_with_id: "Site {siteId} not found"`), se podría añadir `.describe("Placeholder: {siteId}")` para documentar la expectativa.
 *
 * =====================================================================
 */
