// src/app/[locale]/login/page.tsx
/**
 * @file page.tsx
 * @description Orquestador de UI para la página de inicio de sesión. Su única
 *              responsabilidad es obtener todas las traducciones necesarias y
 *              pasarlas como props a sus componentes hijos puros.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
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

/**
 * @public
 * @page LoginPage
 * @description Ensambla el `AuthCardLayout` y el `LoginForm` para construir la
 *              vista de inicio de sesión completa.
 * @returns {React.ReactElement}
 */
export default function LoginPage(): React.ReactElement {
  const t = useTranslations("app.[locale].login.page");
  const tSignUp = useTranslations("app.[locale].signup.page");

  const bottomLink = tSignUp.rich("dontHaveAccount", {
    signup: (chunks) => (
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
 * 1. **Resolución de Error de Compilación (TS2741)**: ((Implementada)) El componente ahora construye el objeto `loginFormTexts` y lo pasa como prop a `LoginForm`, cumpliendo con el nuevo contrato de API y resolviendo el error de compilación.
 * 2. **Arquitectura de Orquestador Puro**: ((Implementada)) Este componente ahora actúa como un orquestador de i18n puro, adhiriéndose a la "Filosofía LEGO".
 *
 * @subsection Melhorias Futuras
 * 1. **Consolidación Final de i18n**: ((Vigente)) La dependencia de `useTranslations("app.[locale].signup.page")` debe ser eliminada una vez que la clave `dontHaveAccount` sea migrada a `login/page.json`, completando la consolidación de la SSoT.
 *
 * =====================================================================
 */
// src/app/[locale]/login/page.tsx
