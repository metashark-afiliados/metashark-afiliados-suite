// src/lib/logging.ts
/**
 * @file src/lib/logging.ts
 * @description Aparato de Logging de Élite y Desacoplado.
 *              Proporciona dos loggers distintos: `logger` para el entorno de
 *              servidor (con integración completa de Sentry) y `clientLogger`
 *              para el entorno de cliente (un wrapper ligero de `console`).
 *              Esta separación es crucial para la arquitectura y previene
 *              que dependencias de servidor se empaqueten en el bundle del cliente.
 * @author L.I.A. Legacy
 * @version 7.0.0
 */
import * as Sentry from "@sentry/nextjs";

type LogLevel = "trace" | "info" | "warn" | "error";

// --- LOGGER DE SERVIDOR ---

function logToServerConsole(
  level: LogLevel,
  message: string,
  ...context: any[]
) {
  if (process.env.NODE_ENV !== "development") return;
  const timestamp = new Date().toISOString();
  const logMessage = `[${level.toUpperCase()}] [${timestamp}] ${message}`;

  const consoleMethod = {
    trace: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error,
  };
  consoleMethod[level](logMessage, ...context);
}

/**
 * @public
 * @constant logger
 * @description Logger canónico para uso en **entornos de servidor** (Server Components,
 *              Server Actions, Middleware, etc.). Envía logs a Sentry en producción.
 */
export const logger = {
  trace: (message: string, ...context: any[]) => {
    logToServerConsole("trace", message, ...context);
  },
  info: (message: string, ...context: any[]) => {
    logToServerConsole("info", message, ...context);
    if (process.env.NODE_ENV === "production") {
      Sentry.captureMessage(message, { level: "info", extra: { context } });
    }
  },
  warn: (message: string, ...context: any[]) => {
    logToServerConsole("warn", message, ...context);
    if (process.env.NODE_ENV === "production") {
      Sentry.captureMessage(message, { level: "warning", extra: { context } });
    }
  },
  error: (message: string, ...context: any[]) => {
    logToServerConsole("error", message, ...context);
    if (process.env.NODE_ENV === "production") {
      Sentry.captureMessage(message, { level: "error", extra: { context } });
    }
  },
};

// --- LOGGER DE CLIENTE ---

/**
 * @public
 * @constant clientLogger
 * @description Logger ligero para uso exclusivo en **Client Components**. Es un simple
 *              wrapper alrededor de `console` y NO tiene dependencias de Sentry o
 *              cualquier otro paquete de Node.js, garantizando un bundle de cliente óptimo.
 */
export const clientLogger = {
  trace: console.debug.bind(console, "[TRACE]"),
  info: console.info.bind(console, "[INFO]"),
  warn: console.warn.bind(console, "[WARN]"),
  error: console.error.bind(console, "[ERROR]"),
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Separación Cliente/Servidor**: ((Implementada)) La creación de dos loggers separados resuelve la advertencia de "Critical dependency" y previene que el SDK de Sentry para Node.js se incluya en el bundle del cliente.
 *
 * =====================================================================
 */
// src/lib/logging.ts
