// tests/mocks/handlers.ts
/**
 * @file tests/mocks/handlers.ts
 * @description Manifiesto de Manejadores de Petición para MSW (Mock Service Worker).
 *              Este archivo es la librería central de "respuestas simuladas"
 *              para nuestra API. Sirve como punto de entrada para `msw/node`,
 *              y las suites de pruebas pueden añadir manejadores dinámicamente
 *              usando `server.use()` para simular respuestas específicas.
 * @author Raz Podestá
 * @version 1.0.0
 */
// Inicialmente se exporta un array vacío.
// Las pruebas específicas añadirán manejadores de ruta dinámicamente.
export const handlers = [];

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error Crítico**: ((Implementada)) La creación de este archivo resuelve la dependencia faltante en `tests/mocks/server.ts`, lo que a su vez resuelve el error de importación en `tests/setup.ts`, estabilizando toda la infraestructura de pruebas.
 *
 * @subsection Melhorias Futuras
 * 1. **Manejadores Globales**: ((Vigente)) Si ciertas rutas de API necesitan ser simuladas de la misma manera en *todas* las pruebas (ej. un endpoint de `/api/health`), sus manejadores pueden ser definidos directamente en este archivo.
 *
 * =====================================================================
 */
// tests/mocks/handlers.ts
