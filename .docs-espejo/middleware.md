// .docs-espejo/middleware.ts.md
/**
 * @file middleware.md
 * @description Documento Espejo y SSoT conceptual para el orquestador de middleware.
 * @author L.I.A. Legacy
 * @copilot RaZ WriTe
 * @version 8.0.0
 */
# Manifiesto Conceptual: Orquestador de Middleware v8.0

## 1. Rol Estratégico y Propósito
Este aparato es el **Director de Orquesta** de cada petición que ingresa a la aplicación. Su única responsabilidad es ejecutar una secuencia de manejadores (`pipeline`) en un orden lógico y predefinido, implementando un **patrón de respuesta encadenada inmutable** para garantizar la integridad de la petición y la respuesta a través del pipeline.

## 2. Arquitectura y Lógica de Operación
El orquestador implementa una arquitectura de pipeline de élite, fundamental para la robustez en el Edge Runtime:

1.  **Pipeline Secuencial Inmutable:** El orquestador inicia con una `NextResponse` base. Cada manejador del pipeline recibe la `request` y la `response` del paso anterior. El manejador ejecuta su lógica y devuelve una `NextResponse` (ya sea la misma, una nueva de redirección/reescritura, o una versión modificada con cookies/headers). Esta respuesta se convierte en la entrada para el siguiente manejador. Este patrón garantiza un flujo de estado explícito, predecible y sin pérdida de datos.

2.  **Orden de Ejecución Estratégico:**
    1.  `handleRedirects`: Se ejecuta primero para redirigir `www` antes de cualquier otro procesamiento.
    2.  `handleMaintenance`: Se ejecuta segundo para bloquear el acceso si el sitio está en mantenimiento.
    3.  `handleI18n`: Determina el `locale` y lo añade a la cabecera `x-app-locale`.
    4.  `handleMultitenancy`: Lee el `host` y reescribe a la ruta del sitio público si es necesario.
    5.  `handleAuth`: Valida la sesión y protege las rutas. Depende de las cookies, que pueden ser actualizadas por Supabase.
    6.  `handleTelemetry`: Se ejecuta al final para registrar la visita, utilizando toda la información contextual recopilada.

3.  **Resiliencia Total:** El pipeline completo está envuelto en un `try/catch` global para capturar, registrar y devolver una respuesta de error controlada, previniendo el `MIDDLEWARE_INVOCATION_FAILED`.

4.  **Observabilidad de Rendimiento:** Utiliza un wrapper `withPerformanceLogging` para medir y registrar la latencia de cada manejador y del pipeline completo, permitiendo la identificación de cuellos de botella.

## 3. Zona de Mejoras Futuras
1.  **Factoría de Pipeline Declarativa:** Abstraer la lógica de encadenamiento a una función `createMiddlewarePipeline([...handlers])` para un código más declarativo y fácil de extender.
2.  **Configuración de `matcher` Dinámica:** Generar `config.matcher` dinámicamente a partir de un manifiesto de rutas para una SSoT de enrutamiento más centralizada.
3.  **Manejador de A/B Testing:** Añadir un manejador que lea cookies o headers para redirigir a variantes de una página para pruebas A/B.
4.  **Patrón de Circuit Breaker:** Implementar un "circuit breaker" para manejadores que dependen de servicios externos (ej. GeoIP), que se desactive temporalmente si el servicio falla repetidamente.
5.  **Internacionalización de la Documentación:** Traducir este documento espejo.
// .docs-espejo/middleware.ts.md