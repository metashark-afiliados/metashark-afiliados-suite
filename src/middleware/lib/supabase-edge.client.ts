// src/middleware/lib/supabase-edge.client.ts
/**
 * @file src/middleware/lib/supabase-edge.client.ts
 * @description Aparato de utilidad atómico y aislado para crear un cliente Supabase
 *              para el Edge Runtime. Ha sido refactorizado a un estándar de élite
 *              para forzar un "Aislamiento de Runtime", eliminando por completo
 *              el código de producción que causa el error de build en Vercel.
 *              Esta versión está optimizada para despliegues en "Modo Simulado".
 * @author L.I.A. Legacy
 * @version 9.0.0
 */
import "server-only";

import { type NextRequest, type NextResponse } from "next/server";

import { createDevMockSupabaseClient } from "@/lib/supabase/mock-client-factory";
import { logger } from "@/lib/logging";
import { type Database } from "@/lib/types/database";

const isDevMode =
  process.env.NODE_ENV === "development" &&
  process.env.DEV_MODE_ENABLED === "true";

/**
 * @public
 * @function createEdgeClient
 * @description Factoría para crear una instancia del cliente de Supabase dentro del Middleware.
 *              En esta versión, solo devuelve el cliente simulado para garantizar un build
 *              exitoso en entornos de desarrollo/Vercel con DEV_MODE activado.
 * @param {NextRequest} request - El objeto de la petición entrante.
 * @returns {import('@supabase/supabase-js').SupabaseClient<Database>}
 */
export function createEdgeClient(request: NextRequest, response: NextResponse) {
  if (!isDevMode) {
    // En un entorno de producción real, esto lanzaría un error o implementaría
    // la lógica de importación dinámica. Para el objetivo actual, se detiene aquí.
    logger.error(
      "[SupabaseEdgeClient] Error Crítico: Intento de usar cliente de Edge en modo producción sin una implementación compatible."
    );
    throw new Error(
      "Implementación de cliente de Edge para producción no disponible."
    );
  }

  logger.warn(
    "🚧 [EDGE] Modo Desarrollador ACTIVO. Devolviendo cliente Supabase SIMULADO."
  );
  return createDevMockSupabaseClient(
    request.cookies
  ) as import("@supabase/supabase-js").SupabaseClient<Database>;
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Build en Edge**: ((Implementada)) Se ha eliminado por completo la rama de código que importaba `@supabase/ssr`. Esto fuerza al bundler de Vercel a ignorar las dependencias incompatibles, resolviendo la causa raíz del fallo de despliegue.
 * 2. **Estrategia de Despliegue Mínimo**: ((Implementada)) Esta versión del aparato cumple con el requisito de proporcionar lo mínimo necesario para un despliegue exitoso en modo simulado.
 *
 * @subsection Melhorias Futuras
 * 1. **Reintegración de Cliente Real**: ((Vigente)) Para el despliegue a producción, la lógica de importación dinámica de `@supabase/ssr` deberá ser restaurada y probada exhaustivamente, posiblemente esperando una versión de la librería que sea totalmente compatible con el Edge Runtime de Vercel.
 *
 * =====================================================================
 */
