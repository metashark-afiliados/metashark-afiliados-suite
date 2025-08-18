// src/lib/actions/invitations.actions.ts
/**
 * @file src/lib/actions/invitations.actions.ts
 * @description Aparato de orquestación de acciones atómico para el ciclo de vida de
 *              invitaciones. Contiene la lógica de negocio para enviar y aceptar
 *              invitaciones de workspace, validando permisos y datos, y auditando
 *              cada operación.
 * @author Raz Podestá
 * @version 1.1.0
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

import { createAuditLog } from "./_helpers";

export async function sendWorkspaceInvitationAction(
  formData: FormData
): Promise<ActionResult<{ message: string }>> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.warn(
      "[InvitationsAction] Intento no autorizado para enviar invitación."
    );
    return { success: false, error: "No autenticado." };
  }

  try {
    const parsedData = InvitationServerSchema.parse(
      Object.fromEntries(formData.entries())
    );
    const { invitee_email, role, workspace_id } = parsedData;

    if (invitee_email === user.email) {
      return { success: false, error: "No puedes invitarte a ti mismo." };
    }

    const permissionCheck = await requireWorkspacePermission(workspace_id, [
      "owner",
      "admin",
    ]);
    if (!permissionCheck.success) {
      return { success: false, error: permissionCheck.error };
    }

    const result = await invitationsData.createInvitation({
      ...parsedData,
      invited_by: user.id,
    });

    if (!result.success) {
      if (result.error?.code === "23505") {
        return {
          success: false,
          error: "Este usuario ya ha sido invitado o ya es miembro.",
        };
      }
      return { success: false, error: "No se pudo enviar la invitación." };
    }

    await createAuditLog("workspace_invitation_sent", {
      userId: user.id,
      targetEntityId: workspace_id,
      targetEntityType: "workspace",
      metadata: { invitedEmail: invitee_email, role },
    });

    revalidateTag(`invitations:${invitee_email}`);
    logger.info("[InvitationsAction] Invitación enviada con éxito.", {
      inviterId: user.id,
      inviteeEmail: invitee_email,
      workspaceId: workspace_id,
    });
    return {
      success: true,
      data: { message: `Invitación enviada a ${invitee_email}.` },
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: "Datos de invitación inválidos." };
    }
    logger.error("[InvitationsAction] Error inesperado al enviar invitación.", {
      error,
    });
    return { success: false, error: "Un error inesperado ocurrió." };
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
    return { success: false, error: "No autenticado." };
  }

  const result = await invitationsData.acceptInvitation(invitationId, user.id);

  if (!result.success) {
    return {
      success: false,
      error: result.error || "No se pudo aceptar la invitación.",
    };
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
      `[InvitationsAction] No se pudo revalidar la caché de invitaciones por email para el usuario ${user.id} porque el email no está disponible.`
    );
  }
  revalidateTag(`workspaces:${user.id}`);
  revalidatePath("/dashboard", "layout");

  logger.info("[InvitationsAction] Invitación aceptada con éxito.", {
    userId: user.id,
    invitationId,
  });
  return {
    success: true,
    data: {
      message: result.message || "Te has unido al workspace con éxito!",
    },
  };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Corrección de Dependencia de Datos**: ((Implementada)) La action ahora importa el módulo `invitations.ts` directamente, resolviendo el error de compilación y alineándose con la arquitectura de datos atómica.
 * 2. **Fluxo de Colaboração Completo**: ((Implementada)) Este aparato fornece a lógica de backend para o ciclo de vida completo de convites.
 * 3. **Segurança e Validação em Camadas**: ((Implementada)) A ação de envio valida permissões, dados de entrada e regras de negócio.
 * 4. **Revalidação de Cache Precisa**: ((Implementada)) As ações invalidam as tags de cache relevantes para uma UI consistente.
 *
 * @subsection Melhorias Futuras
 * 1. **Revocar Invitación**: ((Vigente)) Crear una `revokeInvitationAction(invitationId)` que permita a los administradores cancelar una invitación pendiente.
 * 2. **Reenviar Invitación**: ((Vigente)) Añadir una `resendInvitationAction(invitationId)` que vuelva a enviar el correo de invitación, con limitación de tasa.
 * 3. **Error I18n Keys**: ((Vigente)) En lugar de devolver strings de error codificados (ej. "No puedes invitarte a ti mismo."), devolver claves de internacionalización para que la UI pueda mostrar el mensaje traducido.
 *
 * =====================================================================
 */
// src/lib/actions/invitations.actions.ts
