// src/app/[locale]/dev-console/layout.tsx
/**
 * @file layout.tsx
 * @description Layout principal para el Dev Console. Refactorizado a un estándar de
 *              élite, alineando todas las llamadas al logger con la firma canónica
 *              de la Constitución para resolver los errores de tipo TS2345.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
import { redirect } from "next/navigation";
import React from "react";

import { DevSidebarClient } from "@/components/dev-console/DevSidebarClient";
import { requireAppRole } from "@/lib/auth/user-permissions";
import { logger } from "@/lib/logger";

export default async function DevConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  const roleCheck = await requireAppRole(["developer"]);

  if (!roleCheck.success) {
    const { error, data } = roleCheck;
    const attemptedPath = "/dev-console";

    switch (error) {
      case "SESSION_NOT_FOUND":
        logger.warn(
          { attemptedPath },
          "[DevConsoleLayout] Acceso denegado: Sesión no encontrada."
        );
        return redirect(`/login?next=${attemptedPath}`);

      case "PERMISSION_DENIED":
        const userId = data?.user?.id || "unknown";
        const userRole = data?.appRole || "unknown";
        logger.warn(
          { userId, userRole, requiredRoles: ["developer"], attemptedPath },
          "[DevConsoleLayout] Acceso denegado: Permisos insuficientes."
        );
        return redirect("/dashboard");

      default:
        logger.error(
          { error, attemptedPath },
          "[DevConsoleLayout] Error de autorización inesperado."
        );
        return redirect("/dashboard");
    }
  }

  const { data: authData } = roleCheck;
  logger.info(
    { userId: authData.user.id },
    "[DevConsoleLayout] Acceso concedido a Dev Console."
  );

  return (
    <div className="flex min-h-screen bg-muted/40">
      <DevSidebarClient />
      <main
        id="main-content-scroller"
        className="flex-1 p-4 sm:p-6 overflow-y-auto"
      >
        {children}
      </main>
    </div>
  );
}
// src/app/[locale]/dev-console/layout.tsx
