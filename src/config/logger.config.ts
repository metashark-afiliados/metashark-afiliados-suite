// src/config/logger.config.ts
/**
 * @file logger.config.ts
 * @description Manifiesto de Configuración y SSoT para el sistema de logging.
 *              Define de forma declarativa las claves que deben ser censuradas
 *              automáticamente en todos los logs de la aplicación.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */

/**
 * @public
 * @constant REDACTED_PATHS
 * @description Array de solo lectura que contiene las rutas de claves de objeto
 *              que serán censuradas por Pino. Sigue el formato de `pino-redact`.
 */
export const REDACTED_PATHS: readonly string[] = [
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
  "payload.email",
  "context.payload.email",
];
// src/config/logger.config.ts
