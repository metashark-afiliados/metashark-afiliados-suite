// src/lib/actions/workspaces.actions.ts
/**
 * @file src/lib/actions/workspaces.actions.ts
 * @description Aparato de acciones atómico para la entidad `workspaces`.
 *              Ha sido nivelado a un estándar de élite con la implementación
 *              de la regla de negocio "Último Propietario", que previene la
 *              eliminación de workspaces que dejarían miembros huérfanos.
 * @author Raz Podestá
 * @version 2.3.0
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

import { createAuditLog, createPersistentErrorLog } from "./_helpers";

/**
 * @public
 * @async
 * @function setActiveWorkspaceAction
 * @description Establece el workspace activo para la sesión del usuario.
 * @param {string} workspaceId - El ID del workspace a activar.
 * @returns {Promise<void>}
 */
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
  });
  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
}

/**
 * @public
 * @async
 * @function createWorkspaceAction
 * @description Crea un nuevo workspace y asigna al usuario actual como propietario.
 * @param {FormData} formData - Los datos del formulario que deben cumplir con `CreateWorkspaceSchema`.
 * @returns {Promise<ActionResult<{ id: string }>>} El resultado de la operación.
 */
export async function createWorkspaceAction(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "error_unauthenticated" };
  }

  try {
    const { workspaceName } = CreateWorkspaceSchema.parse(
      Object.fromEntries(formData.entries())
    );

    // En un schema.sql futuro, esto sería una RPC 'create_workspace_with_owner'
    // para garantizar la atomicidad. Por ahora, se mantiene como una transacción lógica.
    const { data: newWorkspace, error: creationError } = await supabase
      .from("workspaces")
      .insert({ name: workspaceName, owner_id: user.id })
      .select("id")
      .single();

    if (creationError || !newWorkspace) {
      throw creationError || new Error("RPC simulada no devolvió datos.");
    }

    const { error: memberError } = await supabase
      .from("workspace_members")
      .insert({
        workspace_id: newWorkspace.id,
        user_id: user.id,
        role: "owner",
      });

    if (memberError) {
      // Rollback manual: eliminar el workspace si la inserción del miembro falla.
      await supabase.from("workspaces").delete().eq("id", newWorkspace.id);
      throw memberError;
    }

    await createAuditLog("workspace_created", {
      userId: user.id,
      targetEntityId: newWorkspace.id,
      targetEntityType: "workspace",
      metadata: { workspaceName },
    });

    revalidatePath("/dashboard", "layout");
    return { success: true, data: { id: newWorkspace.id } };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error:
          error.flatten().fieldErrors.workspaceName?.[0] ||
          "error_invalid_data",
      };
    }
    await createPersistentErrorLog(
      "createWorkspaceAction.unexpected",
      error as Error,
      { userId: user.id }
    );
    return { success: false, error: "error_creation_failed" };
  }
}

/**
 * @public
 * @async
 * @function updateWorkspaceNameAction
 * @description [Permiso: owner, admin] Actualiza el nombre de un workspace.
 * @param {string} workspaceId - El ID del workspace a actualizar.
 * @param {string} newName - El nuevo nombre para el workspace.
 * @returns {Promise<ActionResult<void>>} El resultado de la operación.
 */
export async function updateWorkspaceNameAction(
  workspaceId: string,
  newName: string
): Promise<ActionResult<void>> {
  const permissionCheck = await requireWorkspacePermission(workspaceId, [
    "owner",
    "admin",
  ]);
  if (!permissionCheck.success) {
    return { success: false, error: "error_permission_denied" };
  }
  const { user } = permissionCheck.data;

  try {
    const { name } = UpdateWorkspaceNameSchema.parse({ name: newName });

    const supabase = createClient();
    const { error } = await supabase
      .from("workspaces")
      .update({ name })
      .eq("id", workspaceId);

    if (error) {
      throw error;
    }

    await createAuditLog("workspace.name_updated", {
      userId: user.id,
      targetEntityId: workspaceId,
      targetEntityType: "workspace",
      metadata: { newName: name },
    });

    revalidatePath("/dashboard", "layout");
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: error.flatten().fieldErrors.name?.[0] || "error_invalid_data",
      };
    }
    await createPersistentErrorLog(
      "updateWorkspaceNameAction",
      error as Error,
      { userId: user.id, workspaceId }
    );
    return { success: false, error: "error_update_failed" };
  }
}

