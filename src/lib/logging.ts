// src/lib/logging.ts
/**
 * @file src/lib/logging.ts
 * @description Aparato de Logging de Élite Unificado y SSoT.
 *              Implementa `pino` para un logging estructurado y de alto rendimiento.
 *              La API del `logger` de servidor está encapsulada para mantener
 *              retrocompatibilidad con la firma `(message, ...context)` usada
 *              a través de la aplicación, garantizando cero regresiones.
 * @author L.I.A. Legacy
 * @co-piloto RaZ WriTe
 * @version 9.0.0
 * @see .docs-espejo/lib/logging.md
 */
import pino from "pino";

// --- NÚCLEO PINO ---

const logLevel: pino.Level =
  (process.env.LOG_LEVEL as pino.Level) ||
  (process.env.NODE_ENV === "development" ? "trace" : "info");

/**
 * @private
 * @constant pinoLogger
 * @description Instancia base de Pino. Emite logs JSON a `stdout`.
 *              Para una salida legible en desarrollo, ejecute con `pnpm dev:pretty`.
 */
const pinoLogger = pino({
  level: logLevel,
  base: {
    service: "convertikit-server",
    pid: typeof process !== "undefined" ? process.pid : undefined,
    hostname:
      typeof process !== "undefined" && typeof process.env.HOSTNAME === "string"
        ? process.env.HOSTNAME
        : "unknown",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
});

// --- LOGGER DE SERVIDOR (CON WRAPPER DE RETROCOMPATIBILIDAD) ---

/**
 * @public
 * @constant logger
 * @description Logger canónico para uso en TODOS los entornos de servidor.
 *              Mantiene una API idéntica a la implementación anterior para
 *              garantizar la retrocompatibilidad y evitar refactorizaciones masivas.
 *              Transforma las llamadas `(message, ...context)` al formato
 *              de pino `{ context }, message`.
 */
export const logger = {
  trace: (message: string, ...context: any[]) =>
    pinoLogger.trace({ context }, message),
  info: (message: string, ...context: any[]) =>
    pinoLogger.info({ context }, message),
  warn: (message: string, ...context: any[]) =>
    pinoLogger.warn({ context }, message),
  error: (message: string, ...context: any[]) => {
    const errorObject = context.find((c) => c instanceof Error);
    const extraContext = context.filter((c) => !(c instanceof Error));
    pinoLogger.error({ err: errorObject, context: extraContext }, message);
  },
};

// --- LOGGER DE CLIENTE ---

/**
 * @public
 * @constant clientLogger
 * @description Logger ligero y sin dependencias para uso exclusivo en Client Components.
 */
export const clientLogger = {
  trace: console.debug.bind(console, "[TRACE]"),
  info: console.info.bind(console, "[INFO]"),
  warn: console.warn.bind(console, "[WARN]"),
  error: console.error.bind(console, "[ERROR]"),
};
// src/lib/logging.ts
