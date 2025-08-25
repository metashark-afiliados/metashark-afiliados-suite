// src/app/[locale]/login/page.tsx
/**
 * @file page.tsx
 * @description Orquestador de UI para la página de inicio de sesión. Refactorizado
 *              para ser completamente autónomo en su consumo de i18n, eliminando
 *              dependencias cruzadas y resolviendo errores de Vercel.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
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
 * 1. **Resolución de `MISSING_MESSAGE` y `FORMATTING_ERROR`**: ((Implementada)) Se ha eliminado la llamada a `useTranslations` del namespace de `signup` y se ha corregido la clave en `t.rich` a `dontHaveAccount`, resolviendo los errores de Vercel.
 * 2. **Autonomía de Módulo (LEGO)**: ((Implementada)) El componente ahora depende exclusivamente de su propio namespace, adhiriéndose estrictamente a la arquitectura IMAS y convirtiéndose en una pieza de LEGO autocontenida.
 *
 * @subsection Melhorias Futuras
 * 1. **Componente de Formulario Puro**: ((Vigente)) Para una pureza de élite, el componente `LoginForm` aún podría ser refactorizado para recibir todos sus textos de error como props, en lugar de que el `useEffect` interno mapee claves de error.
 *
 * =====================================================================
 */
// src/app/[locale]/login/page.tsx
