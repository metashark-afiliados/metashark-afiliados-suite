// src/lib/logger.ts
/**
 * @file src/lib/logger.ts
 * @description Aparato de Logging de Élite Unificado y SSoT. Integra `pino`
 *              con un transporte a Sentry y `correlationId` automático para
 *              una observabilidad de nivel de producción.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 6.0.0
 * @see .docs-espejo/lib/logger.ts.md
 */
import pino from "pino";
import { REDACTED_PATHS } from "@/config/logger.config";
import { getCorrelationId } from "@/lib/helpers/correlation-id.helper";

// --- NÚCLEO PINO ---

const logLevel: pino.Level =
  (process.env.LOG_LEVEL as pino.Level) ||
  (process.env.NODE_ENV === "development" ? "trace" : "info");

const pinoConfig: pino.LoggerOptions = {
  level: logLevel,
  base: {
    service: "convertikit-server",
    pid: typeof process !== "undefined" ? process.pid : undefined,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
    log: (obj) => {
      // Inyectar correlationId en cada log
      const correlationId = getCorrelationId();
      if (correlationId) {
        return { ...obj, correlationId };
      }
      return obj;
    },
  },
  redact: {
    paths: [...REDACTED_PATHS],
    censor: "[REDACTED]",
  },
};

// --- TRANSPORTE A SENTRY ---
// En desarrollo, usamos pino-pretty. En producción, enviamos a stdout y a Sentry.
const transport =
  process.env.NODE_ENV === "production"
    ? pino.transport({
        targets: [
          {
            target: "pino-sentry-transport",
            options: {
              sentry: {
                dsn: process.env.SENTRY_DSN,
              },
              minLevel: "error", // Solo enviar errores y niveles superiores
            },
          },
          {
            target: "pino/file", // stdout
            options: {},
            level: logLevel,
          },
        ],
      })
    : pino.transport({
        target: "pino-pretty",
        options: { colorize: true, singleLine: true },
      });

export const logger = pino(pinoConfig, transport);

// --- LOGGER DE CLIENTE ---
// (sin cambios)
const createSafeConsoleMethod = (
  method: "log" | "info" | "warn" | "error" | "debug",
  prefix: string
) => {
  if (typeof console !== "undefined" && typeof console[method] === "function") {
    return console[method].bind(console, prefix);
  }
  return () => {};
};

export const clientLogger = {
  trace: createSafeConsoleMethod("debug", "[TRACE]"),
  info: createSafeConsoleMethod("info", "[INFO]"),
  warn: createSafeConsoleMethod("warn", "[WARN]"),
  error: createSafeConsoleMethod("error", "[ERROR]"),
  fatal: createSafeConsoleMethod("error", "[FATAL]"),
};
// src/lib/logger.ts
