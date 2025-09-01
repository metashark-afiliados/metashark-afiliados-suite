// src/lib/logger.ts
/**
 * @file src/lib/logger.ts
 * @description Aparato de Logging de Élite Unificado y SSoT. Implementa `pino`
 *              para un logging estructurado, de alto rendimiento y seguro por
 *              defecto con redacción de datos sensibles. La API del `logger`
 *              de servidor está encapsulada para mantener retrocompatibilidad.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 4.0.0
 * @see .docs/espejo/lib/logger.md
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
 *              Incluye redacción automática para datos sensibles.
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
  /**
   * @property redact
   * @description Capa de seguridad que censura automáticamente datos sensibles
   *              en los logs para prevenir fugas de información.
   */
  redact: {
    paths: [
      "email",
      "password",
      "token",
      "accessToken",
      "refreshToken",
      "*.password",
      "*.email",
      "req.headers.authorization",
      'req.headers["x-api-key"]',
      "obj.user.email",
    ],
    censor: "[REDACTED]",
  },
});

// --- LOGGER DE SERVIDOR (CON WRAPPER DE RETROCOMPATIBILIDAD) ---

/**
 * @public
 * @constant logger
 * @description Logger canónico para uso en TODOS los entornos de servidor. Mantiene una
 *              API idéntica a la implementación anterior para garantizar la
 *              retrocompatibilidad y evitar refactorizaciones masivas. Transforma
 *              las llamadas `(message, ...context)` al formato de pino `{ err, context }, message`.
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
  fatal: (message: string, ...context: any[]) => {
    const errorObject = context.find((c) => c instanceof Error);
    const extraContext = context.filter((c) => !(c instanceof Error));
    pinoLogger.fatal({ err: errorObject, context: extraContext }, message);
  },
};

// --- LOGGER DE CLIENTE ---

/**
 * @public
 * @constant clientLogger
 * @description Logger ligero y sin dependencias para uso exclusivo en Client Components.
 *              Su API es simétrica con la del logger de servidor.
 */
export const clientLogger = {
  trace: console.debug.bind(console, "[TRACE]"),
  info: console.info.bind(console, "[INFO]"),
  warn: console.warn.bind(console, "[WARN]"),
  error: console.error.bind(console, "[ERROR]"),
  fatal: console.error.bind(console, "[FATAL]"),
};
// src/lib/logger.ts
