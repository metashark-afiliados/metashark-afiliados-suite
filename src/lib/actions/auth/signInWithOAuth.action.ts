// src/lib/actions/auth/signInWithOAuth.action.ts
/**
 * @file signInWithOAuth.action.ts
 * @description Server Action atómica para el inicio del flujo de autenticación OAuth.
 *              Refactorizada para cumplir con el contrato de errores soberanos (AD-004),
 *              observabilidad completa, y la firma de logging canónica de Pino.
 * @author Raz Podesta - MetaShark Tech
 * @version 4.0.0
 */
"use server";
import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import {
  createAuditLog,
  createPersistentErrorLog,
} from "@/lib/actions/_helpers";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import {
  type ActionResult,
  OAuthSchema,
  type ValidationErrorKey,
} from "@/lib/validators";

/**
 * @public
 * @async
 * @function signInWithOAuthAction
 * @description Valida el proveedor de OAuth y redirige al usuario a la página de
 *              autorización del proveedor. No retorna un valor en caso de éxito,
 *              ya que su efecto secundario principal es una redirección.
 * @param {FormData} formData - Datos del formulario que deben contener `provider`.
 * @returns {Promise<ActionResult<never> | void>} Devuelve un `ActionResult` en
 *          caso de error, o `void` en caso de éxito (ya que redirige).
 */
export async function signInWithOAuthAction(
  formData: FormData
): Promise<ActionResult<never> | void> {
  const origin = headers().get("origin");
  const rawData = Object.fromEntries(formData.entries());
  const context = { payload: rawData, origin };

  logger.trace(context, "[signInWithOAuthAction] Iniciando acción.");

  try {
    // 1. Validación de Payload
    const validation = OAuthSchema.safeParse(rawData);
    if (!validation.success) {
      throw validation.error;
    }
    const { provider } = validation.data;
    context.payload.provider = provider; // Actualizar contexto con dato validado

    // 2. Ejecución de Lógica de Negocio y Efectos Secundarios
    await createAuditLog("oauth_flow.started", {
      metadata: { provider, origin },
    });

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${origin}/api/auth/callback` },
    });

    if (error) {
      throw error;
    }

    if (data.url) {
      logger.info(
        { url: data.url, ...context },
        "[signInWithOAuthAction] Redirigiendo a URL de proveedor OAuth."
      );
      redirect(data.url);
    } else {
      throw new Error("No URL returned from OAuth provider.");
    }
  } catch (error) {
    let errorKey: ValidationErrorKey = "auth.oauth_failed";
    if (error instanceof ZodError) {
      errorKey = "auth.oauth_provider_missing";
    }

    const errorId = await createPersistentErrorLog(
      "signInWithOAuthAction",
      error as Error,
      context
    );

    logger.error(
      { err: error, errorId, ...context },
      "[signInWithOAuthAction] Fallo en la acción."
    );

    return { success: false, error: errorKey };
  }
}
// src/lib/actions/auth/signInWithOAuth.action.ts
