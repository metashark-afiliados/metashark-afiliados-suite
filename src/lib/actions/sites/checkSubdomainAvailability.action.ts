// src/lib/actions/sites/checkSubdomainAvailability.action.ts
/**
 * @file checkSubdomainAvailability.action.ts
 * @description Server Action atómica para verificar la disponibilidad de un subdominio.
 * @author L.I.A. Legacy & RaZ WriTe (Arquitecto)
 * @version 1.0.0
 * @see .docs-espejo/lib/actions/sites/checkSubdomainAvailability.action.ts.md
 */
"use server";
import "server-only";

import { createPersistentErrorLog } from "@/lib/actions/_helpers";
import { sites as sitesData } from "@/lib/data";
import { logger } from "@/lib/logging";
import { type ActionResult, SubdomainSchema } from "@/lib/validators";

export async function checkSubdomainAvailabilityAction(
  subdomain: string
): Promise<ActionResult<{ isAvailable: boolean }>> {
  const validationResult = SubdomainSchema.safeParse(subdomain);
  if (!validationResult.success) {
    logger.warn("[SitesActions:checkSubdomain] Subdominio inválido recibido.", {
      subdomain,
      errors: validationResult.error.flatten(),
    });
    return {
      success: false,
      error:
        validationResult.error.errors[0].message ||
        "ValidationErrors.sites_check_subdomain_invalid_input",
    };
  }

  try {
    const existingSite = await sitesData.publicData.getSiteDataByHost(
      validationResult.data
    );
    const isAvailable = !existingSite;
    logger.trace(
      `[SitesActions:checkSubdomain] Verificación de disponibilidad para '${validationResult.data}': ${isAvailable}`
    );
    return { success: true, data: { isAvailable } };
  } catch (error) {
    const errorId = await createPersistentErrorLog(
      "checkSubdomainAvailabilityAction",
      error as Error,
      { subdomain }
    );
    logger.error(
      `[SitesActions:checkSubdomain] Error al verificar subdominio ${subdomain}. Log ID: ${errorId}`
    );
    return {
      success: false,
      error: "ValidationErrors.sites_check_subdomain_server_error",
    };
  }
}
// src/lib/actions/sites/checkSubdomainAvailability.action.ts
