// src/middleware/lib/permissions-edge.ts
/**
 * @file src/middleware/lib/permissions-edge.ts
 * @description Aparato de lógica de sesión especializado para el Edge Runtime.
 *              Ha sido refactorizado holísticamente para consumir el cliente Supabase
 *              Edge-safe y para devolver tanto los datos de autenticación como el
 *              objeto `NextResponse` actualizado, garantizando un flujo de datos
 *              de sesión robusto y resolviendo el error de despliegue.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import "server-only";

import { type NextRequest, type NextResponse } from "next/server";
import { type User } from "@supabase/supabase-js";

import { createClient as createMiddlewareSupabaseClient } from "@/lib/supabase/middleware";
import { type Database } from "@/lib/types/database";

type AppRole = Database["public"]["Enums"]["app_role"];

export type UserAuthData = {
  user: User;
  appRole: AppRole;
  activeWorkspaceId: string | null;
};

/**
 * @public
 * @async
 * @function getAuthDataForMiddleware
 * @description Obtiene los datos de sesión y el objeto de respuesta actualizado.
 * @param {NextRequest} request - El objeto de la petición entrante.
 * @returns {Promise<{ authData: UserAuthData | null; response: NextResponse; }>}
 *          Un objeto que contiene el contexto de sesión y el objeto de respuesta.
 */
export async function getAuthDataForMiddleware(request: NextRequest): Promise<{
  authData: UserAuthData | null;
  response: NextResponse;
}> {
  const { supabase, response } = createMiddlewareSupabaseClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { authData: null, response };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("app_role")
    .eq("id", user.id)
    .single();

  const authData = {
    user,
    appRole: profile?.app_role || "user",
    activeWorkspaceId:
      request.cookies.get("active_workspace_id")?.value || null,
  };

  return { authData, response };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Futuras
 * 1. **Cacheo de Perfil en el Edge**: Para una optimización de élite, el `app_role` podría ser cacheado en Vercel KV con un TTL corto para reducir la latencia de las consultas a la base de datos desde el middleware.
 * 2. **Tipado de `User`**: Considerar extender el tipo `User` de Supabase para incluir `app_metadata.app_role` directamente, si la lógica del trigger `handle_new_user` se modifica para poblarlo, simplificando así la consulta en este módulo.
 * 3. **Manejo de Errores en `getUser`**: Envolver la llamada `supabase.auth.getUser()` en un bloque `try/catch` para registrar explícitamente cualquier error que ocurra durante el refresco de la sesión, lo que mejoraría la capacidad de diagnóstico de problemas de autenticación en el Edge.
 * =====================================================================
 */
