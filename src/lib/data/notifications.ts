// src/lib/data/notifications.ts
/**
 * @file src/lib/data/notifications.ts
 * @description Aparato de datos para notificaciones e invitaciones. Ha sido
 *              nivelado para soportar Inyección de Dependencias y corregido para
 *              seleccionar únicamente columnas existentes, resolviendo una
 *              regresión crítica y alineando el logging a la firma canónica.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 */
"use server";
import "server-only";

import { type SupabaseClient } from "@supabase/supabase-js";

import { logger } from "@/lib/logger";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { type Database } from "@/lib/types/database";

type Supabase = SupabaseClient<Database, "public">;

// Tipo interno para la data cruda de Supabase
type RawInvitationData = {
  id: string;
  status: string;
  workspaces: { name: string } | { name: string }[] | null;
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

  const { data, error } = await supabase
    .from("invitations")
    .select("id, status, workspaces (name)") // CORREGIDO: Se elimina la columna 'icon' inexistente
    .eq("invitee_email", userEmail)
    .eq("status", "pending");

  if (error) {
    logger.error(
      { err: error, userEmail },
      `[DataLayer:Notifications] Error al obtener invitaciones.`
    );
    throw new Error("No se pudieron cargar las invitaciones.");
  }

  const pendingInvitations: Invitation[] =
    (data as RawInvitationData[])?.map((inv) => {
      const workspaceData = Array.isArray(inv.workspaces)
        ? inv.workspaces[0] || null
        : inv.workspaces;

      // CAPA DE ADAPTACIÓN: Se añade 'icon: null' para cumplir el contrato de la UI
      return {
        id: inv.id,
        status: inv.status,
        workspaces: workspaceData
          ? {
              name: workspaceData.name,
              icon: null,
            }
          : null,
      };
    }) || [];

  return pendingInvitations;
}
// src/lib/data/notifications.ts
