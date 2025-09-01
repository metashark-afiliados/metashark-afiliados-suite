// src/lib/actions/workspaces/setActiveWorkspace.action.ts
/**
 * @file setActiveWorkspace.action.ts
 * @description Server Action atómica para cambiar el workspace activo del usuario.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 * @see .docs-espejo/lib/actions/workspaces/setActiveWorkspace.action.ts.md
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { logger } from "@/lib/logging";

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
// src/lib/actions/workspaces/setActiveWorkspace.action.ts
