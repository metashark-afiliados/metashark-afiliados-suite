// src/lib/services/lia.ai.service.ts
/**
 * @file lia.ai.service.ts
 * @description Módulo de servicio que encapsula la lógica de negocio para
 *              la generación de respuestas del asistente de IA, L.I.A.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";
import "server-only";

import { logger } from "@/lib/logger";

/**
 * @public
 * @constant LiaAIService
 * @description Objeto que encapsula los métodos para interactuar con el servicio de IA.
 *              Actualmente es una simulación de alta fidelidad.
 */
export const LiaAIService = {
  /**
   * @public
   * @async
   * @function generateResponse
   * @description Genera una respuesta de IA basada en el mensaje del usuario.
   * @param {string} userMessage - El mensaje del usuario.
   * @returns {Promise<string>} La respuesta generada por la IA.
   */
  async generateResponse(userMessage: string): Promise<string> {
    logger.trace(
      { userMessage },
      "[LiaAIService] Generando respuesta simulada."
    );
    // Simulación de latencia de la API de IA
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const message = userMessage.toLowerCase();

    if (message.includes("hola")) {
      return "¡Hola! Soy L.I.A., tu asistente de marketing de afiliados. ¿En qué puedo ayudarte hoy?";
    }
    if (message.includes("campaña")) {
      return "Puedo ayudarte a generar ideas de campañas, escribir textos de anuncios o analizar el rendimiento de tus landings. ¿Qué tienes en mente?";
    }
    return "Disculpa, aún estoy aprendiendo. Por ahora, puedo conversar sobre marketing de afiliados y mis funcionalidades. ¡Pregúntame algo más específico!";
  },
};
// src/lib/services/lia.ai.service.ts
