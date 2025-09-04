// src/lib/actions/session/signOut.action.ts
/**
 * @file signOut.action.ts
 * @description Server Action atómica para el cierre de sesión del usuario.
 *              Refactorizada para alinearse con la firma de logging canónica
 *              y la Constitución de Observabilidad.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 2.0.0
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
 * @description Cierra la sesión del usuario actual. Audita el evento y redirige a la página de inicio.
 * @returns {Promise<void>} No devuelve ningún valor, ya que su efecto secundario principal es una redirección.
 */
export async function signOutAction(): Promise<void> {
  logger.trace({}, "[signOutAction] Iniciando flujo de cierre de sesión.");
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    await createAuditLog("user.sign_out", { userId: session.user.id });
    logger.info(
      { userId: session.user.id },
      "[signOutAction] Cierre de sesión auditado."
    );
  }

  await supabase.auth.signOut();
  logger.trace({}, "[signOutAction] Sesión invalidada. Redirigiendo a /.");
  redirect("/");
}
// src/lib/actions/session/signOut.action.ts
