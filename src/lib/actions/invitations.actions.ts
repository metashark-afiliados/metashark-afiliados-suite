// src/lib/actions/invitations.actions.ts
/**
 * @file src/lib/actions/invitations.actions.ts
 * @description Aparato de orquestación de acciones atómico para el ciclo de vida de
 *              invitaciones. Ha sido refactorizado holísticamente para **centralizar
 *              TODOS los mensajes de feedback (éxito y error) en el namespace
 *              `shared.ValidationErrors`**, y para corregir errores de tipo.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-29
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
import { type ActionResult, InvitationServerSchema } from "@/lib/validators";

import {
  createAuditLog,
  createPersistentErrorLog,
  getAuthenticatedUser,
} from "./_helpers";

export async function sendWorkspaceInvitationAction(
  formData: FormData
): Promise<
  ActionResult<{ messageKey: string; messageArgs?: Record<string, any> }>
> {
  const authResult = await getAuthenticatedUser();
  if ("error" in authResult) return authResult.error;
  const { user } = authResult;

  const rawData = Object.fromEntries(formData);

  try {
    const parsedData = InvitationServerSchema.parse(rawData);
    const { invitee_email, role, workspace_id } = parsedData;

    if (invitee_email === user.email) {
      return {
        success: false,
        error: "ValidationErrors.invitations.send_self_invite_forbidden",
      };
    }

    const permissionCheck = await requireWorkspacePermission(workspace_id, [
      "owner",
      "admin",
    ]);
    if (!permissionCheck.success) return permissionCheck;

    const result = await invitationsData.createInvitation({
      ...parsedData,
      invited_by: user.id,
    });

    if (!result.success) {
      if (result.error?.code === "23505") {
        return {
          success: false,
          error: "ValidationErrors.invitations.send_already_invited_or_member",
        };
      }
      logger.error("[InvitationsAction] DB error al crear invitación.", {
        ...result.error,
      });
      return {
        success: false,
        error: "ValidationErrors.invitations.send_failed",
      };
    }

    await createAuditLog("workspace_invitation_sent", {
      userId: user.id,
      targetEntityId: workspace_id,
      targetEntityType: "workspace",
      metadata: { invitedEmail: invitee_email, role },
    });

    revalidateTag(`invitations:${invitee_email}`);
    return {
      success: true,
      data: {
        messageKey: "ValidationErrors.invitations.send_success",
        messageArgs: { email: invitee_email },
      },
    };
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn("[InvitationsAction] Payload de invitación inválido.", {
        errors: error.flatten(),
      });
      return { success: false, error: error.errors[0].message };
    }
    await createPersistentErrorLog(
      "sendWorkspaceInvitationAction",
      error as Error,
      { userId: user.id, payload: rawData }
    );
    logger.error(`[InvitationsAction] Error inesperado.`, { error });
    return {
      success: false,
      error: "ValidationErrors.generic.error_server_generic",
    };
  }
}

export async function acceptInvitationAction(
  invitationId: string
): Promise<ActionResult<{ messageKey: string }>> {
  const authResult = await getAuthenticatedUser();
  if ("error" in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const result = await invitationsData.acceptInvitation(
      invitationId,
      user.id
    );
    if (!result.success) {
      logger.error("[InvitationsAction] RPC falló al aceptar invitación.", {
        invitationId,
        rpcError: result.error,
      });
      return {
        success: false,
        error:
          result.error ||
          "ValidationErrors.invitations.accept_processing_failed",
      };
    }

    await createAuditLog("workspace_invitation_accepted", {
      userId: user.id,
      targetEntityId: invitationId,
      targetEntityType: "invitation",
    });

    if (user.email) {
      revalidateTag(`invitations:${user.email}`);
    }
    revalidateTag(`workspaces:${user.id}`);
    revalidatePath("/dashboard", "layout");

    return {
      success: true,
      data: { messageKey: "ValidationErrors.invitations.accept_success" },
    };
  } catch (error) {
    await createPersistentErrorLog("acceptInvitationAction", error as Error, {
      userId: user.id,
      invitationId,
    });
    logger.error(`[InvitationsAction] Error inesperado.`, { error });
    return {
      success: false,
      error: "ValidationErrors.generic.error_server_generic",
    };
  }
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @section Melhorias Futuras
 * 1. ((Vigente)) **Revocar Invitación:** Implementar una `revokeInvitationAction(invitationId)` que permita a los administradores del workspace cancelar una invitación pendiente, cambiando su estado a 'revoked' y registrando la acción en el log de auditoría.
 * 2. ((Vigente)) **Reenviar Invitación:** Añadir una `resendInvitationAction(invitationId)` que vuelva a disparar la notificación por correo electrónico. Esta acción debe estar protegida por un `rate-limiter` para prevenir abuso.
 *
 * =====================================================================
 */
// src/lib/actions/invitations.actions.ts
