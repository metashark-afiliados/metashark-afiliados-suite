// src/components/layout/dashboard.loader.ts
/**
 * @file dashboard.loader.ts
 * @description Aparato de carga de datos de élite para el layout del dashboard.
 *              Su única responsabilidad es obtener todos los datos iniciales
 *              necesarios para hidratar los contextos del lado del cliente.
 *              Implementa una lógica de reintento para mitigar condiciones de
 *              carrera durante el onboarding del usuario.
 * @author Raz Podestá & L.I.A. Legacy
 * @version 2.0.0
 */
"use server";

import { cookies } from "next/headers";
import { type User } from "@supabase/supabase-js";

import { createPersistentErrorLog } from "@/lib/actions/_helpers";
import {
  campaignsData,
  modules as modulesData,
  notifications,
  workspaces,
} from "@/lib/data";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type Enums, type Tables } from "@/lib/types/database";

/**
 * @public
 * @interface DashboardLayoutData
 * @description Define el contrato de datos completo que el `DashboardLayout`
 *              necesita para inicializar todos sus contextos y componentes hijos.
 *              Es la SSoT para el estado inicial de una sesión de usuario autenticada.
 */
export interface DashboardLayoutData {
  user: User;
  profile: Tables<"profiles">;
  workspaces: Tables<"workspaces">[];
  activeWorkspace: Tables<"workspaces"> | null;
  activeWorkspaceRole: Enums<"workspace_role"> | null;
  pendingInvitations: ReturnType<
    typeof notifications.getPendingInvitationsByEmail
  > extends Promise<infer T>
    ? T
    : never;
  modules: ReturnType<
    typeof modulesData.getFeatureModulesForUser
  > extends Promise<infer T>
    ? T
    : never;
  recentCampaigns: Tables<"campaigns">[];
}

/**
 * @private
 * @function delay
 * @description Helper simple que devuelve una promesa que resuelve después de un tiempo determinado.
 * @param {number} ms - El tiempo de espera en milisegundos.
 * @returns {Promise<void>}
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @public
 * @async
 * @function getLayoutData
 * @description Obtiene todos los datos necesarios para el layout del dashboard.
 *              Es resiliente a la condición de carrera del trigger de onboarding,
 *              reintentando la obtención del perfil de usuario hasta 3 veces.
 * @returns {Promise<DashboardLayoutData | null>} Los datos del layout o null si el usuario no está autenticado o su perfil no se puede encontrar.
 */
export async function getLayoutData(): Promise<DashboardLayoutData | null> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    let profile: Tables<"profiles"> | null = null;
    let attempts = 0;

    // Lógica de reintento para esperar la creación del perfil por el trigger de la BD.
    while (!profile && attempts < 3) {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (data) {
        profile = data;
        break;
      }
      attempts++;
      logger.trace(
        `[DashboardLayout] Intento ${attempts}: Perfil para ${user.id} aún no encontrado. Esperando 500ms...`
      );
      await delay(500);
    }

    if (!profile) {
      logger.error(
        `[DashboardLayout] INCONSISTENCIA: No se encontró perfil para ${user.id} después de 3 intentos.`
      );
      await supabase.auth.signOut();
      return null;
    }

    const [userWorkspaces, pendingInvitations, modules] = await Promise.all([
      workspaces.getWorkspacesByUserId(user.id, supabase),
      notifications.getPendingInvitationsByEmail(user.email!, supabase),
      modulesData.getFeatureModulesForUser(user, supabase),
    ]);

    const activeWorkspaceId = cookies().get("active_workspace_id")?.value;
    let activeWorkspace =
      userWorkspaces.find((ws) => ws.id === activeWorkspaceId) ||
      userWorkspaces[0] ||
      null;

    if (!activeWorkspace) {
      return {
        user,
        profile,
        modules,
        pendingInvitations,
        workspaces: [],
        activeWorkspace: null,
        activeWorkspaceRole: null,
        recentCampaigns: [],
      };
    }

    const { data: memberRole } = await supabase
      .from("workspace_members")
      .select("role")
      .eq("user_id", user.id)
      .eq("workspace_id", activeWorkspace.id)
      .single();

    const activeWorkspaceRole =
      (memberRole?.role as Enums<"workspace_role">) || null;

    const recentCampaigns =
      await campaignsData.management.getRecentCampaignsByWorkspaceId(
        activeWorkspace.id,
        4,
        supabase
      );

    return {
      user,
      profile,
      workspaces: userWorkspaces,
      activeWorkspace,
      activeWorkspaceRole,
      pendingInvitations,
      modules,
      recentCampaigns,
    };
  } catch (error) {
    logger.error(
      "[DashboardLayout:getLayoutData] Fallo crítico al obtener datos de layout.",
      error
    );
    await createPersistentErrorLog(
      "DashboardLayout:getLayoutData",
      error as Error
    );
    return null;
  }
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resiliencia ante Race Conditions**: ((Implementada)) La lógica de reintento con retardo previene fallos durante el primer login, dando tiempo al trigger de la base de datos para crear el perfil del usuario. Esto resuelve el error `INCONSISTENCIA: No se encontró perfil`.
 * 2. **Contrato de Datos Completo**: ((Implementada)) Se ha definido y exportado la interfaz `DashboardLayoutData`, resolviendo el error `TS2304` y estableciendo un contrato claro para el `DashboardLayout`.
 *
 * @subsection Melhorias Futuras
 * 1. **Webhooks para Sincronización**: ((Vigente)) En lugar de un mecanismo de sondeo/reintento, una solución de élite superior sería utilizar webhooks de Supabase. El trigger de onboarding podría invocar un webhook que invalide la caché del usuario o envíe un evento en tiempo real, indicando que el perfil está listo.
 *
 * =====================================================================
 */
// src/components/layout/dashboard.loader.ts
