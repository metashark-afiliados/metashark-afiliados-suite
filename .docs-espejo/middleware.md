// .docs-espejo/middleware.ts.md
/**
 * @file .docs-espejo/middleware.ts.md
 * @description Documento Espejo y SSoT conceptual para el orquestador de Middleware.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
# Manifiesto Conceptual: Orquestador de Middleware

## 1. Rol Estratégico y Propósito

Este aparato (`middleware.ts`) es el **Guardián de Entrada** de la aplicación. Su única responsabilidad (PRU) es orquestar la ejecución secuencial de un **pipeline de manejadores de middleware atómicos**. Actúa como la primera línea de defensa y de procesamiento para cada petición entrante.

Estratégicamente, este orquestador implementa una **arquitectura de pipeline declarativa y resiliente** que:
*   **Garantiza un Orden de Ejecución Predecible:** Define el orden exacto en que se procesan las responsabilidades (redirecciones, i18n, autenticación, etc.).
*   **Mejora la Mantenibilidad y Escalabilidad:** Permite añadir, eliminar o reordenar manejadores modificando una única línea en el array del pipeline, sin alterar la lógica de orquestación.
*   **Proporciona Observabilidad de Élite:** Envuelve cada manejador en logging de rendimiento y aislamiento de errores, y todo el pipeline en un `correlationId` para una trazabilidad completa.

## 2. Arquitectura y Flujo de Ejecución

La arquitectura se basa en la factoría `createMiddlewarePipeline` que consume un array de manejadores.

```mermaid
sequenceDiagram
    participant Next.js as Next.js Server
    participant Orquestador as middleware.ts
    participant CorrelationId as withCorrelationId
    participant PipelineFactory as createMiddlewarePipeline
    participant Handler1 as handleI18n
    participant Handler2 as handleAuth
    participant Logger as logger

    Next.js->>Orquestador: `middleware(request)`
    Orquestador->>CorrelationId: `withCorrelationId(() => ...)`
    CorrelationId->>PipelineFactory: `createMiddlewarePipeline(request, [handlers])`
    PipelineFactory->>Handler1: `await handleI18n(req, res)`
    Handler1-->>PipelineFactory: Retorna `newResponse`
    PipelineFactory->>Logger: Loguea rendimiento de Handler1
    PipelineFactory->>Handler2: `await handleAuth(req, newResponse)`
    Handler2-->>PipelineFactory: Retorna `finalResponse`
    PipelineFactory->>Logger: Loguea rendimiento de Handler2
    PipelineFactory-->>CorrelationId: Retorna `finalResponse`
    CorrelationId-->>Orquestador: Retorna `finalResponse`
    Orquestador-->>Next.js: Retorna `finalResponse`

    alt Error en Handler
        Handler1-->>PipelineFactory: Lanza Excepción
        PipelineFactory->>Logger: `logger.error({err})`
        PipelineFactory->>PipelineFactory: Continúa con el siguiente handler
    end
3. Contrato de API
Exportaciones Principales
middleware(request): Promise<NextResponse>: La función de middleware principal.
config: El objeto de configuración del matcher.
4. Zona de Melhorias Futuras
Configuración de matcher Dinámica: Generar config.matcher dinámicamente a partir de un manifiesto de rutas para una SSoT de enrutamiento más centralizada.
Manejador de A/B Testing: Añadir un manejador que lea cookies o headers para reescribir a variantes de una página para pruebas A/B.
Patrón de Circuit Breaker: Implementar un "circuit breaker" para el manejador de GeoIP, que se desactive temporalmente si el servicio falla repetidamente.
Internacionalización de la Documentación: Traducir este documento espejo a los otros idiomas soportados por el proyecto.
Manejo de Errores Mejorado: El catch global podría renderizar una página de error más informativa extrayendo el errorId y pasándolo como searchParam.
Logging Condicional por Entorno: Permitir un nivel de log más verboso para el middleware en entornos de preview o development a través de una variable de entorno.
Soporte para Múltiples Pipelines: La factoría podría ser extendida para crear diferentes pipelines basados en la ruta de la petición.
Contexto de Petición Tipado: Crear una interfaz MiddlewareRequestContext que se propague a través de los manejadores.
Manejo de Errores No Críticos: Permitir que un manejador falle de forma "suave" sin registrar un error, simplemente pasando al siguiente.
Optimización de matcher Adicional: Explorar el uso de has en el matcher de Next.js 14 para una coincidencia de rutas aún más precisa.
// .docs-espejo/middleware.ts.md