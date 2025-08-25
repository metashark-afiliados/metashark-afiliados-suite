// src/app/[locale]/login/page.tsx
/**
 * @file page.tsx
 * @description Orquestador de UI para la página de inicio de sesión. Corregido
 *              para eliminar dependencias de i18n redundantes y alinear la
 *              llamada a `t.rich` con la SSoT.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.1.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useTranslations } from "next-intl";

import {
  LoginForm,
  type LoginFormTexts,
} from "@/components/authentication/login-form";
import { AuthCardLayout } from "@/components/layout/AuthCardLayout";
import { SmartLink } from "@/components/ui/SmartLink";

export default function LoginPage(): React.ReactElement {
  const t = useTranslations("app.[locale].login.page");

  const bottomLink = t.rich("alreadyHaveAccount", {
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
 * 1. **Resolución de Errores `MISSING_MESSAGE` y `FORMATTING_ERROR`**: ((Implementada)) Se ha eliminado la llamada a `useTranslations` para el namespace de `signup` y se ha corregido la clave en `t.rich`, resolviendo los errores de i18n.
 * 2. **Cohesión de i18n**: ((Implementada)) El componente ahora depende de un único namespace, adhiriéndose a la arquitectura IMAS.
 *
 * =====================================================================
 */
// src/app/[locale]/login/page.tsx
