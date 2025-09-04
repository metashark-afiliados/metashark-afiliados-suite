// src/lib/actions/dev/diagnostics/triggerSentryError.action.ts
/**
 * @file triggerSentryError.action.ts
 * @description Módulo SSoT para la Server Action de diagnóstico de Sentry.
 *              Alineado con la Constitución de Observabilidad y el Manifiesto
 *              de Manejo de Errores.
 * @author L.I.A. Legacy
 * @version 4.0.0
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
 *              monitorización de Sentry en el entorno del servidor. El error es
 *              capturado, enviado a Sentry y luego re-lanzado para que sea
 *              manejado por el Error Boundary de Next.js.
 * @returns {Promise<ActionResult<void>>} Se espera que esta acción siempre lance una excepción.
 * @throws {Error} Un error de prueba con un mensaje único y timestamp.
 */
export async function triggerSentryErrorAction(): Promise<ActionResult<void>> {
  const context: { [key: string]: any } = {
    action: "triggerSentryErrorAction",
  };
  logger.trace(context, "[triggerSentryErrorAction] Iniciando acción.");

  const roleCheck = await requireAppRole(["developer"]);
  if (!roleCheck.success) {
    const errorKey: ValidationErrorKey =
      roleCheck.error === "SESSION_NOT_FOUND"
        ? "generic.error_unauthenticated"
        : "generic.error_permission_denied";
    return { success: false, error: errorKey };
  }

  const { user } = roleCheck.data;
  context.userId = user.id;

  try {
    const errorMessage = `DIAG-S-01: Error de servidor de diagnóstico provocado por ${
      user.email
    } a las ${new Date().toISOString()}`;
    logger.info(
      context,
      `[triggerSentryErrorAction] Lanzando error deliberado para Sentry.`
    );
    throw new Error(errorMessage);
  } catch (error) {
    logger.error(
      { err: error, ...context },
      "[triggerSentryErrorAction] Error capturado. Enviando a Sentry y re-lanzando."
    );
    Sentry.captureException(error, { extra: context });
    throw error;
  }
}
// src/lib/actions/dev/diagnostics/triggerSentryError.action.ts
