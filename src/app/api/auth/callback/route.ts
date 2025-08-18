// src/app/api/auth/callback/route.ts
/**
 * @file src/app/api/auth/callback/route.ts
 * @description Route Handler para el callback de autenticación. Ha sido
 *              refactorizado a un estándar de élite para manejar tanto el flujo
 *              de producción real como el flujo simulado del modo de desarrollo,
 *              estableciendo la cookie de sesión correcta en cada caso y resolviendo
 *              el bloqueo de autenticación.
 * @author Raz Podestá
 * @version 2.0.0
 */
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";

const isDevMode =
  process.env.NODE_ENV === "development" &&
  process.env.DEV_MODE_ENABLED === "true";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const redirectTo = next ? `${origin}${next}` : `${origin}/dashboard`;

  // --- INICIO DE REFACTORIZACIÓN (MANEJO DE MODO DESARROLLO) ---
  if (isDevMode && code === "dev-mock-code") {
    logger.info(
      "[AuthCallback:DevMock] Código simulado recibido. Estableciendo sesión de desarrollo."
    );
    cookies().set("dev_session", "true", {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });
    return NextResponse.redirect(redirectTo);
  }
  // --- FIN DE REFACTORIZACIÓN ---

  // --- LÓGICA DE PRODUCCIÓN ---
  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      logger.info(
        "[AuthCallback] Intercambio de código exitoso. Redirigiendo usuario.",
        { redirectTo }
      );
      return NextResponse.redirect(redirectTo);
    }
    logger.error("[AuthCallback] Error en exchangeCodeForSession.", {
      error: error.message,
    });
  } else {
    logger.warn(
      "[AuthCallback] Petición a callback sin código de autorización."
    );
  }

  // Si hay un error en producción o no hay código, redirigir a una página de error.
  const redirectUrl = `${origin}/auth/login?error=true&message=Could not authenticate user. Please try again.`;
  return NextResponse.redirect(redirectUrl);
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Flujo de Autenticación Simulado Completo**: ((Implementada)) Este aparato ahora maneja el código simulado (`dev-mock-code`), establece la cookie de sesión de desarrollo y redirige al dashboard. Esto completa el ciclo de autenticación en el entorno de desarrollo.
 * 2. **Cero Regresiones**: ((Implementada)) La lógica original de producción se ha preservado completamente, asegurando que el flujo real no se vea afectado.
 * 3. **Observabilidad Contextual**: ((Implementada)) Se han añadido logs específicos para el modo de desarrollo, mejorando la capacidad de diagnóstico.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de URL de Redirección**: ((Vigente)) Para una seguridad de élite, la URL en el parámetro `next` debería ser validada contra una lista blanca de rutas permitidas para prevenir vulnerabilidades de "Open Redirect".
 * 2. **Mensajes de Error Internacionalizados**: ((Vigente)) El mensaje de error en la URL de redirección está codificado. Debería ser una clave de i18n que la página de login pueda traducir.
 *
 * =====================================================================
 */
// src/app/api/auth/callback/route.ts
