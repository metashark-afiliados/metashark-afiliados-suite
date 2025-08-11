// src/lib/logging.ts
/**
 * @file src/lib/logging.ts
 * @description Aparato de Logging Canónico de Élite (v6 - Salida Limpia).
 *              Refactorizado para usar `console.debug` para el nivel 'trace',
 *              eliminando los stack traces del Edge Runtime y produciendo una
 *              salida limpia y legible en desarrollo.
 * @author L.I.A. Legacy
 * @version 6.0.0
 */
import * as Sentry from "@sentry/nextjs";

type LogLevel = "trace" | "info" | "warn" | "error";

function logToConsole(level: LogLevel, message: string, ...context: any[]) {
  if (process.env.NODE_ENV !== "development") return;

  const timestamp = new Date().toISOString();
  const logMessage = `[${level.toUpperCase()}] [${timestamp}] ${message}`;

  switch (level) {
    case "trace":
      // --- INICIO DE REFACTORIZACIÓN (SALIDA LIMPIA) ---
      // Usar console.debug para logs de trace. Es semánticamente correcto y
      // no imprime el stack trace en el Edge Runtime.
      console.debug(logMessage, ...context);
      // --- FIN DE REFACTORIZACIÓN ---
      break;
    case "info":
      console.info(logMessage, ...context);
      break;
    case "warn":
      console.warn(logMessage, ...context);
      break;
    case "error":
      console.error(logMessage, ...context);
      break;
    default:
      console.log(logMessage, ...context);
      break;
  }
}

export const logger = {
  trace: (message: string, ...context: any[]) => {
    logToConsole("trace", message, ...context);
  },
  info: (message: string, ...context: any[]) => {
    logToConsole("info", message, ...context);
    if (process.env.NODE_ENV === "production") {
      Sentry.captureMessage(message, { level: "info", extra: { context } });
    }
  },
  warn: (message: string, ...context: any[]) => {
    logToConsole("warn", message, ...context);
    if (process.env.NODE_ENV === "production") {
      Sentry.captureMessage(message, { level: "warning", extra: { context } });
    }
  },
  error: (message: string, ...context: any[]) => {
    logToConsole("error", message, ...context);
    if (process.env.NODE_ENV === "production") {
      Sentry.captureMessage(message, { level: "error", extra: { context } });
    }
  },
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Salida de Log Limpia**: ((Implementada)) Se ha reemplazado `console.trace` por `console.debug` para los logs de nivel `trace`. Esto resuelve el problema del `stack trace` desformateado y proporciona una salida de terminal limpia y legible.
 *
 * =====================================================================
 */
// src/lib/logging.ts
