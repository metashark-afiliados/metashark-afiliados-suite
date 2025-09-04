// src/lib/actions/sites/checkSubdomainAvailability.action.ts
/**
 * @file checkSubdomainAvailability.action.ts
 * @description Server Action atómica para verificar la disponibilidad de un subdominio.
 *              Refactorizada para adherirse al contrato `ActionResult` blindado,
 *              la observabilidad canónica y la SSoT de errores.
 * @author RaZ Podestá - MetaShark Tech
 * @version 3.0.0
 * @see .docs-espejo/lib/actions/sites/checkSubdomainAvailability.action.ts.md
 */
"use server";
import "server-only";

import { createPersistentErrorLog } from "@/lib/actions/_helpers";
import { sites as sitesData } from "@/lib/data";
import { logger } from "@/lib/logger";
import {
  type ActionResult,
  SubdomainSchema,
  type ValidationErrorKey,
} from "@/lib/validators";

/**
 * @public
 * @async
 * @function checkSubdomainAvailabilityAction
 * @description Valida un subdominio y verifica su disponibilidad en la base de datos.
 * @param {string} subdomain - El subdominio a verificar.
 * @returns {Promise<ActionResult<{ isAvailable: boolean }>>} El resultado de la operación.
 */
export async function checkSubdomainAvailabilityAction(
  subdomain: string
): Promise<ActionResult<{ isAvailable: boolean }>> {
  const context = { subdomain };
  const validationResult = SubdomainSchema.safeParse(subdomain);

  if (!validationResult.success) {
    const firstError = validationResult.error.errors[0];
    logger.warn(
      { ...context, errors: validationResult.error.flatten() },
      "[checkSubdomain] Subdominio inválido recibido."
    );
    return {
      success: false,
      error: firstError.message as ValidationErrorKey,
    };
  }

  const validatedSubdomain = validationResult.data;
  context.subdomain = validatedSubdomain;

  try {
    const existingSite =
      await sitesData.publicData.getSiteDataByHost(validatedSubdomain);
    const isAvailable = !existingSite;
    logger.trace(context, `[checkSubdomain] Verificación completada.`);
    return { success: true, data: { isAvailable } };
  } catch (error) {
    const errorId = await createPersistentErrorLog(
      "checkSubdomainAvailabilityAction",
      error as Error,
      context
    );
    logger.error(
      { err: error, errorId, ...context },
      "[checkSubdomain] Error al verificar disponibilidad."
    );
    return {
      success: false,
      error: "generic.error_server_generic",
    };
  }
}
// src/lib/actions/sites/checkSubdomainAvailability.action.ts
