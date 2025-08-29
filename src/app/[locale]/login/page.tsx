/**
 * @author Raz Podestá - MetaShark Tech
 * @version 7.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

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
 * @param {object} props - Propiedades de la página, incluyendo el `locale`.
 * @returns {React.ReactElement}
 */
export default function LoginPage({
  params: { locale },
}: {
  params: { locale: string };
}): React.ReactElement {
  unstable_setRequestLocale(locale);
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Abstracción a `AuthPageLayout`**: ((Vigente)) El patrón de `AuthCardLayout` y `bottomLink` es similar entre `LoginPage` y `SignupPage`. Podría ser abstraído a un componente `AuthPageLayout` para una máxima adhesión al principio DRY.
 *
 * =====================================================================
 */
