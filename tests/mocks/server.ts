// tests/mocks/server.ts
/**
 * @file tests/mocks/server.ts
 * @description Aparato de configuración para el servidor de mocks de MSW.
 *              Ha sido validado para utilizar una importación relativa para
 *              sus dependencias internas, asegurando una inicialización sin
 *              ambigüedades.
 * @author Raz Podestá
 * @version 2.0.0
 */
import { setupServer } from "msw/node";

import { handlers } from "./handlers";

export const server = setupServer(...handlers);

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Robustez de Importación**: ((Implementada)) Al utilizar una ruta relativa para importar sus `handlers`, este módulo se vuelve más robusto y menos dependiente de la configuración de alias externos.
 *
 * =====================================================================
 */
// tests/mocks/server.ts
