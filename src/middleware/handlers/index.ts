// src/middleware/handlers/index.ts
/**
 * @file src/middleware/handlers/index.ts
 * @description Manifiesto (Barrel File) y API pública para todos los manejadores
 *              del middleware. Su única responsabilidad es ensamblar y exportar
 *              todos los aparatos de lógica atómicos del directorio, adhiriéndose
 *              a la "Filosofía LEGO" y proveyendo una fachada limpia para el
 *              orquestador principal.
 * @author Raz Podestá - MetaShark Tech
 * @copilot RaZ WriTe
 * @version 2.0.0
 */
export * from "./auth";
export * from "./i18n";
export * from "./maintenance";
export * from "./multitenancy";
export * from "./redirects";
export * from "./telemetry";
// src/middleware/handlers/index.ts
