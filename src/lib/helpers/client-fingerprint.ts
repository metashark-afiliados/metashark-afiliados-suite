// src/lib/helpers/client-fingerprint.ts
/**
 * @file client-fingerprint.ts
 * @description Helper atómico que genera una huella digital única del navegador
 *              del cliente utilizando `@fingerprintjs/fingerprintjs`. Gestiona la
 *              carga diferida y el manejo de errores.
 * @author Raz Podestá
 * @version 2.0.0
 * @see .docs-espejo/lib/helpers/client-fingerprint.ts.md
 */
"use client";

import FingerprintJS from "@fingerprintjs/fingerprintjs";

import { clientLogger } from "@/lib/logger";

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
      clientLogger.trace(
        {},
        "[Fingerprint] Cargando instancia de FingerprintJS."
      );
      fpPromise = FingerprintJS.load();
    }
    const fp = await fpPromise;
    const result = await fp.get();
    clientLogger.trace(
      { visitorId: result.visitorId },
      "[Fingerprint] Huella digital del cliente generada."
    );
    return result.visitorId;
  } catch (error) {
    clientLogger.error(
      { err: error },
      "[Fingerprint] Error al generar huella digital."
    );
    return null;
  }
}
// src/lib/helpers/client-fingerprint.ts
