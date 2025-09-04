// src/lib/actions/dev/diagnostics.actions.ts
/**
 * @file diagnostics.actions.ts
 * @description Módulo SSoT para Server Actions de diagnóstico. Alineado con la
 *              Constitución de Observabilidad y el Manifiesto de Manejo de Errores.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
"use server";
import "server-only";

import * as Sentry from "@sentry/nextjs";

import { requireAppRole } from "@/lib/auth/user-permissions";
import { logger } from "@/lib/logger";
import { type ActionResult, type ValidationErrorKey } from "@/lib/validators";

/**
 * @public
 * @async
 * @function triggerSentryErrorAction
 * @description [Privilegio: developer] Lanza un error deliberado para probar la
 *              monitorización de Sentry en el entorno del servidor.
 * @returns {Promise<ActionResult<void>>} Se espera que lance una excepción.
 * @throws {Error} Un error de prueba con un mensaje único y timestamp.
 */
export async function triggerSentryErrorAction(): Promise<ActionResult<void>> {
  logger.trace({}, "[DiagnosticsAction] Iniciando triggerSentryErrorAction.");

  const roleCheck = await requireAppRole(["developer"]);
  if (!roleCheck.success) {
    // --- INICIO DE REFACTORIZACIÓN: Mapeo de Errores de Auth ---
    const errorKey: ValidationErrorKey =
      roleCheck.error === "SESSION_NOT_FOUND"
        ? "generic.error_unauthenticated"
        : "generic.error_permission_denied";
    return { success: false, error: errorKey };
    // --- FIN DE REFACTORIZACIÓN ---
  }

  const { user } = roleCheck.data;
  const context = { userId: user.id, action: "triggerSentryErrorAction" };

  try {
    const errorMessage = `DIAG-S-01: Error de servidor de diagnóstico provocado por ${
      user.email
    } a las ${new Date().toISOString()}`;
    logger.info(
      context,
      `[DiagnosticsAction] Lanzando error deliberado para Sentry: "${errorMessage}"`
    );
    throw new Error(errorMessage);
  } catch (error) {
    // --- INICIO DE REFACTORIZACIÓN: Firma de Logging Canónica ---
    logger.error(
      { err: error, ...context },
      "[DiagnosticsAction] Error capturado. Enviando a Sentry y re-lanzando."
    );
    // --- FIN DE REFACTORIZACIÓN ---
    Sentry.captureException(error, { extra: context });
    throw error;
  }
}
// src/lib/actions/dev/diagnostics.actions.ts
