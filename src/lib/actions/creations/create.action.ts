// src/lib/actions/creations/create.action.ts
/**
@file create.action.ts
@description Server Action atómica para la creación de una nueva Creation.
Refactorizada para cumplir con el contrato de errores soberanos (AD-004),
observabilidad completa, y alineada con la SSoT de autenticación.
@author Raz Podesta - MetaShark Tech
@version 2.1.0
Florianópolis/SC, Brazil
*/
"use server";
import "server-only";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ZodError } from "zod";
import {
  createAuditLog,
  createPersistentErrorLog,
} from "@/lib/actions/_helpers";
import { getAuthenticatedUserOrThrow } from "@/lib/actions/_helpers/auth.helper";
import { generateCreationPayload } from "@/lib/builder/creation-payload.helper";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import {
  type ActionResult,
  CreateCreationSchema,
  type ValidationErrorKey,
} from "@/lib/validators";
/**
@public
@async
@function createCreationAction
@description Orquesta el flujo de creación de un nuevo diseño (Creation).
@param {unknown} prevState - El estado anterior, para useFormState.
@param {FormData} formData - Los datos del formulario.
@returns {Promise<ActionResult<{ id: string }>>} El resultado de la operación.
*/
export async function createCreationAction(
  prevState: unknown,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const user = await getAuthenticatedUserOrThrow();
  const rawData = Object.fromEntries(formData.entries());
  try {
    const workspaceId = cookies().get("active_workspace_id")?.value;
    if (!workspaceId) {
      logger.warn(
        { userId: user.id },
        "[CreateCreationAction] Intento de creación sin workspace activo."
      );
      return { success: false, error: "generic.error_no_active_workspace" };
    }
    const validation = CreateCreationSchema.safeParse(rawData);
    if (!validation.success) {
      throw validation.error;
    }
    const { name, type } = validation.data;

    const payload = generateCreationPayload({
      userId: user.id,
      workspaceId,
      name,
      type,
    });

    const supabase = createClient();
    const { data: newCreation, error } = await supabase
      .from("creations")
      .insert(payload)
      .select("id")
      .single();

    if (error) throw error;

    await createAuditLog("creation.created", {
      userId: user.id,
      targetEntityId: newCreation.id,
      metadata: { name, type, workspaceId },
    });

    revalidatePath("/dashboard");
    logger.info(
      { creationId: newCreation.id, userId: user.id },
      "[CreateCreationAction] 'Creation' creada con éxito."
    );
    return { success: true, data: { id: newCreation.id } };
  } catch (error) {
    let errorKey: ValidationErrorKey = "generic.error_creation_failed";
    if (error instanceof ZodError) {
      errorKey = "generic.error_invalid_data";
      logger.warn(
        { errors: error.flatten(), userId: user.id },
        "[CreateCreationAction] Validación de payload fallida."
      );
    }
    const errorId = await createPersistentErrorLog(
      "createCreationAction",
      error as Error,
      { userId: user.id, payload: rawData }
    );
    logger.error(
      { err: error, errorId },
      `[CreateCreationAction] Fallo al crear la 'creation'.`
    );

    return { success: false, error: errorKey };
  }
}
// src/lib/actions/creations/create.action.ts
