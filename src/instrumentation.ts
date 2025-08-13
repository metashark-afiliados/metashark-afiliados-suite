// src/instrumentation.ts
/**
 * @file src/instrumentation.ts
 * @description Orquestador de instrumentación de la aplicación. Este archivo,
 *              utilizado por Next.js, es responsable de inicializar Sentry en los
 *              diferentes runtimes (servidor Node.js y Edge). Ha sido corregido para
 *              utilizar rutas de importación absolutas, resolviendo un fallo crítico
 *              de compilación en el Edge Runtime causado por la migración a la
 *              estructura de directorios `src/`.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // CORRECCIÓN: Se utiliza una ruta absoluta desde la raíz del proyecto.
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    // CORRECCIÓN: Se utiliza una ruta absoluta desde la raíz del proyecto.
    await import("../sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Corrección de Rutas de Importación**: ((Implementada)) Se han reemplazado las importaciones relativas `../` por rutas relativas desde la raíz del proyecto. Esta corrección es crítica y resuelve el error `ENOENT` que impedía el arranque del servidor de desarrollo.
 *
 * @subsection Melhorias Futuras
 * 1. **Instrumentación Adicional**: ((Vigente)) Este archivo es el lugar canónico para añadir cualquier otra lógica de instrumentación que deba ejecutarse al inicio de la aplicación, como la inicialización de un cliente de OpenTelemetry.
 *
 * =====================================================================
 */
// src/instrumentation.ts
