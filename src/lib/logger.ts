// src/lib/logger.ts

/**
 * @file src/lib/logger.ts
 * @description Aparato de Logging de Élite y Desacoplado.
 *              Proporciona dos loggers distintos: `logger` para el entorno de
 *              servidor (con `pino`) y `clientLogger` para el entorno de cliente
 *              (wrapper de `console`), garantizando la separación de dependencias.
 * @author L.I.A. Legacy
 * @version 1.1.0
 * @see .docs/espejo/lib/logger.md
 */

import pino from "pino";

// --- LOGGER DE SERVIDOR ---

/**
 * @description El nivel de log para el logger de servidor.
 * Se lee desde la variable de entorno `LOG_LEVEL`. Si no se define,
 * se utiliza 'info' en producción y 'trace' en desarrollo.
 * @type {pino.Level}
 */
const logLevel: pino.Level =
  (process.env.LOG_LEVEL as pino.Level) ||
  (process.env.NODE_ENV === "development" ? "trace" : "info");

/**
 * @description Opciones de configuración base para el logger de Pino.
 * @type {pino.LoggerOptions}
 */
const pinoOptions: pino.LoggerOptions = {
  level: logLevel,
  base: {
    service: "convertikit-server",
    pid: process.pid,
    hostname:
      typeof process.env.HOSTNAME === "string"
        ? process.env.HOSTNAME
        : "unknown",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label: string) => ({ level: label }),
  },
};

/**
 * @description Transporte de Pino para formatear logs en desarrollo.
 * Utiliza `pino-pretty` para una salida legible y coloreada.
 * En producción, este transporte es `undefined`, resultando en logs JSON.
 * @type {pino.TransportSingleOptions | undefined}
 */
const pinoTransport: pino.TransportSingleOptions | undefined =
  process.env.NODE_ENV === "development"
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          levelFirst: true,
          translateTime: "SYS:yyyy-mm-dd HH:MM:ss.l",
        },
      }
    : undefined;

/**
 * @public
 * @constant logger
 * @description Logger canónico para uso en **entornos de servidor** (Server Components,
 * Server Actions, Middleware, etc.). Utiliza `pino` para un logging estructurado y de alto rendimiento.
 * - **En Desarrollo:** Salida formateada y legible.
 * - **En Producción:** Salida en formato JSON, optimizada para la ingesta por Sentry u otros servicios.
 * @example
 * import { logger } from '@/lib/logger';
 * logger.info({ userId: '123' }, 'User logged in successfully');
 */
export const logger = pino(pinoOptions, pinoTransport);

// --- LOGGER DE CLIENTE ---

/**
 * @public
 * @constant clientLogger
 * @description Logger ligero y sin dependencias para uso exclusivo en **Client Components**.
 * Es un simple wrapper alrededor de `console` para mantener una API consistente
 * y garantizar que ninguna dependencia de servidor se filtre en el bundle del cliente.
 * @example
 * "use client";
 * import { clientLogger } from '@/lib/logger';
 * clientLogger.info('Component mounted');
 */
export const clientLogger = {
  trace: console.debug.bind(console, "[TRACE]"),
  info: console.info.bind(console, "[INFO]"),
  warn: console.warn.bind(console, "[WARN]"),
  error: console.error.bind(console, "[ERROR]"),
};

// src/lib/logger.ts
