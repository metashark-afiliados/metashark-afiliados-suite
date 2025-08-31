// src/app/[locale]/login/page.tsx
/**
 * @file page.tsx
 * @description Página de inicio de sesión. Refactorizada a un orquestador de UI
 *              soberano que ensambla el layout y el formulario de login.
 * @author Raz Podestá - MetaShark Tech
 * @version 9.0.0
 * @date 2025-08-31
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

export default function LoginPage({
  params: { locale },
}: {
  params: { locale: string };
}): React.ReactElement {
  // Nota: unstable_setRequestLocale es una no-op en Client Components,
  // pero se mantiene por coherencia con las convenciones de `next-intl`.
  try {
    unstable_setRequestLocale(locale);
  } catch (error) {
    // Ignorar el error esperado en el cliente.
  }

  clientLogger.trace("[LoginPage] Renderizando página de inicio de sesión.");
  const t = useTranslations("app.[locale].login.page");

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

  return (
    <AuthCardLayout bottomLink={bottomLink}>
      <LoginForm texts={loginFormTexts} />
    </AuthCardLayout>
  );
}
// src/app/[locale]/login/page.tsx
