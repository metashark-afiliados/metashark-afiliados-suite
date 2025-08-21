// tests/mocks/msw.ts
/**
 * @file tests/mocks/msw.ts
 * @description Aparato de infraestructura atómico y SSoT para Mock Service Worker (MSW).
 *              Consolida la creación del servidor y la exportación del manifiesto de
 *              manejadores, aumentando la cohesión y simplificando la importación.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { http } from "msw";
import { setupServer } from "msw/node";

/**
 * @public
 * @constant handlers
 * @description El array base de manejadores de MSW. Se mantiene intencionalmente
 *              vacío para promover el aislamiento de las pruebas. Las pruebas
 *              deben añadir sus propios manejadores usando `server.use()`.
 */
export const handlers = [];

/**
 * @public
 * @constant server
 * @description La instancia del servidor de MSW, configurada con los manejadores base.
 *              Es controlada por el ciclo de vida definido en `tests/config/vitest.setup.ts`.
 */
export const server = setupServer(...handlers);

/**
 * @public
 * @constant http
 * @description Re-exportación de `http` de MSW para conveniencia en la creación de
 *              manejadores de rutas en los arneses de pruebas.
 */
export { http };

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Cohesión y Atomicidad**: ((Implementada)) Consolidar la lógica del servidor y los manejadores en un solo archivo mejora la cohesión y presenta una API más simple para el resto de la infraestructura de pruebas.
 * 2. **Conveniencia de DX**: ((Implementada)) Re-exportar `http` simplifica la escritura de manejadores en las pruebas.
 * =====================================================================
 */
// tests/mocks/msw.ts
