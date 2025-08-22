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

export const handlers = [];

export const server = setupServer(...handlers);

export { http };

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Cohesión y Atomicidad**: ((Implementada)) Consolida la lógica del servidor y los manejadores en un solo archivo, mejorando la cohesión.
 * =====================================================================
 */
// tests/mocks/msw.ts