/**
 * @public
 * @async
 * @function deleteWorkspaceAction
 * @description [Permiso: owner] Elimina un workspace. Previene la eliminación
 *              si el usuario es el único propietario y existen otros miembros.
 * @param {FormData} formData - Datos que contienen el `workspaceId`.
 * @returns {Promise<ActionResult<void>>} El resultado de la operación.
 */
export async function deleteWorkspaceAction(
  formData: FormData
): Promise<ActionResult<void>> {
  let workspaceId: string | undefined;

  try {
    const parsedData = DeleteWorkspaceSchema.parse({
      workspaceId: formData.get("workspaceId"),
    });
    workspaceId = parsedData.workspaceId;

    const permissionCheck = await requireWorkspacePermission(workspaceId, [
      "owner",
    ]);
    if (!permissionCheck.success) {
      return { success: false, error: "error_permission_denied" };
    }
    const { user } = permissionCheck.data;

    const supabase = createClient();

    // --- INICIO DE LÓGICA DE PROTECCIÓN "ÚLTIMO PROPIETARIO" ---
    const { data: members, error: membersError } = await supabase
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", workspaceId);

    if (membersError) {
      throw new Error(
        "No se pudo verificar la membresía del workspace para la eliminación segura."
      );
    }

    const ownerCount = members.filter((m) => m.role === "owner").length;
    if (members.length > 1 && ownerCount === 1) {
      logger.warn(
        `[SEGURIDAD] Intento de eliminar workspace por último propietario bloqueado.`,
        { userId: user.id, workspaceId }
      );
      return { success: false, error: "error_last_owner_cannot_delete" };
    }
    // --- FIN DE LÓGICA DE PROTECCIÓN ---

    const { error } = await supabase
      .from("workspaces")
      .delete()
      .eq("id", workspaceId);

    if (error) {
      throw error;
    }

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
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: "error_invalid_data" };
    }

    await createPersistentErrorLog("deleteWorkspaceAction", error as Error, {
      workspaceId: workspaceId ?? "unknown",
    });
    return { success: false, error: "error_delete_failed" };
  }
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Protección de Integridad Lógica**: ((Implementada)) Se ha añadido la lógica de "Último Propietario" a `deleteWorkspaceAction`, previniendo la creación de workspaces huérfanos y fortaleciendo la integridad del sistema multi-tenant.
 * 2. **Observabilidad de Seguridad**: ((Implementada)) Se ha añadido un `logger.warn` específico para registrar los intentos de eliminación bloqueados, proporcionando una visibilidad clara sobre eventos de seguridad importantes.
 * 3. **Contrato de Error Extendido**: ((Implementada)) La acción ahora puede devolver un nuevo código de error (`error_last_owner_cannot_delete`), que debe ser añadido a los archivos de i18n y al schema correspondiente para una correcta visualización en la UI.
 *
 * @subsection Melhorias Futuras
 * 1. **Helper de Verificación Reutilizable**: ((Vigente)) La lógica de "Último Propietario" es un candidato perfecto para ser abstraída a un helper `isLastOwner(userId, workspaceId)` en `lib/data/permissions.ts`. Esto permitiría reutilizarla en futuras acciones como "abandonar workspace" o "cambiar propio rol".
 * 2. **Transacciones Atómicas (RPC)**: ((Vigente)) La acción `createWorkspaceAction` realiza dos operaciones de escritura. Debería ser migrada a una función RPC en PostgreSQL para garantizar que ambas operaciones (crear workspace y añadir miembro) se completen de forma atómica.
 *
 * =====================================================================
 */
// src/lib/actions/workspaces.actions.ts
