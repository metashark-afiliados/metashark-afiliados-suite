// src/lib/data/notifications.ts
/**
 * @file src/lib/data/notifications.ts
 * @description Aparato de datos para notificaciones e invitaciones. Ha sido
 *              nivelado para soportar Inyección de Dependencias y corregido para
 *              seleccionar únicamente columnas existentes, resolviendo una
 *              regresión crítica.
 * @author L.I.A. Legacy
 * @version 2.1.0
 */
"use server";
import "server-only";

import { type SupabaseClient } from "@supabase/supabase-js";

import { logger } from "@/lib/logging";
import { createClient as createServerClient } from "@/lib/supabase/server";

type Database = import("@/lib/types/database").Database;
type Supabase = SupabaseClient<Database, "public">;

// Tipo interno para la data cruda de Supabase
type RawInvitationData = {
  id: string;
  status: string;
  workspaces:
    | { name: string } // <-- CORRECCIÓN: Se elimina `icon`
    | { name: string }[]
    | null;
};

// Tipo público exportado con la estructura final
export type Invitation = {
  id: string;
  status: string;
  workspaces: { name: string; icon: string | null } | null;
};

/**
 * @public
 * @async
 * @function getPendingInvitationsByEmail
 * @description Obtiene y transforma todas las invitaciones pendientes para un email de usuario.
 * @param {string} userEmail - El email del usuario para buscar invitaciones.
 * @param {Supabase} [supabaseClient] - Instancia opcional del cliente de Supabase.
 * @returns {Promise<Invitation[]>}
 */
export async function getPendingInvitationsByEmail(
  userEmail: string,
  supabaseClient?: Supabase
): Promise<Invitation[]> {
  const supabase = supabaseClient || createServerClient();

  // --- INICIO DE CORRECCIÓN CRÍTICA ---
  // Se elimina la solicitud de la columna 'icon' que ya no existe en la tabla 'workspaces'.
  const { data, error } = await supabase
    .from("invitations")
    .select("id, status, workspaces (name)") // <-- CORRECCIÓN
    .eq("invitee_email", userEmail)
    .eq("status", "pending");
  // --- FIN DE CORRECCIÓN CRÍTICA ---

  if (error) {
    logger.error(
      `[DataLayer:Notifications] Error al obtener invitaciones para ${userEmail}:`,
      error
    );
    throw new Error("No se pudieron cargar las invitaciones.");
  }

  const pendingInvitations: Invitation[] =
    (data as RawInvitationData[])?.map((inv) => {
      const workspaceData = Array.isArray(inv.workspaces)
        ? inv.workspaces[0] || null
        : inv.workspaces;

      return {
        id: inv.id,
        status: inv.status,
        workspaces: workspaceData
          ? {
              name: workspaceData.name,
              icon: null, // Devolvemos null explícitamente para cumplir el contrato
            }
          : null,
      };
    }) || [];

  return pendingInvitations;
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Regresión Crítica**: ((Implementada)) Se ha eliminado la consulta a la columna `workspaces.icon`, resolviendo el error `42703` y restaurando la funcionalidad de carga del dashboard.
 * 2. **Integridad de Contrato de UI**: ((Implementada)) El `map` de transformación ahora añade explícitamente `icon: null` para asegurar que el objeto devuelto siempre cumpla con el tipo `Invitation` esperado por la UI, previniendo errores de `undefined`.
 *
 * @subsection Melhorias Futuras
 * 1. **Reintroducción de Iconos de Workspace**: ((Vigente)) La columna `icon` fue eliminada de la tabla `workspaces`. El plan arquitectónico para reintroducirla debe ser definido. Podría ser un campo de texto para un emoji o una URL a un asset. Una vez reintroducida, esta consulta podrá ser actualizada.
 *
 * =====================================================================
 */
// src/lib/data/notifications.ts
