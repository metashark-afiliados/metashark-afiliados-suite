// src/middleware/lib/permissions-edge.ts
/**
 * @file src/middleware/lib/permissions-edge.ts
 * @description Aparato de lógica de sesión especializado para el Edge Runtime.
 *              Ha sido refactorizado a síncrono para alinearse con la nueva
 *              factoría de cliente simulado.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
import "server-only";

import { type NextRequest, type NextResponse } from "next/server";
import { type User } from "@supabase/supabase-js";

import { createEdgeClient } from "@/middleware/lib/supabase-edge.client";
import { type Database } from "@/lib/types/database";

type AppRole = Database["public"]["Enums"]["app_role"];

export type UserAuthData = {
  user: User;
  appRole: AppRole;
  activeWorkspaceId: string | null;
};

/**
 * @public
 * @function getAuthDataForMiddleware
 * @description Obtiene los datos de sesión esenciales para el middleware.
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
 * 1. **Sincronización de Flujo**: ((Implementada)) Se ha eliminado el `await` innecesario, aunque la función se mantiene `async` para compatibilidad con la capa superior (`handleAuth`) que la espera. La lógica es ahora consistente con la naturaleza síncrona de la factoría de mocks.
 *
 * =====================================================================
 */
