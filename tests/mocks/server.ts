// tests/mocks/server.ts
/**
 * @file tests/mocks/server.ts
 * @description Aparato de infraestructura atómico y SSoT
 *              para la instancia del servidor de MSW.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { setupServer } from "msw/node";

import { handlers } from "./handlers";

export const server = setupServer(...handlers);

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Pilar de Pruebas de Integración**: ((Implementada)) Este aparato establece el servidor de MSW, el pilar fundamental para pruebas de integración de alta fidelidad.
 * =====================================================================
 */
// tests/mocks/server.ts