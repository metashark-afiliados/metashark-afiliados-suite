// src/app/[locale]/login/page.tsx
/**
 * @file page.tsx
 * @description Orquestador de UI soberano para la página de inicio de sesión.
 *              Ensambla el layout y el formulario, actuando como una capa de
 *              adaptación entre la i18n y los componentes de presentación puros.
 * @author L.I.A. Legacy & RaZ WriTe (Arquitecto)
 * @version 2.0.0
 * @see .docs-espejo/app/[locale]/login/page.tsx.md
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";

import {
  LoginForm,
  type LoginFormTexts,
} from "@/components/authentication/login-form";
import { AuthCardLayout } from "@/components/layout/AuthCardLayout";
import { SmartLink } from "@/components/ui/SmartLink";
import { clientLogger } from "@/lib/logger";

/**
 * @public
 * @page LoginPage
 * @description Orquesta y ensambla la UI de la página de inicio de sesión.
 * @param {object} props - Propiedades de la página, incluyendo el locale.
 * @returns {React.ReactElement}
 */
export default function LoginPage({
  params: { locale },
}: {
  params: { locale: string };
}): React.ReactElement {
  clientLogger.trace(
    `[LoginPage] Renderizando orquestador de UI para locale: ${locale}`
  );
  const t = useTranslations("app.[locale].login.page");

  // --- Capa de Adaptación: i18n -> Props ---
  const bottomLink = t.rich("dontHaveAccount", {
    strong: (chunks) => (
      <SmartLink
        href="/signup"
        label={chunks}
        className="font-bold text-primary hover:underline"
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
  };

  // --- Capa de Ensamblaje de UI ---
  return (
    <AuthCardLayout bottomLink={bottomLink}>
      <LoginForm texts={loginFormTexts} />
    </AuthCardLayout>
  );
}
// src/app/[locale]/login/page.tsx
