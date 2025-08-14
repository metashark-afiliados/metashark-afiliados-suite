// src/lib/data/notifications.ts
/**
 * @file src/lib/data/notifications.ts
 * @description Aparato de datos para notificaciones e invitaciones. Ha sido nivelado
 *              para soportar Inyección de Dependencias, permitiendo su uso seguro
 *              dentro de funciones cacheadas.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
"use server";
import "server-only";

import { type SupabaseClient } from "@supabase/supabase-js";

import { logger } from "@/lib/logging";
import { createClient as createServerClient } from "@/lib/supabase/server";

type Database = import("@/lib/types/database").Database;
type Supabase = SupabaseClient<Database, "public">;

type RawInvitationData = {
  id: string;
  status: string;
  workspaces:
    | { name: string; icon: string | null }
    | { name: string; icon: string | null }[]
    | null;
};

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
    .select("id, status, workspaces (name, icon)")
    .eq("invitee_email", userEmail)
    .eq("status", "pending");

  if (error) {
    logger.error(
      `[DataLayer:Notifications] Error al obtener invitaciones para ${userEmail}:`,
      error
    );
    throw new Error("No se pudieron cargar las invitaciones.");
  }

  const pendingInvitations: Invitation[] =
    (data as RawInvitationData[])?.map((inv) => ({
      id: inv.id,
      status: inv.status,
      workspaces: Array.isArray(inv.workspaces)
        ? inv.workspaces[0] || null
        : inv.workspaces,
    })) || [];

  return pendingInvitations;
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Inyección de Dependencias**: ((Implementada)) La función ahora acepta un `supabaseClient` opcional, desacoplándola de la creación directa del cliente y permitiendo su uso en contextos cacheados.
 *
 * @subsection Melhorias Futuras
 * 1. **Reintroducción de Notificaciones Genéricas**: ((Vigente)) La lógica para consultar una tabla `notifications` genérica puede ser añadida en una nueva función.
 *
 * =====================================================================
 */
// src/lib/data/notifications.ts
