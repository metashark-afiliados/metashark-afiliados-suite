// src/lib/actions/workspaces.actions.ts
/**
 * @file src/lib/actions/workspaces.actions.ts
 * @description Aparato de acciones atómico. Su única responsabilidad es
 *              gestionar la entidad `workspaces` y el contexto de sesión activo
 *              del usuario. La lógica de invitaciones ha sido desacoplada a su
 *              propio módulo para una máxima cohesión.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, CreateWorkspaceSchema } from "@/lib/validators";

import { createAuditLog } from "./_helpers";

/**
 * @public
 * @async
 * @function setActiveWorkspaceAction
 * @description Establece el workspace activo para la sesión del usuario. Almacena
 *              el `workspaceId` en una cookie segura y de solo HTTP. Esta acción
 *              desencadena una revalidación completa del layout del dashboard para
 *              actualizar el contexto de la aplicación y finalmente redirige.
 * @param {string} workspaceId - El ID del workspace a activar.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la redirección es iniciada.
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
 *              Esta operación es atómica gracias a la invocación de la función RPC
 *              `create_workspace_with_owner`, que maneja la inserción en ambas
 *              tablas (`workspaces` y `workspace_members`) dentro de una única transacción.
 * @param {FormData} formData - Los datos del formulario que deben cumplir con `CreateWorkspaceSchema`.
 * @returns {Promise<ActionResult<{ id: string }>>} El resultado de la operación,
 *          conteniendo el ID del nuevo workspace si tiene éxito.
 */
export async function createWorkspaceAction(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.warn(
      "[WorkspacesAction] Intento no autorizado para crear workspace."
    );
    return { success: false, error: "No autenticado. Inicia sesión de nuevo." };
  }

  try {
    const { workspace_name, icon } = CreateWorkspaceSchema.parse(
      Object.fromEntries(formData.entries())
    );

    const { error, data } = await supabase.rpc("create_workspace_with_owner", {
      owner_user_id: user.id,
      new_workspace_name: workspace_name,
      new_workspace_icon: icon,
    });

    if (error || !data) {
      logger.error(
        `[WorkspacesAction] RPC falló al crear workspace para el usuario ${user.id}.`,
        { error }
      );
      return { success: false, error: "No se pudo crear el workspace." };
    }

    const newWorkspace = data[0];

    await createAuditLog("workspace_created", {
      userId: user.id,
      targetEntityId: newWorkspace.id,
      targetEntityType: "workspace",
      metadata: { workspaceName: workspace_name, icon },
    });

    revalidatePath("/dashboard", "layout");
    logger.info(
      `[WorkspacesAction] Workspace ${newWorkspace.id} creado con éxito para el usuario ${user.id}.`
    );
    return { success: true, data: { id: newWorkspace.id } };
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessage =
        error.flatten().fieldErrors.workspaceName?.[0] || "Datos inválidos.";
      logger.warn(
        `[WorkspacesAction] Datos inválidos para la creación de workspace por el usuario ${user.id}.`,
        { errors: error.flatten() }
      );
      return { success: false, error: errorMessage };
    }
    logger.error(
      `[WorkspacesAction] Error inesperado al crear workspace para el usuario ${user.id}.`,
      { error }
    );
    return { success: false, error: "Un error inesperado ocurrió." };
  }
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Lógica de Onboarding**: ((Implementada)) La reconstrucción de este aparato proporciona la lógica de servidor fundamental para el flujo de onboarding.
 * 2. **Cero Regresiones**: ((Implementada)) Se ha mantenido la lógica de RPC y la estructura de las acciones del snapshot original.
 *
 * @subsection Melhorias Futuras
 * 1. **Acción de Actualización**: ((Vigente)) Crear una `updateWorkspaceAction` para permitir a los usuarios editar sus workspaces.
 *
 * =====================================================================
 */
// src/lib/actions/workspaces.actions.ts
