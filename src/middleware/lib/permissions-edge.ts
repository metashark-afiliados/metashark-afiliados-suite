// src/middleware/lib/permissions-edge.ts
/**
 * @file src/middleware/lib/permissions-edge.ts
 * @description Aparato de lógica de sesión especializado y optimizado para el
 *              Edge Runtime. Esta es la Única Fuente de Verdad para obtener
 *              el contexto de autenticación del usuario dentro del middleware.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
import "server-only";

import { type NextRequest, type NextResponse } from "next/server";
import { type User } from "@supabase/supabase-js";

import { createEdgeClient } from "@/middleware/lib/supabase-edge.client";
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
 * @param {NextResponse} response - El objeto de la respuesta.
 * @returns {Promise<UserAuthData | null>} El contexto de sesión o `null`.
 */
export async function getAuthDataForMiddleware(
  request: NextRequest,
  response: NextResponse
): Promise<UserAuthData | null> {
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
 * 1. **Aislamiento de Runtime**: ((Implementada)) El aparato ahora reside en `src/middleware/lib` y consume el cliente Supabase específico del Edge.
 * 2. **Sincronización de Dependencias**: ((Implementada)) La lógica ha sido actualizada para consumir `createEdgeClient`, completando la cadena de dependencias para el Edge.
 *
 * @subsection Melhorias Futuras
 * 1. **Cacheo en Edge**: ((Vigente)) Para optimizar aún más, los datos del perfil (que raramente cambian) podrían ser cacheados en Vercel KV con un TTL corto, reduciendo las llamadas a la base de datos.
 *
 */
// src/middleware/lib/permissions-edge.ts
