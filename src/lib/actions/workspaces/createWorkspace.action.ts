// src/lib/actions/workspaces/createWorkspace.action.ts
/**
 * @file createWorkspace.action.ts
 * @description Server Action atómica para la creación de un nuevo workspace.
 *              Refactorizada a un estándar de élite para utilizar una RPC de
 *              PostgreSQL (`create_workspace_with_owner`), garantizando la
 *              atomicidad transaccional. Alineada con la SSoT de "Lean Database",
 *              errores soberanos y la Constitución de Observabilidad.
 * @author L.I.A. Legacy
 * @version 3.0.0
 * @see .docs/debt/001_LEAN_DB_ABSTRACTION_LEAK.md
 * @see .docs-espejo/lib/actions/workspaces/createWorkspace.action.ts.md
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import {
  createAuditLog,
  createPersistentErrorLog,
} from "@/lib/actions/_helpers";
import { getAuthUser } from "@/lib/auth/get-auth-user";
import { WORKSPACE_ROLES } from "@/config/roles.config";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import {
  type ActionResult,
  CreateWorkspaceSchema,
  type ValidationErrorKey,
} from "@/lib/validators";

export async function createWorkspaceAction(
  formData: FormData
): Promise<ActionResult<{ id: string; messageKey: ValidationErrorKey }>> {
  const user = await getAuthUser();
  if (!user) {
    return { success: false, error: "generic.error_unauthenticated" };
  }

  const rawData = Object.fromEntries(formData.entries());
  const context = { userId: user.id, payload: rawData };
  logger.trace(context, "[createWorkspaceAction] Iniciando acción.");

  try {
    const { workspaceName } = CreateWorkspaceSchema.parse(rawData);
    const supabase = createClient();

    // Invocación de la RPC transaccional
    const { data: newWorkspace, error: rpcError } = await supabase
      .rpc("create_workspace_with_owner", {
        p_owner_user_id: user.id,
        p_new_workspace_name: workspaceName,
        p_owner_role_id: WORKSPACE_ROLES.OWNER.id,
      })
      .select("id")
      .single();

    if (rpcError) throw rpcError;
    if (!newWorkspace)
      throw new Error("RPC did not return the new workspace ID");

    await createAuditLog("workspace.created", {
      userId: user.id,
      targetEntityId: newWorkspace.id,
      targetEntityType: "workspace",
      metadata: { workspaceName },
    });

    revalidatePath("/dashboard", "layout");

    logger.info(
      { ...context, workspaceId: newWorkspace.id },
      "[createWorkspaceAction] Workspace creado con éxito vía RPC."
    );

    return {
      success: true,
      data: {
        id: newWorkspace.id,
        messageKey: "workspaces.create_success",
      },
    };
  } catch (error) {
    let errorKey: ValidationErrorKey = "workspaces.create_failed";
    if (error instanceof ZodError) {
      errorKey = error.errors[0].message as ValidationErrorKey;
    }

    const errorId = await createPersistentErrorLog(
      "createWorkspaceAction",
      error as Error,
      context
    );
    logger.error(
      { err: error, errorId, ...context },
      "[createWorkspaceAction] Fallo en la acción."
    );

    return {
      success: false,
      error: errorKey,
    };
  }
}
// src/lib/actions/workspaces/createWorkspace.action.ts
