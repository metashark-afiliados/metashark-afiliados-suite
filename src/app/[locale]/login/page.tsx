// src/app/[locale]/login/page.tsx
/**
 * @file page.tsx
 * @description Orquestador de UI para la página de inicio de sesión. Refactorizado
 *              para ser completamente autónomo en su consumo de i18n, eliminando
 *              dependencias cruzadas y resolviendo errores críticos de build en Vercel.
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
import { clientLogger } from "@/lib/logging";

export default function LoginPage(): React.ReactElement {
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
 * 1. **Resolución de `MISSING_MESSAGE` y `FORMATTING_ERROR`**: ((Implementada)) Se ha corregido la llamada a `useTranslations` para que apunte al namespace canónico y completo. Se ha eliminado la dependencia cruzada con el namespace de `signup`, resolviendo los errores de build de Vercel.
 * 2. **Autonomía de Módulo (Filosofía LEGO)**: ((Implementada)) El componente ahora depende exclusivamente de su propio namespace de i18n (`app.[locale].login.page`), adhiriéndose estrictamente a la arquitectura IMAS y convirtiéndose en una pieza de LEGO 100% autocontenida.
 *
 * @subsection Melhorias Futuras
 * 1. **Componente de Formulario Puro**: ((Vigente)) Para una pureza de élite, el componente `LoginForm` podría ser refactorizado para recibir todos sus textos de error como props, en lugar de que el `useEffect` interno mapee claves de error. Esto lo haría completamente agnóstico a la capa de i18n.
 *
 * =====================================================================
 */