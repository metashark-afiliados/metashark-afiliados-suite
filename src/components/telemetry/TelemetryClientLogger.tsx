// src/components/telemetry/TelemetryClientLogger.tsx
/**
 * @file TelemetryClientLogger.tsx
 * @description Componente de cliente "fire-and-forget" que enriquece el log de
 *              sesión del servidor con datos del navegador (fingerprint, resolución, etc.).
 *              Se ejecuta de forma diferida para no impactar las métricas de rendimiento.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import React from "react";

import { telemetry } from "@/lib/actions";
import { getClientFingerprint } from "@/lib/helpers/client-fingerprint";
import { logger } from "@/lib/logging";

/**
 * @public
 * @component TelemetryClientLogger
 * @description Orquesta la recolección de datos del cliente y los envía a la
 *              Server Action `logClientVisitAction`.
 * @returns {null} Este componente no renderiza nada en el DOM.
 */
export function TelemetryClientLogger(): null {
  React.useEffect(() => {
    const logVisit = async () => {
      // Previene doble logueo en la misma sesión de navegador
      if (sessionStorage.getItem("telemetry_client_logged")) {
        logger.trace(
          "[TelemetryClient] Log de cliente ya enviado para esta sesión."
        );
        return;
      }

      const cookieMatch = document.cookie.match(/metashark_session_id=([^;]+)/);
      const sessionIdFromCookie = cookieMatch ? cookieMatch[1] : null;

      if (!sessionIdFromCookie) {
        logger.warn(
          "[TelemetryClient] No se encontró cookie de sesión. Abortando log de cliente."
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
        await telemetry.logClientVisitAction({
          sessionId: sessionIdFromCookie,
          fingerprint,
          screenWidth: window.innerWidth,
          screenHeight: window.innerHeight,
          userAgentClientHint: (navigator as any).userAgentData?.brands || null,
        });
        sessionStorage.setItem("telemetry_client_logged", "true");
        logger.info(
          "[TelemetryClient] Log de cliente enriquecido enviado con éxito.",
          { sessionId: sessionIdFromCookie }
        );
      } catch (error) {
        logger.error(
          "[TelemetryClient] Fallo al enviar log de cliente a la Server Action.",
          error
        );
      }
    };

    // Retrasa la ejecución para no impactar métricas como LCP
    const timerId = setTimeout(logVisit, 500);
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
 * 1. **Arquitectura Robusta**: ((Implementada)) El componente lee el `sessionId` de la cookie y lo envía para enriquecer el log, en lugar de generarlo, asegurando la consistencia.
 * 2. **Optimización de Rendimiento**: ((Implementada)) La ejecución se retrasa 500ms para no interferir con las métricas de Web Vitals.
 * 3. **Prevención de Duplicados**: ((Implementada)) Utiliza `sessionStorage` para asegurar que el log de enriquecimiento se envíe solo una vez por sesión de navegador.
 * 4. **Full Observabilidad**: ((Implementada)) Se han añadido logs de `trace`, `info`, `warn` y `error` para una visibilidad completa del proceso.
 *
 * @subsection Melhorias Futuras
 * 1. **Manejo de Permisos de Privacidad**: ((Vigente)) El componente podría integrarse con un futuro banner de consentimiento de cookies. Si el usuario no acepta las cookies de seguimiento/analíticas, la función `logVisit` no se ejecutaría.
 *
 * =====================================================================
 */
// src/components/telemetry/TelemetryClientLogger.tsx
