// src/lib/validators/i18n/errors/AdminErrors.schema.ts
/**
 * @file AdminErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de error de acciones de administración (suplantación,
 *              eliminación de sitios, actualización de roles) sin un prefijo de dominio.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este nuevo aparato encapsula los errores de administración, mejorando la modularidad.
 * 2. **Consistencia con Prefijos**: ((Implementada)) Las claves se definen sin prefijo, lo que permite que el ensamblador `ValidationErrors.schema.ts` aplique el prefijo `admin_` de forma consistente.
 *
 * @subsection Melhorias Futuras
 * 1. **Errores Específicos de Otras Acciones de Admin**: ((Vigente)) Si se añaden más acciones de administración (ej. restablecimiento de contraseña de usuario, gestión de feature flags), se añadirán aquí.
 *
 * =====================================================================
 */
