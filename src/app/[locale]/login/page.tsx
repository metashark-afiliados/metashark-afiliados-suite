// src/app/[locale]/login/page.tsx
/**
 * @file page.tsx
 * @description Orquestador de UI para la página de inicio de sesión. Refactorizado
 *              a un estándar de élite para ser declarado explícitamente como
 *              dinámico, resolviendo el conflicto de renderizado estático en Vercel.
 * @author Raz Podestá - MetaShark Tech
 * @version 7.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

import {
  LoginForm,
  type LoginFormTexts,
} from "@/components/authentication/login-form";
import { AuthCardLayout } from "@/components/layout/AuthCardLayout";
import { SmartLink } from "@/components/ui/SmartLink";
import { clientLogger } from "@/lib/logging";

// --- INICIO DE CORRECCIÓN DE BUILD (VERCEL) ---
// Declara explícitamente que esta ruta debe ser renderizada dinámicamente.
// Esto resuelve el conflicto entre el `headers()` del layout y la generación estática.
export const dynamic = "force-dynamic";
// --- FIN DE CORRECCIÓN DE BUILD (VERCEL) ---

export default function LoginPage({
  params: { locale },
}: {
  params: { locale: string };
}): React.ReactElement {
  unstable_setRequestLocale(locale);
  clientLogger.trace("[LoginPage] Renderizando orquestador de UI.");
  const t = useTranslations("app.[locale].login.page");

  const bottomLink = t.rich("dontHaveAccount", {
    strong: (chunks) => (
      <SmartLink
        href="/signup"
        label={chunks}
        className="text-primary hover:underline"
      />
    ),
  });

  const loginFormTexts: LoginFormTexts = {
    email_label: t("email_label"),
    password_label: t("password_label"),
    forgot_password_link: t("forgot_password_link"),
    signInButton: t("signInButton"),
    signInButton_pending: t("signInButton_pending"),
    signInWith: t("signInWith"),
    signInWithProvider: t("signInWithProvider"),
    error_invalid_credentials: t("error_invalid_credentials"),
  };

  return (
    <AuthCardLayout bottomLink={bottomLink}>
      <LoginForm texts={loginFormTexts} />
    </AuthCardLayout>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Resolución de Error Crítico de Build**: Se ha añadido `export const dynamic = 'force-dynamic'`. Esta directiva instruye a Next.js a no intentar la generación estática de esta página, resolviendo la causa raíz del fallo de despliegue en Vercel.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) El patrón de `AuthCardLayout` y `bottomLink` se repetirá en la página de registro. Se podría abstraer a un componente `AuthPageLayout`.
 *
 * =====================================================================
 */
// src/app/[locale]/login/page.tsx
