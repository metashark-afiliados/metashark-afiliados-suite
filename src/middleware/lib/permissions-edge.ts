// src/middleware/lib/permissions-edge.ts
/**
 * @file src/middleware/lib/permissions-edge.ts
 * @description Aparato de lógica de sesión especializado para el Edge Runtime.
 *              Ha sido refactorizado para consumir la SSoT canónica del cliente
 *              Supabase para middleware, resolviendo las advertencias de build
 *              sobre el uso de APIs de Node.js en el Edge.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
import "server-only";

import { type NextRequest, type NextResponse } from "next/server";
import { type User } from "@supabase/supabase-js";

// --- INICIO DE CORRECCIÓN ARQUITECTÓNICA ---
// Se importa el cliente correcto, diseñado explícitamente para el middleware,
// que maneja las cookies a través de request/response.
import { createClient as createMiddlewareSupabaseClient } from "@/lib/supabase/middleware";
// --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---
import { type Database } from "@/lib/types/database";

type AppRole = Database["public"]["Enums"]["app_role"];

export type UserAuthData = {
  user: User;
  appRole: AppRole;
  activeWorkspaceId: string | null;
};

export async function getAuthDataForMiddleware(
  request: NextRequest,
  response: NextResponse
): Promise<UserAuthData | null> {
  // --- INICIO DE CORRECCIÓN ARQUITECTÓNICA ---
  // Se utiliza la factoría de cliente correcta.
  const { supabase } = await createMiddlewareSupabaseClient(request, response);
  // --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---
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
 * 1. ((Implementada)) **Resolución de Advertencia de Build (Edge Runtime)**: Al cambiar la importación a `@/lib/supabase/middleware`, nos aseguramos de que el pipeline de middleware solo utilice código 100% compatible con el Edge Runtime, eliminando las advertencias y previniendo fallos en producción.
 * 2. ((Implementada)) **Consistencia Arquitectónica**: Este cambio refuerza la arquitectura de tener clientes Supabase especializados para cada entorno de ejecución (servidor, cliente, middleware), mejorando la robustez del sistema.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Cacheo de Perfil en el Edge**: Para una optimización de élite, el `app_role` podría ser cacheado en Vercel KV con un TTL corto para reducir la latencia de las consultas a la base de datos desde el middleware.
 *
 * =====================================================================
 */
// src/middleware/lib/permissions-edge.ts
