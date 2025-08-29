// src/lib/actions/workspaces.actions.ts
/**
 * @file src/lib/actions/workspaces.actions.ts
 * @description Aparato de acciones atómico para la entidad `workspaces`.
 *              Ha sido refactorizado holísticamente para **centralizar TODOS los
 *              mensajes de feedback (éxito y error) en el namespace `shared.ValidationErrors`**,
 *              y para corregir errores de tipo en la propagación de errores y logging.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { requireWorkspacePermission } from "@/lib/auth/user-permissions";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import {
  type ActionResult,
  CreateWorkspaceSchema,
  DeleteWorkspaceSchema,
  UpdateWorkspaceNameSchema,
} from "@/lib/validators";

import {
  createAuditLog,
  createPersistentErrorLog,
  getAuthenticatedUser,
} from "./_helpers";

export async function setActiveWorkspaceAction(
  workspaceId: string
): Promise<void> {
  logger.trace(
    `[WorkspacesAction] Estableciendo workspace activo: ${workspaceId}`
  );
  cookies().set("active_workspace_id", workspaceId, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });
  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
}

export async function createWorkspaceAction(
  formData: FormData
): Promise<ActionResult<{ id: string; messageKey: string }>> {
  const authResult = await getAuthenticatedUser();
  if ("error" in authResult) return authResult.error;
  const { user } = authResult;

  const rawData = Object.fromEntries(formData);
  try {
    const { workspaceName } = CreateWorkspaceSchema.parse(rawData);

    const supabase = createClient();
    const { data: newWorkspace, error: creationError } = await supabase
      .from("workspaces")
      .insert({ name: workspaceName, owner_id: user.id })
      .select("id")
      .single();
    if (creationError) throw creationError;

    const { error: memberError } = await supabase
      .from("workspace_members")
      .insert({
        workspace_id: newWorkspace.id,
        user_id: user.id,
        role: "owner",
      });
    if (memberError) {
      await supabase.from("workspaces").delete().eq("id", newWorkspace.id);
      logger.error(
        `[WorkspacesAction] Rollback: Fallo al añadir miembro para el nuevo workspace ${newWorkspace.id}.`,
        memberError
      );
      throw memberError;
    }

    await createAuditLog("workspace_created", {
      userId: user.id,
      targetEntityId: newWorkspace.id,
      targetEntityType: "workspace",
      metadata: { workspaceName },
    });
    revalidatePath("/dashboard", "layout");
    return {
      success: true,
      data: {
        id: newWorkspace.id,
        messageKey: "ValidationErrors.workspaces.create_success",
      },
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    await createPersistentErrorLog("createWorkspaceAction", error as Error, {
      userId: user.id,
      payload: rawData,
    });
    return {
      success: false,
      error: "ValidationErrors.workspaces.create_failed",
    };
  }
}

export async function updateWorkspaceNameAction(
  workspaceId: string,
  newName: string
): Promise<ActionResult<{ messageKey: string }>> {
  const permissionCheck = await requireWorkspacePermission(workspaceId, [
    "owner",
    "admin",
  ]);
  if (!permissionCheck.success) return permissionCheck;

  const { user } = permissionCheck.data;

  try {
    const { name } = UpdateWorkspaceNameSchema.parse({ name: newName });
    const supabase = createClient();
    const { error } = await supabase
      .from("workspaces")
      .update({ name, updated_at: new Date().toISOString() })
      .eq("id", workspaceId);
    if (error) throw error;

    await createAuditLog("workspace.name_updated", {
      userId: user.id,
      targetEntityId: workspaceId,
      targetEntityType: "workspace",
      metadata: { newName: name },
    });
    revalidatePath("/dashboard", "layout");
    return {
      success: true,
      data: { messageKey: "ValidationErrors.workspaces.update_name_success" },
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    await createPersistentErrorLog(
      "updateWorkspaceNameAction",
      error as Error,
      { userId: user.id, workspaceId, newName }
    );
    return {
      success: false,
      error: "ValidationErrors.workspaces.update_name_failed",
    };
  }
}

export async function deleteWorkspaceAction(
  formData: FormData
): Promise<ActionResult<{ messageKey: string }>> {
  const rawData = Object.fromEntries(formData);
  try {
    const { workspaceId } = DeleteWorkspaceSchema.parse(rawData);
    const permissionCheck = await requireWorkspacePermission(workspaceId, [
      "owner",
    ]);
    if (!permissionCheck.success) return permissionCheck;

    const { user } = permissionCheck.data;

    const supabase = createClient();
    const { data: members, error: membersError } = await supabase
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", workspaceId);
    if (membersError) throw membersError;

    const ownerCount = members.filter((m) => m.role === "owner").length;
    if (members.length > 1 && ownerCount === 1) {
      return {
        success: false,
        error: "ValidationErrors.workspaces.delete_last_owner_cannot_delete",
      };
    }

    const { error } = await supabase
      .from("workspaces")
      .delete()
      .eq("id", workspaceId);
    if (error) throw error;

    await createAuditLog("workspace.deleted", {
      userId: user.id,
      targetEntityId: workspaceId,
      targetEntityType: "workspace",
    });
    const cookieStore = cookies();
    if (cookieStore.get("active_workspace_id")?.value === workspaceId) {
      cookieStore.delete("active_workspace_id");
    }
    revalidatePath("/dashboard", "layout");
    return {
      success: true,
      data: { messageKey: "ValidationErrors.workspaces.delete_success" },
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    const workspaceId = rawData.workspaceId as string | undefined;
    await createPersistentErrorLog("deleteWorkspaceAction", error as Error, {
      workspaceId,
      payload: rawData,
    });
    return {
      success: false,
      error: "ValidationErrors.workspaces.delete_failed",
    };
  }
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @section Melhorias Futuras
 * 1. ((Vigente)) **Migración a RPC para Creación:** La acción `createWorkspaceAction` realiza dos operaciones de escritura secuenciales. Para garantizar la atomicidad transaccional (o todo o nada), esta lógica debe ser migrada a una única función RPC en PostgreSQL.
 * 2. ((Vigente)) **Abstracción de Lógica de Permisos:** La lógica para verificar si un usuario es el último propietario (`deleteWorkspaceAction`) es una regla de negocio que debería ser abstraída a un helper en `lib/data/permissions.ts` (ej. `isLastWorkspaceOwner(userId, workspaceId)`).
 *
 * =====================================================================
 */
// src/lib/actions/workspaces.actions.ts
