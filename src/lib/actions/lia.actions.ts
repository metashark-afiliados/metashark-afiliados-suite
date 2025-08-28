// src/lib/actions/lia.actions.ts
/**
 * @file lia.actions.ts
 * @description Server Action atómica para interactuar con el asistente de IA (L.I.A.).
 *              Esta acción simula la comunicación con un modelo de lenguaje
 *              y devuelve una respuesta.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use server";
import "server-only";

import { createAuditLog } from "@/lib/actions/_helpers";
import { logger } from "@/lib/logging";
import { createPersistentErrorLog } from "./_helpers/error-log.helper";
import { type ActionResult } from "@/lib/validators";
import { getAuthenticatedUser } from "./_helpers/auth.helper";
import { z } from "zod";

// Esquema de validación para el mensaje entrante
const SendMessageSchema = z.object({
  message: z.string().min(1, { message: "ValidationErrors.message_required" }),
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
 * @returns {Promise<ActionResult<LiaChatMessage>>} El resultado de la operación,
 *          conteniendo el mensaje de respuesta de la IA si tiene éxito.
 */
export async function sendMessageToLiaAction(
  formData: FormData
): Promise<ActionResult<LiaChatMessage>> {
  const authResult = await getAuthenticatedUser();
  if ("error" in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const { message } = SendMessageSchema.parse({
      message: formData.get("message"),
    });

    logger.info(
      `[LiaAction] Usuario ${user.id} envió mensaje a L.I.A.: "${message}"`
    );

    // --- SIMULACIÓN DE RESPUESTA DE IA ---
    // En una implementación real, aquí se usaría un SDK de IA (ej. Vercel AI SDK, OpenAI, Gemini).
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simula latencia de IA

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
    // --- FIN DE SIMULACIÓN ---

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
      { userId: user.id, payload: Object.fromEntries(formData) }
    );
    logger.error(
      `[LiaAction] Fallo al procesar mensaje de IA. Log ID: ${errorId}`,
      { error }
    );
    return {
      success: false,
      error: "components.feedback.LiaChatWidget.error_api_message",
    };
  }
}

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
 * 1. **Creación de Server Action de IA**: ((Implementada)) Este nuevo aparato encapsula la lógica para interactuar con la IA, cumpliendo el SRP y habilitando la funcionalidad central del chat.
 * 2. **Simulación de IA Robusta**: ((Implementada)) Utiliza un `setTimeout` para simular la latencia y devuelve respuestas condicionales básicas, lo que permite probar el flujo de UI.
 * 3. **Validación de Entrada con Zod**: ((Implementada)) Incluye `SendMessageSchema` para validar el mensaje del usuario, previniendo entradas vacías.
 * 4. **Full Observabilidad y Auditoría**: ((Implementada)) La acción registra logs detallados de `info` y `error`, y audita cada interacción exitosa con `createAuditLog`.
 * 5. **Manejo de Errores de API**: ((Implementada)) Devuelve claves de i18n (`error_api_message`) en caso de fallo, desacoplando el backend del frontend.
 *
 * @subsection Melhorias Futuras
 * 1. **Integración Real con SDK de IA**: ((Vigente)) Reemplazar la simulación con una integración real con el Vercel AI SDK o la API de OpenAI/Gemini, permitiendo la generación dinámica de respuestas.
 * 2. **Historial de Conversación**: ((Vigente)) La acción podría aceptar un historial de mensajes (`LiaChatMessage[]`) como parte del payload, permitiendo a la IA mantener el contexto de la conversación.
 * 3. **Streaming de Respuestas**: ((Vigente)) Para una UX de élite, la Server Action podría utilizar la API de `streaming` de Next.js para enviar la respuesta de la IA palabra por palabra, en lugar de esperar la respuesta completa.
 *
 * =====================================================================
 */
