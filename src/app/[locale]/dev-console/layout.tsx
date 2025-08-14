// src/app/[locale]/dev-console/layout.tsx
/**
 * @file layout.tsx
 * @description Layout principal para el Dashboard de Desarrollador. Ha sido refactorizado
 *              para implementar "type narrowing" en el manejo de errores del guardián
 *              de seguridad, resolviendo errores de compilación y adhiriéndose a las
 *              mejores prácticas de TypeScript.
 * @author Raz Podestá
 * @version 2.0.0
 */
import React from "react";
import { redirect } from "next/navigation";

import { requireAppRole } from "@/lib/auth/user-permissions";
import { logger } from "@/lib/logging";
import { DevSidebarClient } from "@/components/dev-console/DevSidebarClient";

export default async function DevConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  const roleCheck = await requireAppRole(["developer"]);

  if (!roleCheck.success) {
    // --- INICIO DE REFACTORIZACIÓN (TYPE NARROWING) ---
    // TypeScript ahora sabe que si `success` es `false`, el objeto solo tiene `error`.
    const { error, data } = roleCheck;

    switch (error) {
      case "SESSION_NOT_FOUND":
        logger.warn(
          `[DevConsoleLayout] Acceso denegado: Sesión no encontrada. Redirigiendo a /auth/login.`,
          { attemptedPath: "/dev-console" }
        );
        return redirect("/auth/login?next=/dev-console");
      case "PERMISSION_DENIED":
        // En este caso, `data` existe en el tipo `AuthResult` aunque `success` sea `false`,
        // pero TypeScript puede no inferirlo bien en uniones complejas. Un chequeo es más seguro.
        const userId = data?.user?.id || "unknown";
        const userRole = data?.appRole || "unknown";
        logger.warn(
          `[DevConsoleLayout] Acceso denegado: Permisos insuficientes (rol '${userRole}'). Redirigiendo a /dashboard.`,
          { userId, attemptedPath: "/dev-console" }
        );
        return redirect("/dashboard");
      default:
        logger.error(
          `[DevConsoleLayout] Error de autorización inesperado: ${error}`,
          { attemptedPath: "/dev-console" }
        );
        return redirect("/dashboard");
    }
    // --- FIN DE REFACTORIZACIÓN (TYPE NARROWING) ---
  }

  // Si `success` es `true`, TypeScript sabe que `roleCheck.data` existe.
  const { data: authData } = roleCheck;
  logger.info("[DevConsoleLayout] Acceso concedido a Dev Console.", {
    userId: authData.user.id,
  });

  return (
    <div className="flex min-h-screen bg-muted/40">
      <DevSidebarClient />
      <main className="flex-1 p-4 sm:p-6">{children}</main>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Seguridad de Tipos (Type Narrowing)**: ((Implementada)) La lógica de manejo de errores ahora comprueba `!roleCheck.success`, informando a TypeScript que el objeto es del tipo de error. Esto resuelve los errores `TS2339` de forma canónica.
 * 2. **Observabilidad Mejorada**: ((Implementada)) Los logs de `PERMISSION_DENIED` ahora incluyen el `userId` y `appRole` del infractor, proporcionando un contexto de seguridad invaluable para la auditoría.
 *
 * @subsection Melhorias Futuras
 * 1. **Página `/unauthorized`**: ((Vigente)) La redirección por `PERMISSION_DENIED` debería apuntar a una página `/unauthorized` para una UX superior.
 *
 * =====================================================================
 */
// src/app/[locale]/dev-console/layout.tsx
