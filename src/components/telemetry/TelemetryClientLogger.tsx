// src/components/telemetry/TelemetryClientLogger.tsx
/**
 * @file TelemetryClientLogger.tsx
 * @description Componente de cliente "fire-and-forget" que enriquece el log de
 *              sesión del servidor. Ha sido refactorizado para invocar la nueva
 *              acción `enrichVisitorLogAction`, resolviendo el error de build TS2551.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";

import React from "react";

import { telemetry } from "@/lib/actions";
import { getClientFingerprint } from "@/lib/helpers/client-fingerprint";
import { logger } from "@/lib/logging";

/**
 * @public
 * @component TelemetryClientLogger
 * @description Orquesta la recolección de datos del cliente (fingerprint, resolución)
 *              y los envía a la Server Action `enrichVisitorLogAction` para
 *              enriquecer el log de sesión creado en el middleware. Se ejecuta
 *              de forma diferida para no impactar las métricas de rendimiento.
 * @returns {null} Este componente no renderiza nada en el DOM.
 */
export function TelemetryClientLogger(): null {
  React.useEffect(() => {
    const enrichVisit = async () => {
      if (sessionStorage.getItem("telemetry_client_logged")) {
        logger.trace(
          "[TelemetryClient] Log de enriquecimiento ya enviado para esta sesión."
        );
        return;
      }

      const cookieMatch = document.cookie.match(/metashark_session_id=([^;]+)/);
      const sessionIdFromCookie = cookieMatch ? cookieMatch[1] : null;

      if (!sessionIdFromCookie) {
        logger.warn(
          "[TelemetryClient] No se encontró cookie de sesión. Abortando enriquecimiento."
        );
        return;
      }

      const fingerprint = await getClientFingerprint();
      if (!fingerprint) {
        logger.warn(
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
        logger.info(
          "[TelemetryClient] Log de visitante enriquecido con éxito.",
          { sessionId: sessionIdFromCookie }
        );
      } catch (error) {
        logger.error(
          "[TelemetryClient] Fallo al invocar enrichVisitorLogAction.",
          error
        );
      }
    };

    const timerId = setTimeout(enrichVisit, 500);
    return () => clearTimeout(timerId);
  }, []);

  return null;
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Build (TS2551)**: ((Implementada)) El componente ahora invoca a la nueva y correcta Server Action `enrichVisitorLogAction`, resolviendo el error de compilación.
 * 2. **Sincronización de Contrato de Datos**: ((Implementada)) El payload enviado ahora coincide con el `ClientEnrichmentSchema`, asegurando que la validación en el servidor tendrá éxito.
 *
 * =====================================================================
 */
// src/components/telemetry/TelemetryClientLogger.tsx
