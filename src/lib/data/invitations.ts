// src/lib/data/invitations.ts
/**
 * @file src/lib/data/invitations.ts
 * @description Aparato de datos atómico para la entidad de invitaciones.
 *              Esta es la Única Fuente de Verdad para las operaciones de escritura
 *              relacionadas con la tabla `invitations` y sus RPCs asociadas.
 *              Refactorizado para alinearse con la arquitectura "Lean Database" y la
 *              Constitución de Observabilidad.
 * @author L.I.A Legacy
 * @version 3.0.0
 */
"use server";
import "server-only";

import { type SupabaseClient } from "@supabase/supabase-js";

import { logger } from "@/lib/logger";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { type Database, type TablesInsert } from "@/lib/types/database";

type Supabase = SupabaseClient<any, "public", any>;

/**
 * @public
 * @typedef {Omit<TablesInsert<"invitations">, "status">} CreateInvitationPayload
 * @description Contrato de datos para crear una nueva invitación. Opera con `role_id`.
 */
export type CreateInvitationPayload = Omit<
  TablesInsert<"invitations">,
  "status"
>;

/**
 * @public
 * @async
 * @function createInvitation
 * @description Inserta un nuevo registro de invitación en la base de datos.
 * @param {CreateInvitationPayload} payload - Los datos para la nueva invitación (con role_id).
 * @returns {Promise<{ success: boolean; error?: { code: string; message: string } }>}
 */
export async function createInvitation(
  payload: CreateInvitationPayload
): Promise<{ success: boolean; error?: { code: string; message: string } }> {
  const supabase = createServerClient();
  const invitationData: TablesInsert<"invitations"> = {
    ...payload,
    status: "pending",
  };

  logger.trace(
    { payload: invitationData },
    "[DataLayer:Invitations] Intentando crear invitación."
  );

  const { error } = await supabase.from("invitations").insert(invitationData);

  if (error) {
    logger.error(
      { err: error, payload: invitationData },
      "[DataLayer:Invitations] Error al crear invitación."
    );
    return {
      success: false,
      error: { code: error.code, message: error.message },
    };
  }

  logger.info(
    { invitee: payload.invitee_email, workspaceId: payload.workspace_id },
    "[DataLayer:Invitations] Invitación creada con éxito."
  );

  return { success: true };
}

/**
 * @public
 * @typedef {object} AcceptInvitationResult
 * @description Contrato de retorno para la operación de aceptar invitación.
 */
export type AcceptInvitationResult = {
  success: boolean;
  error?: string;
  message?: string;
  workspaceId?: string;
};

/**
 * @public
 * @async
 * @function acceptInvitation
 * @description Invoca la RPC segura para aceptar una invitación de workspace.
 * @param {string} invitationId - El ID de la invitación a ser aceptada.
 * @param {string} acceptingUserId - El ID del usuario que está aceptando.
 * @returns {Promise<AcceptInvitationResult>}
 */
export async function acceptInvitation(
  invitationId: string,
  acceptingUserId: string
): Promise<AcceptInvitationResult> {
  const supabase = createServerClient();
  const context = { invitationId, userId: acceptingUserId };

  logger.trace(
    context,
    "[DataLayer:Invitations] Intentando aceptar invitación."
  );

  const { data, error } = await supabase.rpc("accept_workspace_invitation", {
    p_invitation_id: invitationId,
    p_accepting_user_id: acceptingUserId,
  });

  if (error) {
    logger.error(
      { err: error, ...context },
      "[DataLayer:Invitations] RPC falló al aceptar invitación."
    );
    return { success: false, error: "generic.error_server_generic" };
  }

  const rpcResult = data as AcceptInvitationResult | null;

  if (rpcResult && !rpcResult.success) {
    logger.warn(
      { ...context, rpcError: rpcResult.error },
      "[DataLayer:Invitations] RPC devolvió un error de lógica de negocio."
    );
    return { success: false, error: rpcResult.error };
  }

  logger.info(context, "[DataLayer:Invitations] Invitación aceptada vía RPC.");

  return {
    success: true,
    message: rpcResult?.message,
    workspaceId: rpcResult?.workspaceId,
  };
}

/**
 * @public
 * @async
 * @function getInvitationByWorkspaceAndEmail
 * @description Verifica si ya existe una invitación o membresía para un email en un workspace.
 * @param {string} workspaceId - El ID del workspace a verificar.
 * @param {string} email - El email del invitado.
 * @returns {Promise<boolean>} `true` si ya existe, `false` en caso contrario.
 */
export async function getInvitationByWorkspaceAndEmail(
  workspaceId: string,
  email: string
): Promise<boolean> {
  const supabase = createServerClient();
  const { data: existingMember } = await supabase
    .from("workspace_members")
    .select("profiles!inner(email)")
    .eq("workspace_id", workspaceId)
    .eq("profiles.email", email)
    .maybeSingle();

  if (existingMember) {
    return true; // Ya es miembro
  }

  const { data: existingInvitation } = await supabase
    .from("invitations")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("invitee_email", email)
    .eq("status", "pending")
    .maybeSingle();

  return !!existingInvitation; // Ya está invitado
}
// src/lib/data/invitations.ts
