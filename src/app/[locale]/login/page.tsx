// src/app/[locale]/login/page.tsx
/**
 * @author Raz Podestá - MetaShark Tech
 * @version 8.0.0
 * @date 2025-08-30
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
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
import { clientLogger } from "@/lib/logging";

/**
 * @public
 * @page LoginPage
 * @description Orquesta la UI para la página de inicio de sesión.
 *              Es un Client Component que obtiene las traducciones necesarias y
 *              las inyecta en los componentes de presentación puros.
 * @returns {React.ReactElement}
 */
export default function LoginPage(): React.ReactElement {
  // La llamada a `unstable_setRequestLocale` fue eliminada porque es una
  // función de servidor y no puede ser usada en un Client Component.
  // El layout en `src/app/[locale]/layout.tsx` ya maneja esta lógica.
  clientLogger.trace("[LoginPage] Renderizando página de inicio de sesión.");
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
  };

  return (
    <AuthCardLayout bottomLink={bottomLink}>
      <LoginForm texts={loginFormTexts} />
    </AuthCardLayout>
  );
}
// src/app/[locale]/login/page.tsx
