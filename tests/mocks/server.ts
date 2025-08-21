// tests/mocks/server.ts
/**
 * @file tests/mocks/server.ts
 * @description Aparato de configuración para el servidor de mocks de MSW (Mock Service Worker).
 *              Esta es la instancia del servidor que se ejecutará en el entorno de Node.js
 *              durante las pruebas, interceptando todas las peticiones de red salientes.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { setupServer } from "msw/node";

import { handlers } from "./handlers";

/**
 * @public
 * @constant server
 * @description La instancia del servidor de MSW, configurada con los manejadores base.
 *              Es controlada por el ciclo de vida definido en `vitest.setup.ts`.
 */
export const server = setupServer(...handlers);

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Pilar de Pruebas de Integración**: ((Implementada)) Este aparato establece el servidor de MSW, el pilar fundamental para pruebas de integración de alta fidelidad que involucran la capa de red.
 * 2. **Atomicidad y Cohesión**: ((Implementada)) El archivo tiene la única responsabilidad de crear y exportar la instancia del servidor, adhiriéndose a la "Filosofía LEGO".
 *
 * @subsection Melhorias Futuras
 * 1. **Integración con Storybook**: ((Vigente)) Para pruebas de componentes visuales que realizan peticiones de red, se podría configurar un `setupWorker` de `msw/browser` para ser utilizado en un entorno como Storybook.
 * =====================================================================
 */
// tests/mocks/server.ts
