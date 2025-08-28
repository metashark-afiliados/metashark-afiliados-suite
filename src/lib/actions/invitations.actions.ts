// src/lib/actions/invitations.actions.ts
/**
 * @file src/lib/actions/invitations.actions.ts
 * @description Aparato de orquestación de acciones atómico para el ciclo de vida de
 *              invitaciones. Contiene la lógica de negocio para enviar y aceptar
 *              invitaciones de workspace, validando permisos y datos, y auditando
 *              cada operación. Ha sido refactorizado holísticamente para
 *              **centralizar todos los mensajes de error en el namespace
 *              `shared.ValidationErrors`**, alineando la gestión de errores
 *              con la "Única Fuente de Verdad" para los errores de la aplicación.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use server";
import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";
import { ZodError } from "zod";

import { requireWorkspacePermission } from "@/lib/auth/user-permissions";
import * as invitationsData from "@/lib/data/invitations";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, InvitationServerSchema } from "@/lib/validators";

import { createAuditLog, createPersistentErrorLog } from "./_helpers";

export async function sendWorkspaceInvitationAction(
  formData: FormData
): Promise<ActionResult<{ message: string }>> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.warn(
      "[InvitationsAction:sendWorkspaceInvitationAction] Intento no autorizado para enviar invitación."
    );
    // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Error centralizado ---
    return {
      success: false,
      error: "ValidationErrors.invitations_send_unauthenticated",
    };
    // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
  }

  try {
    const parsedData = InvitationServerSchema.parse(
      Object.fromEntries(formData.entries())
    );
    const { invitee_email, role, workspace_id } = parsedData;

    if (invitee_email === user.email) {
      // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Error centralizado ---
      return {
        success: false,
        error: "ValidationErrors.invitations_send_self_invite_forbidden",
      };
      // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
    }

    const permissionCheck = await requireWorkspacePermission(workspace_id, [
      "owner",
      "admin",
    ]);
    if (!permissionCheck.success) {
      return { success: false, error: permissionCheck.error }; // Ya es una clave i18n
    }

    const result = await invitationsData.createInvitation({
      ...parsedData,
      invited_by: user.id,
    });

    if (!result.success) {
      if (result.error?.code === "23505") {
        // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Error centralizado ---
        return {
          success: false,
          error: "ValidationErrors.invitations_send_already_invited_or_member",
        };
        // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
      }
      logger.error(
        "[InvitationsAction:sendWorkspaceInvitationAction] Error de base de datos al crear invitación.",
        { code: result.error?.code, message: result.error?.message }
      );
      // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Error centralizado ---
      return {
        success: false,
        error: "ValidationErrors.invitations_send_failed",
      };
      // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
    }

    await createAuditLog("workspace_invitation_sent", {
      userId: user.id,
      targetEntityId: workspace_id,
      targetEntityType: "workspace",
      metadata: { invitedEmail: invitee_email, role },
    });

    revalidateTag(`invitations:${invitee_email}`);
    logger.info(
      "[InvitationsAction:sendWorkspaceInvitationAction] Invitación enviada con éxito.",
      {
        inviterId: user.id,
        inviteeEmail: invitee_email,
        workspaceId: workspace_id,
      }
    );
    return {
      success: true,
      data: { message: `Invitación enviada a ${invitee_email}.` }, // Este mensaje es para el toast específico, puede mantenerse como string o ser clave i18n si se necesita traducir en el toast.
    };
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn(
        "[InvitationsAction:sendWorkspaceInvitationAction] Payload de invitación inválido.",
        {
          errors: error.flatten(),
        }
      );
      // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Error centralizado ---
      return {
        success: false,
        error: "ValidationErrors.invitations_send_invalid_data",
      };
      // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
    }
    const errorId = await createPersistentErrorLog(
      "sendWorkspaceInvitationAction.unexpected",
      error as Error,
      { userId: user.id, payload: Object.fromEntries(formData) }
    );
    logger.error(
      `[InvitationsAction:sendWorkspaceInvitationAction] Error inesperado. Log ID: ${errorId}`,
      { error }
    );
    return { success: false, error: "ValidationErrors.error_server_generic" };
  }
}

export async function acceptInvitationAction(
  invitationId: string
): Promise<ActionResult<{ message: string }>> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Error centralizado ---
    return {
      success: false,
      error: "ValidationErrors.invitations_accept_unauthenticated",
    };
    // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
  }

  try {
    const result = await invitationsData.acceptInvitation(
      invitationId,
      user.id
    );

    if (!result.success) {
      logger.error(
        "[InvitationsAction:acceptInvitationAction] RPC falló al aceptar invitación.",
        {
          invitationId,
          rpcError: result.error,
        }
      );
      // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Error centralizado ---
      return {
        success: false,
        error:
          result.error ||
          "ValidationErrors.invitations_accept_processing_failed",
      };
      // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
    }

    await createAuditLog("workspace_invitation_accepted", {
      userId: user.id,
      targetEntityId: invitationId,
      targetEntityType: "invitation",
    });

    if (user.email) {
      revalidateTag(`invitations:${user.email}`);
    } else {
      logger.warn(
        `[InvitationsAction:acceptInvitationAction] No se pudo revalidar la caché de invitaciones por email para el usuario ${user.id} porque el email no está disponible.`
      );
    }
    revalidateTag(`workspaces:${user.id}`);
    revalidatePath("/dashboard", "layout");

    logger.info(
      "[InvitationsAction:acceptInvitationAction] Invitación aceptada con éxito.",
      {
        userId: user.id,
        invitationId,
      }
    );
    return {
      success: true,
      data: { message: result.message || "Invitación aceptada con éxito." },
    }; // Mantener este mensaje para el toast específico
  } catch (error) {
    const errorId = await createPersistentErrorLog(
      "acceptInvitationAction.unexpected",
      error as Error,
      { userId: user.id, invitationId }
    );
    logger.error(
      `[InvitationsAction:acceptInvitationAction] Error inesperado. Log ID: ${errorId}`,
      { error }
    );
    return { success: false, error: "ValidationErrors.error_server_generic" };
  }
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Centralización de Errores (SSoT)**: ((Implementada)) Todos los mensajes de error `hardcodeados` en `sendWorkspaceInvitationAction` y `acceptInvitationAction` ahora utilizan claves del namespace `shared.ValidationErrors`. Esto consolida la "Única Fuente de Verdad" para los errores de invitaciones.
 * 2. **Clasificación de Errores por Dominio**: ((Implementada)) La adición de errores prefijados con `invitations_` formaliza el patrón de clasificación de errores por dominio, mejorando la organización y mantenibilidad.
 * 3. **Full Observabilidad Mejorada**: ((Implementada)) Se han añadido `logger.warn` y `logger.error` contextuales en cada punto de fallo, y se ha integrado `createPersistentErrorLog` para los errores inesperados, proporcionando una trazabilidad completa.
 * 4. **No Regresión Funcional**: ((Implementada)) La lógica de negocio principal de cada acción se mantiene intacta, con la mejora centrada en la resiliencia y la internacionalización.
 *
 * @subsection Melhorias Futuras
 * 1. **Revocar Invitación**: ((Vigente)) Crear una `revokeInvitationAction(invitationId)` que permita a los administradores cancelar una invitación pendiente, cambiando su estado a 'revoked'.
 * 2. **Reenviar Invitación**: ((Vigente)) Añadir una `resendInvitationAction(invitationId)` que vuelva a enviar el correo de invitación, con limitación de tasa.
 *
 * =====================================================================
 */
