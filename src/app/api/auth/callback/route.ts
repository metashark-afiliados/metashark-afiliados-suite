// src/app/api/auth/callback/route.ts
/**
 * @file src/app/api/auth/callback/route.ts
 * @description Route Handler para el callback de autenticación de Supabase.
 *              Este es el endpoint al que Supabase redirige al usuario después de un
 *              inicio de sesión exitoso o la confirmación de correo. Su única
 *              responsabilidad es intercambiar el código de autorización por una
 *              sesión y redirigir al usuario a la página apropiada.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { type NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // El parámetro 'next' puede ser usado para redirigir a una página específica después del login.
  const next = searchParams.get("next");

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const redirectTo = next ? `${origin}${next}` : `${origin}/dashboard`;
      logger.info(
        "[AuthCallback] Intercambio de código exitoso. Redirigiendo usuario.",
        { redirectTo }
      );
      return NextResponse.redirect(redirectTo);
    }
  }

  // Si hay un error o no hay código, redirigir a una página de error.
  logger.error(
    "[AuthCallback] Fallo en el intercambio de código o código ausente.",
    { code, next }
  );
  const redirectUrl = `${origin}/auth/login?error=true&message=Could not authenticate user. Please try again.`;
  return NextResponse.redirect(redirectUrl);
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Funcionalidad de Autenticación Completa**: ((Implementada)) Este aparato es la pieza de infraestructura faltante que resuelve el error 404 y completa el flujo de autenticación, permitiendo a los usuarios iniciar sesión.
 * 2. **Redirección Inteligente**: ((Implementada)) El handler respeta el parámetro de búsqueda `next`, permitiendo redirigir a los usuarios a la página que intentaban acceder antes de ser interrumpidos por el login.
 * 3. **Observabilidad Completa**: ((Implementada)) El flujo está instrumentado con logs de `info` y `error` para una trazabilidad completa del proceso de callback.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de URL de Redirección**: ((Vigente)) Para una seguridad de élite, la URL en el parámetro `next` debería ser validada contra una lista blanca de rutas permitidas para prevenir vulnerabilidades de "Open Redirect".
 * 2. **Mensajes de Error Internacionalizados**: ((Vigente)) El mensaje de error en la URL de redirección está codificado en duro. Debería ser una clave de i18n que la página de login pueda traducir.
 *
 * =====================================================================
 */
// src/app/api/auth/callback/route.ts
