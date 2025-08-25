// src/lib/actions/creations/create.action.ts
/**
 * @file create.action.ts
 * @description Server Action atómica para la creación de una nueva `Creation`.
 *              Ha sido refactorizada a un estándar de élite para incluir un
 *              interruptor de "Modo Boilerplate" granular, que permite la
 *              depuración del flujo de UI sin invocar la lógica de base de datos
 *              o autenticación.
 * @author L.I.A. Legacy
 * @version 2.0.0 (Granular Boilerplate Mode)
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { createAuditLog, getAuthenticatedUser } from "@/lib/actions/_helpers";
import { generateCreationPayload } from "@/lib/builder/creation-payload.helper";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, CreateCreationSchema } from "@/lib/validators";
import { BOILERPLATE_CREATION_ID } from "@/lib/builder/boilerplate";

/**
 * @public
 * @async
 * @function createCreationAction
 * @description Orquesta el flujo de creación de un nuevo diseño (`Creation`).
 *              Si la variable de entorno `DEV_MODE_BOILERPLATE_CREATION` está
 *              activa, omite la lógica de base de datos y devuelve un ID estático.
 * @param {unknown} prevState - El estado anterior, para `useFormState`.
 * @param {FormData} formData - Los datos del formulario.
 * @returns {Promise<ActionResult<{ id: string }>>} El resultado de la operación.
 */
export async function createCreationAction(
  prevState: unknown,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  // --- INICIO DE INTERRUPTOR DE MODO BOILERPLATE ---
  if (process.env.DEV_MODE_BOILERPLATE_CREATION === "true") {
    logger.warn(
      "[CreateCreationAction] MODO BOILERPLATE ACTIVO. Omitiendo DB y devolviendo ID estático."
    );
    // Simula una pequeña latencia de red para probar los estados de carga de la UI.
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, data: { id: BOILERPLATE_CREATION_ID } };
  }
  // --- FIN DE INTERRUPTOR DE MODO BOILERPLATE ---

  const authResult = await getAuthenticatedUser();
  if ("error" in authResult) {
    return authResult.error;
  }
  const { user } = authResult;

  const workspaceId = cookies().get("active_workspace_id")?.value;
  if (!workspaceId) {
    logger.warn(
      `[CreateCreationAction] Intento de creación sin workspace activo.`,
      { userId: user.id }
    );
    return { success: false, error: "error_no_active_workspace" };
  }

  const rawData = {
    name: formData.get("name"),
    type: formData.get("type"),
  };

  const validation = CreateCreationSchema.safeParse(rawData);
  if (!validation.success) {
    return { success: false, error: "error_invalid_data" };
  }
  const { name, type } = validation.data;

  try {
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
    return { success: true, data: { id: newCreation.id } };
  } catch (error) {
    logger.error("[CreateCreationAction] Fallo al crear la 'creation'.", {
      error,
    });
    return { success: false, error: "error_creation_failed" };
  }
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Bypass Granular de Desarrollo**: ((Implementada)) La acción ahora contiene su propio interruptor de modo boilerplate, desacoplando su flujo de depuración de la lógica de autenticación global y resolviendo el problema de `error_unauthenticated` de una manera arquitectónicamente superior.
 * 2. **Simulación de Latencia**: ((Implementada)) Se ha añadido un retraso artificial en el modo boilerplate para permitir probar y visualizar los estados de carga en la UI de forma fiable.
 *
 * @subsection Melhorias Futuras
 * 1. **Payload Dinámico para Boilerplate**: ((Vigente)) La acción podría leer `formData` incluso en modo boilerplate para pasar el `name` y `type` al constructor, haciendo la experiencia de desarrollo aún más fiel a la de producción.
 *
 * =====================================================================
 */
// src/lib/actions/creations/create.action.ts
