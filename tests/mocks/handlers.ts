// tests/mocks/handlers.ts
/**
 * @file tests/mocks/handlers.ts
 * @description Manifiesto de Manejadores de Petición para MSW (Mock Service Worker).
 *              Este array se exporta intencionalmente vacío. Esta decisión de
 *              diseño de élite fuerza a cada arnés de pruebas a ser explícito
 *              sobre las condiciones de red que requiere, añadiendo sus propios
 *              manejadores dinámicamente a través de `server.use()`.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { type HttpHandler } from "msw";

export const handlers: HttpHandler[] = [];

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Promoción del Aislamiento de Pruebas**: ((Implementada)) Al estar vacío por defecto, este aparato impone el patrón de definir mocks de red a nivel de prueba.
 * =====================================================================
 */
// tests/mocks/handlers.ts
