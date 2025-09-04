// src/components/telemetry/TelemetryClientLogger.tsx
/**
 * @file TelemetryClientLogger.tsx
 * @description Componente "fire-and-forget" que enriquece el log de sesión.
 *              Refactorizado para utilizar la firma correcta del `clientLogger`
 *              y un manejo de errores robusto, resolviendo el error TS2345.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
"use client";

import React from "react";

import { telemetry } from "@/lib/actions";
import { getClientFingerprint } from "@/lib/helpers/client-fingerprint";
import { clientLogger } from "@/lib/logger";

/**
 * @public
 * @component TelemetryClientLogger
 * @description Orquesta la recolección de datos del cliente y los envía
 *              a la Server Action `enrichVisitorLogAction`.
 * @returns {null} No renderiza nada en el DOM.
 */
export function TelemetryClientLogger(): null {
  React.useEffect(() => {
    const enrichVisit = async () => {
      if (sessionStorage.getItem("telemetry_client_logged")) {
        clientLogger.trace(
          "[TelemetryClient] Log de enriquecimiento ya enviado para esta sesión."
        );
        return;
      }

      const cookieMatch = document.cookie.match(/metashark_session_id=([^;]+)/);
      const sessionIdFromCookie = cookieMatch ? cookieMatch[1] : null;

      if (!sessionIdFromCookie) {
        clientLogger.warn(
          "[TelemetryClient] No se encontró cookie de sesión. Abortando enriquecimiento."
        );
        return;
      }

      const fingerprint = await getClientFingerprint();
      if (!fingerprint) {
        clientLogger.warn(
          "[TelemetryClient] No se pudo generar la huella digital. Abortando."
        );
        return;
      }

      try {
        await telemetry.enrichVisitorLogAction({
          sessionId: sessionIdFromCookie,
          fingerprint,
          browser_context: {
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            userAgentClientHint:
              (navigator as any).userAgentData?.brands || null,
          },
        });
        sessionStorage.setItem("telemetry_client_logged", "true");
        clientLogger.info(
          "[TelemetryClient] Log de visitante enriquecido con éxito.",
          { sessionId: sessionIdFromCookie }
        );
      } catch (error) {
        const errorToLog =
          error instanceof Error ? error : new Error(String(error));
        clientLogger.error(
          "[TelemetryClient] Fallo al invocar enrichVisitorLogAction.",
          errorToLog
        );
      }
    };

    const timerId = setTimeout(enrichVisit, 500);
    return () => clearTimeout(timerId);
  }, []);

  return null;
}
// src/components/telemetry/TelemetryClientLogger.tsx
