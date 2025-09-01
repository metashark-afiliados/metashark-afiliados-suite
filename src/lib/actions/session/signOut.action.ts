// src/lib/actions/session/signOut.action.ts
/**
 * @file signOut.action.ts
 * @description Server Action atómica para el cierre de sesión del usuario.
 * @author L.I.A. Legacy & RaZ WriTe (Arquitecto)
 * @version 1.0.0
 * @see .docs-espejo/lib/actions/session/signOut.action.ts.md
 */
"use server";
import "server-only";

import { redirect } from "next/navigation";

import { createAuditLog } from "@/lib/actions/_helpers";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

/**
 * @public
 * @async
 * @function signOutAction
 * @description Cierra la sesión del usuario actual. Si existe una sesión activa,
 *              registra el evento en la auditoría para una trazabilidad completa.
 *              Finalmente, redirige al usuario a la página de inicio.
 * @returns {Promise<void>} No devuelve ningún valor, ya que su efecto secundario
 *          principal es una redirección.
 */
export async function signOutAction(): Promise<void> {
  logger.trace("[SignOutAction] Iniciando flujo de cierre de sesión.");
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    await createAuditLog("user_sign_out", { userId: session.user.id });
    logger.info(
      `[SignOutAction] Cierre de sesión auditado para usuario: ${session.user.id}`
    );
  }

  await supabase.auth.signOut();
  logger.trace(
    "[SignOutAction] Sesión invalidada en Supabase. Redirigiendo a /."
  );
  return redirect("/");
}
// src/lib/actions/session/signOut.action.ts
