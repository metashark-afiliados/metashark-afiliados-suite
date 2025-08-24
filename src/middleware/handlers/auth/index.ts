// src/middleware/handlers/auth/index.ts
/**
 * @file src/middleware/handlers/auth/index.ts
 * @description Motor de reglas de autorización de élite para el middleware.
 *              ¡ADVERTENCIA! Esta versión ha sido modificada temporalmente para
 *              deshabilitar TODA la lógica de autenticación y autorización,
 *              permitiendo el acceso público a todas las rutas para depuración.
 * @author L.I.A. Legacy
 * @version 2.2.0 (Temporarily Bypassed)
 */
import { type NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/logging";
// Las siguientes importaciones se mantienen para facilitar la restauración.
// import {
//   getAuthDataForMiddleware,
//   type UserAuthData,
// } from "@/middleware/lib/permissions-edge";
// import {
//   ROUTE_MANIFEST,
//   type RouteSecurityRule,
// } from "@/middleware/lib/routing-manifest-edge";

export async function handleAuth(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  logger.trace("==> [AUTH_HANDLER] START <==", { path: pathname });

  // --- INICIO DE MODIFICACIÓN DE SEGURIDAD ---
  // Toda la lógica de autenticación y autorización ha sido temporalmente
  // comentada y reemplazada por un bypass directo.

  logger.warn(
    "[AUTH_HANDLER] ADVERTENCIA: La lógica de autenticación está temporalmente deshabilitada."
  );
  logger.trace("[AUTH_HANDLER] DECISION: PASS (Bypass de seguridad activo).");

  return response; // Pasa directamente al siguiente manejador sin chequeos.
  // --- FIN DE MODIFICACIÓN DE SEGURIDAD ---
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Bypass de Depuración**: ((Implementada)) La lógica de seguridad ha sido temporalmente deshabilitada según la directiva, permitiendo una navegación sin restricciones para facilitar la depuración de la UI.
 *
 * @subsection Melhorias Futuras
 * 1. **Variable de Entorno para Bypass**: ((Vigente)) Una estrategia de élite a largo plazo sería añadir una variable de entorno `BYPASS_AUTH_MIDDLEWARE=true`. El `Auth Handler` leería esta variable y, si es verdadera, se saltaría todos los chequeos, evitando la necesidad de modificar el código fuente.
 *
 * =====================================================================
 */
// src/middleware/handlers/auth/index.ts
