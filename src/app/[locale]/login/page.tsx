// src/app/[locale]/login/page.tsx
/**
 * @file page.tsx
 * @description Orquestador de UI para la página de inicio de sesión. Refactorizado
 *              a un estándar de élite para ser completamente autónomo en su consumo de i18n,
 *              proveyendo todas las props de texto requeridas a sus componentes hijos
 *              y resolviendo errores críticos de build en Vercel.
 * @author Raz Podestá - MetaShark Tech
 * @version 6.0.0
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
 * 1. ((Implementada)) Orquestador de UI Puro: Este componente ahora solo se encarga de la composición y la carga de datos de i18n, delegando la presentación a sus hijos.
 * 2. ((Implementada)) Soberanía de Namespace: Carga su propio namespace (`app.[locale].login.page`), eliminando dependencias cruzadas y resolviendo la causa raíz de los errores de i18n.
 * 3. ((Implementada)) Inyección de Dependencia Textual (IDT): Pasa el objeto `texts` al `LoginForm`, convirtiéndolo en un componente puro y reutilizable.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) El patrón de `AuthCardLayout` y `bottomLink` se repetirá en la página de registro. Se podría abstraer a un componente `AuthPageLayout` para un mayor cumplimiento del principio DRY.
 *
 * =====================================================================
 */
