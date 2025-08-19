// src/middleware/lib/permissions-edge.ts
/**
 * @file src/middleware/lib/permissions-edge.ts
 * @description Aparato de lógica de sesión especializado y optimizado para el
 *              Edge Runtime. Ha sido refactorizado para consumir el nuevo
 *              cliente Supabase de Edge aislado, resolviendo una vulnerabilidad
 *              crítica de empaquetado de dependencias.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
import "server-only";

import { type NextRequest, type NextResponse } from "next/server";
import { type User } from "@supabase/supabase-js";

import { createEdgeClient } from "@/middleware/lib/supabase-edge.client"; // <-- DEPENDENCIA CORREGIDA
import { type Database } from "@/lib/types/database";

type AppRole = Database["public"]["Enums"]["app_role"];

/**
 * @public
 * @typedef UserAuthData
 * @description Define el contrato de datos para el contexto de sesión del usuario en el middleware.
 */
export type UserAuthData = {
  user: User;
  appRole: AppRole;
  activeWorkspaceId: string | null;
};

/**
 * @public
 * @async
 * @function getAuthDataForMiddleware
 * @description Obtiene los datos de sesión esenciales para el middleware.
 *              Esta implementación está optimizada y es segura para el Edge.
 * @param {NextRequest} request - El objeto de la petición entrante.
 * @param {NextResponse} response - El objeto de la respuesta, necesario para el cliente de Edge.
 * @returns {Promise<UserAuthData | null>} El contexto de sesión o `null`.
 */
export async function getAuthDataForMiddleware(
  request: NextRequest,
  response: NextResponse
): Promise<UserAuthData | null> {
  // --- CONSUMO DE CLIENTE AISLADO ---
  const supabase = createEdgeClient(request, response);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("app_role")
    .eq("id", user.id)
    .single();

  return {
    user,
    appRole: profile?.app_role || "user",
    activeWorkspaceId:
      request.cookies.get("active_workspace_id")?.value || null,
  };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Aislamiento de Runtime Completo**: ((Implementada)) Este aparato ahora reside en `src/middleware/lib` y consume el `createEdgeClient`, que está diseñado específicamente para el Edge. Esto rompe la cadena de importación que estaba introduciendo dependencias de Node.js en el middleware, resolviendo la causa raíz de la advertencia de Vercel.
 *
 * @subsection Melhorias Futuras
 * 1. **Cacheo en Edge**: ((Vigente)) Para optimizar aún más, los datos del perfil (que raramente cambian) podrían ser cacheados en Vercel KV con un TTL corto, reduciendo las llamadas a la base de datos.
 *
 * =====================================================================
 */
// src/middleware/lib/permissions-edge.ts
