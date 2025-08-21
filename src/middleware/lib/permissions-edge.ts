// src/middleware/lib/permissions-edge.ts
/**
 * @file src/middleware/lib/permissions-edge.ts
 * @description Aparato de lógica de sesión especializado para el Edge Runtime.
 *              Ha sido corregido para utilizar `await` al invocar la factoría
 *              asíncrona `createEdgeClient`, resolviendo una regresión y el
 *              error de tipo crítico (`TS2339`) que impedía el build.
 * @author L.I.A. Legacy
 * @version 2.2.0
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
 * @param {NextResponse} response - El objeto de la respuesta, necesario para el cliente de Edge.
 * @returns {Promise<UserAuthData | null>} El contexto de sesión o `null`.
 */
export async function getAuthDataForMiddleware(
  request: NextRequest,
  response: NextResponse
): Promise<UserAuthData | null> {
  // --- INICIO DE CORRECCIÓN: SINCRONIZACIÓN ASÍNCRONA ---
  const supabase = await createEdgeClient(request, response);
  // --- FIN DE CORRECCIÓN ---
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
 * 1. **Resolución de Regresión Crítica (TS2339)**: ((Implementada)) Se ha reintroducido `await` en la llamada `createEdgeClient`. Esto resuelve el error de compilación al asegurar que el código espere la resolución de la promesa antes de intentar acceder a las propiedades del cliente Supabase.
 *
 * =====================================================================
 */
