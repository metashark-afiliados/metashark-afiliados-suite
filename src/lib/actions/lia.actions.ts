// src/lib/actions/lia.actions.ts
/**
 * @file lia.actions.ts
 * @description Server Action atómica para interactuar con el asistente de IA (L.I.A.).
 *              Refactorizada para alinearse con la SSoT de autenticación, el contrato
 *              `ActionResult`, la lógica de negocio desacoplada y las directivas de logging.
 * @author L.I.A. Legacy
 * @version 4.0.0
 */
"use server";
import "server-only";

import { z, ZodError } from "zod";

import {
  createAuditLog,
  createPersistentErrorLog,
} from "@/lib/actions/_helpers";
import { getAuthUser } from "@/lib/auth/get-auth-user";
import { logger } from "@/lib/logger";
// Oportunidad de atomización: Lógica de IA movida a un servicio simulado
import { LiaAIService } from "@/lib/services/lia.ai.service";
import { type ActionResult, type ValidationErrorKey } from "@/lib/validators";

const SendMessageSchema = z.object({
  message: z
    .string()
    .min(1, { message: "generic.message_required" as ValidationErrorKey }),
});

export type LiaChatMessage = {
  role: "user" | "assistant";
  content: string;
};

/**
 * @public
 * @async
 * @function sendMessageToLiaAction
 * @description Envía un mensaje al asistente de IA (L.I.A.) y recibe una respuesta.
 *              Delega la generación de la respuesta a un servicio de IA desacoplado.
 * @param {FormData} formData - Los datos del formulario que contienen el mensaje del usuario.
 * @returns {Promise<ActionResult<LiaChatMessage>>} El resultado de la operación.
 */
export async function sendMessageToLiaAction(
  formData: FormData
): Promise<ActionResult<LiaChatMessage>> {
  const user = await getAuthUser();
  if (!user) {
    return { success: false, error: "generic.error_unauthenticated" };
  }

  const rawData = Object.fromEntries(formData.entries());
  const context = { userId: user.id, payload: rawData };

  try {
    const { message } = SendMessageSchema.parse(rawData);
    context.payload.message = message;

    logger.info(context, "[LiaAction] Usuario envió mensaje a L.I.A.");

    const aiResponseContent = await LiaAIService.generateResponse(message);

    await createAuditLog("lia.message_sent", {
      userId: user.id,
      metadata: { userMessage: message, liaResponse: aiResponseContent },
    });

    return {
      success: true,
      data: { role: "assistant", content: aiResponseContent },
    };
  } catch (error) {
    let errorKey: ValidationErrorKey = "generic.error_server_generic";
    if (error instanceof ZodError) {
      errorKey = error.errors[0].message as ValidationErrorKey;
    }

    const errorId = await createPersistentErrorLog(
      "sendMessageToLiaAction",
      error as Error,
      context
    );
    logger.error(
      { err: error, errorId, ...context },
      "[LiaAction] Fallo al procesar mensaje de IA."
    );
    return {
      success: false,
      error: errorKey,
    };
  }
}
// src/lib/actions/lia.actions.ts
