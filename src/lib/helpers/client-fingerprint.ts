// src/lib/helpers/client-fingerprint.ts
/**
 * @file client-fingerprint.ts
 * @description Helper atómico que genera una huella digital única del navegador
 *              del cliente utilizando `@fingerprintjs/fingerprintjs`. Gestiona la
 *              carga diferida y el manejo de errores.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import FingerprintJS from "@fingerprintjs/fingerprintjs";

import { logger } from "@/lib/logging";

let fpPromise: ReturnType<typeof FingerprintJS.load> | null = null;

/**
 * @public
 * @async
 * @function getClientFingerprint
 * @description Obtiene la huella digital (visitorId) del navegador del cliente.
 *              La instancia de FingerprintJS se carga de forma diferida y se cachea
 *              para optimizar el rendimiento en llamadas subsiguientes.
 * @returns {Promise<string | null>} Una promesa que resuelve con la huella digital
 *                                    del cliente (string) o `null` si ocurre un error.
 */
export async function getClientFingerprint(): Promise<string | null> {
  try {
    if (!fpPromise) {
      logger.trace("[Fingerprint] Cargando instancia de FingerprintJS...");
      fpPromise = FingerprintJS.load();
    }
    const fp = await fpPromise;
    const result = await fp.get();
    logger.trace("[Fingerprint] Huella digital del cliente generada.", {
      visitorId: result.visitorId,
    });
    return result.visitorId;
  } catch (error) {
    logger.error(
      "[Fingerprint] Error al generar la huella digital del cliente:",
      error
    );
    return null;
  }
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Carga Diferida y Cacheo**: ((Implementada)) La librería se carga de forma asíncrona y se cachea en una promesa global, asegurando una única inicialización y un rendimiento óptimo.
 * 2. **Manejo de Errores Robusto**: ((Implementada)) Incluye `try/catch` para gestionar errores, evitando que un fallo en la telemetría afecte la experiencia del usuario.
 * 3. **Full Observabilidad**: ((Implementada)) Registra eventos de `trace` y `error` para una visibilidad completa.
 *
 * @subsection Melhorias Futuras
 * 1. **Contexto de Confianza**: ((Vigente)) La librería `FingerprintJS` proporciona una puntuación de `confidence`. Este valor podría ser enviado a la Server Action para evaluar la fiabilidad de la huella, útil para la detección avanzada de fraudes.
 *
 * =====================================================================
 */
// src/lib/helpers/client-fingerprint.ts
