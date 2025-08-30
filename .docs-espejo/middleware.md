// .docs-espejo/middleware.md
/**
 * @file middleware.md
 * @description Documento Espejo y SSoT para el orquestador de middleware.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
# Manifiesto Conceptual: Orquestador de Middleware

## 1. Rol Estratégico y Propósito
Este aparato es el **Director de Orquesta** de cada petición entrante a la aplicación. Su única responsabilidad es ejecutar una secuencia de manejadores especializados (el "pipeline") en un orden predefinido y lógico. Actúa como la primera línea de defensa y de enriquecimiento de la aplicación, gestionando la internacionalización, la seguridad, la telemetría y las redirecciones antes de que la petición llegue a la capa de renderizado de Next.js.

## 2. Arquitectura del Contenido
1.  **Pipeline Secuencial Lógico:** El orquestador invoca a los manejadores en un orden de "salida temprana": los que pueden terminar el ciclo de la petición (redirecciones, mantenimiento) se ejecutan primero.
2.  **Resiliencia Total:** Todo el pipeline está envuelto en un bloque `try/catch` global. Esto garantiza que un fallo inesperado en cualquier manejador sea capturado, registrado con un ID de error único, y se devuelva una respuesta de error 500 controlada.
3.  **Observabilidad de Rendimiento Edge-Safe:** Utiliza la API `performance` global, disponible tanto en el Edge como en el navegador y Node.js, para medir la latencia. Cada manejador es invocado a través de un wrapper `withPerformanceLogging` que registra su tiempo de ejecución individual y el del pipeline completo.

## 3. Contrato de API
- **Entrada:** `NextRequest`.
- **Salida:** Una `NextResponse` final, que es el resultado de la composición de las modificaciones de todos los manejadores del pipeline.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Factoría de Pipeline:** Abstraer la lógica de encadenamiento a una función `createMiddlewarePipeline([...handlers])`.
 * 2.  **Configuración de Matcher Dinámica:** Generar el `matcher` dinámicamente a partir del `ROUTE_MANIFEST`.
 * 3.  **Manejador de A/B Testing:** Añadir un nuevo manejador al pipeline para pruebas A/B.
 * 4.  **Patrón de Circuit Breaker:** Implementar un "circuit breaker" para manejadores que dependen de servicios externos.
 * 5.  **Logging de Payload:** Añadir un manejador opcional que registre el cuerpo de las peticiones (sanitizado) bajo un flag de debug.
 * =====================================================================
 */
// .docs-espejo/middleware.md