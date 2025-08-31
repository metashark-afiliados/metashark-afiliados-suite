// .docs-espejo/middleware.md
/**
 * @file middleware.md
 * @description Documento Espejo y SSoT conceptual para el orquestador de middleware.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 7.0.0
 */
# Manifiesto Conceptual: Orquestador de Middleware v7.0

## 1. Rol Estratégico y Propósito
Este aparato es el **Director de Orquesta** de cada petición entrante a la aplicación. Su única responsabilidad es ejecutar una secuencia de manejadores especializados (el "pipeline") en un orden predefinido y lógico. Actúa como la primera línea de defensa y de enriquecimiento de la aplicación, gestionando la internacionalización, seguridad, telemetría y redirecciones antes de que la petición llegue a la capa de renderizado de Next.js.

## 2. Arquitectura del Contenido
La arquitectura ha sido elevada a un estándar de élite a través de los siguientes pilares:

1.  **Pipeline Secuencial Lógico:** El orquestador invoca a los manejadores en un orden de "salida temprana": los que pueden terminar el ciclo de la petición (redirecciones, mantenimiento) se ejecutan primero. Esto optimiza el rendimiento al evitar la ejecución de manejadores innecesarios.

2.  **Resiliencia Total:** Todo el pipeline está envuelto en un bloque `try/catch` global. Esto garantiza que un fallo inesperado en cualquier manejador sea capturado, registrado con un ID de error único, y se devuelva una respuesta de error 500 controlada, previniendo caídas de la aplicación.

3.  **Observabilidad de Rendimiento Edge-Safe:** Utiliza la API `performance` global, disponible en todos los runtimes, para medir la latencia. Cada manejador es invocado a través de un wrapper `withPerformanceLogging` que registra su tiempo de ejecución individual. El log final del pipeline ahora incluye el `locale` detectado para una trazabilidad de contexto completa.

## 3. Contrato de API
- **Entrada:** `NextRequest`.
- **Salida:** Una `NextResponse` final, que es el resultado de la composición de las modificaciones de todos los manejadores del pipeline.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Factoría de Pipeline Declarativa:** Abstraer la lógica de encadenamiento de manejadores a una función `createMiddlewarePipeline([...handlers])` o a un patrón de constructor (`builder pattern`) para hacer el código más declarativo y mantenible.
 * 2.  **Configuración de Matcher Dinámica:** Generar la constante `config.matcher` dinámicamente a partir del `ROUTE_MANIFEST`, garantizando que todas las rutas protegidas sean cubiertas automáticamente por el middleware.
 * 3.  **Manejador de A/B Testing:** Añadir un nuevo manejador al pipeline que lea cookies o cabeceras para redirigir a los usuarios a diferentes variantes de una página para pruebas A/B.
 * 4.  **Patrón de Circuit Breaker:** Para manejadores que dependen de servicios externos (como GeoIP), implementar un "circuit breaker" para deshabilitar temporalmente el manejador si el servicio externo falla repetidamente.
 * 5.  **Logging de Payload:** Añadir un manejador opcional, activado por una variable de entorno `DEBUG_MIDDLEWARE_PAYLOAD=true`, que registre el cuerpo de las peticiones POST (sanitizado) para una depuración profunda.
 * 6.  **Abstracción del Performance Wrapper:** Mover `withPerformanceLogging` a su propio aparato en `src/middleware/lib/` para una máxima atomicidad.
 * 7.  **Manejo de Errores por Handler:** Implementar un `try/catch` individual dentro de `withPerformanceLogging` para que el fallo de un handler no crítico (ej. `handleTelemetry`) no interrumpa el pipeline completo.
 * 8.  **Gestión de Secretos de Vercel:** Integrar con Vercel Edge Config para gestionar configuraciones como el modo de mantenimiento o las IPs en la lista blanca sin necesidad de un redespliegue.
 * 9.  **Cacheo de Resultados de Handlers:** Para manejadores costosos, implementar una capa de cacheo en Vercel KV para los resultados, basada en la URL y cabeceras de la petición.
 * 10. **Internacionalización de la Documentación:** Traducir este manifiesto para equipos de desarrollo multilingües.
 * =====================================================================
 */
// .docs-espejo/middleware.md