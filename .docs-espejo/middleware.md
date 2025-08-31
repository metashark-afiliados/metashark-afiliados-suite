// .docs-espejo/middleware.md
/**
 * @file middleware.md
 * @description Documento Espejo y SSoT conceptual para el orquestador de middleware.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 8.0.0
 */
# Manifiesto Conceptual: Orquestador de Middleware v8.0

## 1. Rol Estratégico y Propósito
Este aparato es el **Director de Orquesta** de cada petición. Su única responsabilidad es ejecutar una secuencia de manejadores (`pipeline`) en un orden lógico y predefinido, implementando un **patrón de respuesta encadenada inmutable**.

## 2. Arquitectura del Contenido
1.  **Pipeline Secuencial Inmutable:** El orquestador inicia con una `NextResponse` base. Cada manejador del pipeline recibe la `request` y la `response` del paso anterior. El manejador ejecuta su lógica y devuelve una `NextResponse` (ya sea la misma o una nueva de redirección/reescritura). Esta respuesta se convierte en la entrada para el siguiente manejador. Este patrón garantiza un flujo de estado explícito y predecible, crítico para el Edge Runtime.
2.  **Resiliencia Total:** El pipeline completo está envuelto en un `try/catch` global para capturar, registrar y devolver una respuesta de error controlada, previniendo el `MIDDLEWARE_INVOCATION_FAILED`.
3.  **Observabilidad de Rendimiento:** Mantiene el `withPerformanceLogging` para medir la latencia de cada manejador y del pipeline completo.

## 3. Contrato de API
- **Entrada:** `NextRequest`.
- **Salida:** La `NextResponse` final, resultado de la composición de las modificaciones de todos los manejadores.

/**
 * =====================================================================
 *                           ZONA DE MEJORAS
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Factoría de Pipeline Declarativa:** Abstraer la lógica de encadenamiento a una función `createMiddlewarePipeline([...handlers])` para un código más declarativo.
 * 2.  **Configuración de Matcher Dinámica:** Generar `config.matcher` dinámicamente a partir del `ROUTE_MANIFEST`.
 * 3.  **Manejador de A/B Testing:** Añadir un manejador para redirigir a variantes de una página para pruebas A/B.
 * 4.  **Patrón de Circuit Breaker:** Implementar un "circuit breaker" para manejadores que dependen de servicios externos.
 * 5.  **Internacionalización de la Documentación:** Traducir este manifiesto.
 * =====================================================================
 */
// .docs-espejo/middleware.md