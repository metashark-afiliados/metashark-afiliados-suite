// src/app/api/auth/callback/route.ts
/**
 * @file src/app/api/auth/callback/route.ts
 * @description Route Handler de élite para el callback de autenticación. Ha sido
 *              refactorizado para establecer la cookie `active_workspace_id`
 *              después del primer login, garantizando una redirección fluida
 *              y sin interrupciones al dashboard.
 * @author Raz Podestá
 * @version 4.0.0
 */
import { type NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";

/**
 * @private
 * @function isValidRedirect
 * @description Valida que una ruta de redirección sea segura (interna).
 * @param {string} path - La ruta a validar.
 * @returns {boolean} `true` si la ruta es segura.
 */
const isValidRedirect = (path: string): boolean => {
  return path.startsWith("/") && !path.startsWith("//") && !path.includes(":");
};

/**
 * @public
 * @async
 * @function GET
 * @description Maneja el callback de autenticación de Supabase. Intercambia el
 *              código por una sesión y, si es el primer login, establece el
 *              contexto del workspace activo.
 * @param {NextRequest} request - La petición entrante.
 * @returns {Promise<NextResponse>} Una redirección al dashboard o a una página de error.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  let redirectTo = new URL(`${origin}/dashboard`);
  if (next && isValidRedirect(next)) {
    redirectTo = new URL(`${origin}${next}`);
    logger.trace(`[AuthCallback] Redirección segura validada para: ${next}`);
  }

  if (code) {
    const supabase = createClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && session) {
      logger.info(
        "[AuthCallback] Intercambio de código exitoso. Sesión creada.",
        { userId: session.user.id }
      );

      // --- LÓGICA DE ÉLITE: ESTABLECER WORKSPACE ACTIVO EN PRIMER LOGIN ---
      const { data: firstWorkspace, error: workspaceError } = await supabase
        .from("workspaces")
        .select("id")
        .eq("owner_id", session.user.id)
        .limit(1)
        .single();

      if (workspaceError) {
        logger.error(
          `[AuthCallback] Error crítico: no se pudo obtener el workspace inicial para el usuario ${session.user.id}`,
          workspaceError
        );
        // Continuar a pesar del error para no bloquear al usuario.
      } else if (firstWorkspace) {
        logger.info(
          `[AuthCallback] Workspace inicial encontrado. Estableciendo cookie active_workspace_id.`,
          { workspaceId: firstWorkspace.id }
        );
        const response = NextResponse.redirect(redirectTo);
        response.cookies.set("active_workspace_id", firstWorkspace.id, {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
        });
        return response;
      }
      // --- FIN DE LÓGICA DE ÉLITE ---

      return NextResponse.redirect(redirectTo);
    }

    if (error) {
      logger.error("[AuthCallback] Error en exchangeCodeForSession.", {
        error: error.message,
      });
    }
  }

  const errorUrl = new URL(`${origin}/auth/login`);
  errorUrl.searchParams.set("error", "true");
  errorUrl.searchParams.set("message", "error_oauth_failed");
  return NextResponse.redirect(errorUrl);
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Flujo de Usuario Sin Fricciones**: ((Implementada)) La nueva lógica consulta y establece la cookie `active_workspace_id` en el primer inicio de sesión. Esto elimina la necesidad de una página intermedia y lleva al usuario directamente a un dashboard funcional.
 * 2. **Resiliencia**: ((Implementada)) El código maneja el caso en que la consulta del workspace falle, permitiendo que la redirección continúe para no bloquear al usuario.
 * 3. **Observabilidad Completa**: ((Implementada)) Se han añadido logs detallados para cada paso del proceso, incluyendo la creación de la cookie.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de `next` con Lista Blanca**: ((Vigente)) Para una seguridad máxima, la ruta `next` debería ser validada contra una lista blanca de rutas permitidas de la aplicación, en lugar de solo una validación de formato.
 *
 * =====================================================================
 */
