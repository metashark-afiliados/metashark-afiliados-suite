// src/lib/actions/dev/diagnostics.actions.ts
/**
 * @file diagnostics.actions.ts
 * @description Módulo SSoT para Server Actions de diagnóstico. Consolida toda la
 *              lógica de prueba de servicios integrados como Sentry.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 2.0.0
 * @see .docs-espejo/lib/actions/dev/diagnostics.actions.ts.md
 */
"use server";
import "server-only";

import * as Sentry from "@sentry/nextjs";

import { requireAppRole } from "@/lib/auth/user-permissions";
import { logger } from "@/lib/logger";
import { type ActionResult } from "@/lib/validators";

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
  logger.trace("[DiagnosticsAction] Iniciando triggerSentryErrorAction.");

  const roleCheck = await requireAppRole(["developer"]);
  if (!roleCheck.success) {
    return { success: false, error: roleCheck.error };
  }

  const { user } = roleCheck.data;

  try {
    const errorMessage = `DIAG-S-01: Error de servidor de diagnóstico provocado por ${
      user.email
    } a las ${new Date().toISOString()}`;
    logger.info(
      `[DiagnosticsAction] Lanzando error deliberado para Sentry: "${errorMessage}"`
    );
    throw new Error(errorMessage);
  } catch (error) {
    logger.error(
      "[DiagnosticsAction] Error capturado. Enviando a Sentry y re-lanzando.",
      { err: error }
    );
    Sentry.captureException(error, {
      extra: { userId: user.id, action: "triggerSentryErrorAction" },
    });
    // Es crucial re-lanzar para que Next.js active los Error Boundaries.
    throw error;
  }

  // Este bloque teóricamente no es alcanzable, pero mantiene el contrato.
  return { success: true, data: undefined };
}
// src/lib/actions/dev/diagnostics.actions.ts
