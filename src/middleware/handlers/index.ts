// src/middleware/handlers/index.ts
/**
 * @file src/middleware/handlers/index.ts
 * @description Archivo barril para exportar todos los manejadores del middleware
 *              de forma atómica y organizada, siguiendo la "Filosofía LEGO".
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
export * from "./auth/index";
export * from "./i18n";
export * from "./maintenance";
export * from "./multitenancy";
export * from "./redirects";
export * from "./telemetry";
