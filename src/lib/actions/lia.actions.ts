// src/lib/actions/lia.actions.ts
/**
 * @file lia.actions.ts
 * @description Server Action atómica para interactuar con el asistente de IA (L.I.A.).
 *              Esta acción simula la comunicación con un modelo de lenguaje
 *              y devuelve una respuesta. Ha sido refactorizada para corregir un
 *              error de tipo en el logging y para centralizar sus claves de error.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use server";
import "server-only";

import { z } from "zod";

import {
  createAuditLog,
  createPersistentErrorLog,
  getAuthenticatedUser,
} from "@/lib/actions/_helpers";
import { logger } from "@/lib/logging";
import { type ActionResult } from "@/lib/validators";

const SendMessageSchema = z.object({
  message: z
    .string()
    .min(1, { message: "ValidationErrors.generic.message_required" }),
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
 *              Actualmente simula la respuesta.
 * @param {FormData} formData - Los datos del formulario que contienen el mensaje del usuario.
 * @returns {Promise<ActionResult<LiaChatMessage>>} El resultado de la operación.
 */
export async function sendMessageToLiaAction(
  formData: FormData
): Promise<ActionResult<LiaChatMessage>> {
  const authResult = await getAuthenticatedUser();
  if ("error" in authResult) return authResult.error;
  const { user } = authResult;

  const rawData = Object.fromEntries(formData.entries());

  try {
    const { message } = SendMessageSchema.parse(rawData);

    logger.info(
      `[LiaAction] Usuario ${user.id} envió mensaje a L.I.A.: "${message}"`
    );

    await new Promise((resolve) => setTimeout(resolve, 1500));

    let aiResponseContent = "";
    if (message.toLowerCase().includes("hola")) {
      aiResponseContent =
        "¡Hola! Soy L.I.A., tu asistente de marketing de afiliados. ¿En qué puedo ayudarte hoy?";
    } else if (message.toLowerCase().includes("campaña")) {
      aiResponseContent =
        "Puedo ayudarte a generar ideas de campañas, escribir textos de anuncios o analizar el rendimiento de tus landings. ¿Qué tienes en mente?";
    } else {
      aiResponseContent =
        "Disculpa, aún estoy aprendiendo. Por ahora, puedo conversar sobre marketing de afiliados y mis funcionalidades. ¡Pregúntame algo más específico!";
    }

    await createAuditLog("lia.message_sent", {
      userId: user.id,
      metadata: { userMessage: message, liaResponse: aiResponseContent },
    });

    return {
      success: true,
      data: { role: "assistant", content: aiResponseContent },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    const errorId = await createPersistentErrorLog(
      "sendMessageToLiaAction",
      error as Error,
      { userId: user.id, payload: rawData }
    );
    logger.error(
      `[LiaAction] Fallo al procesar mensaje de IA. Log ID: ${errorId}`,
      { error }
    );
    return {
      success: false,
      error: "ValidationErrors.lia.api_failed",
    };
  }
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @section Melhorias Futuras
 * 1. ((Vigente)) **Integración con SDK de IA Real:** Reemplazar la lógica de simulación `if/else` con una integración real a un servicio de LLM (ej. Vercel AI SDK, OpenAI, Gemini) para permitir la generación dinámica de respuestas.
 * 2. ((Vigente)) **Manejo de Historial de Conversación:** Extender la acción para que acepte un historial de mensajes (`LiaChatMessage[]`) como parte del `formData`. Esto permitirá a la IA mantener el contexto de la conversación para respuestas más coherentes y precisas.
 * 3. ((Vigente)) **Streaming de Respuestas:** Para una UX de élite, refactorizar la acción para utilizar la API de `streaming` de Next.js. Esto permitiría enviar la respuesta de la IA palabra por palabra a la UI, en lugar de esperar la respuesta completa, mejorando la percepción de velocidad.
 *
 * =====================================================================
 */
// src/lib/actions/lia.actions.ts
