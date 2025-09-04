// src/app/[locale]/signup/page.tsx
/**
 * @file page.tsx
 * @description Orquestador de UI soberano para la página de registro.
 *              Refactorizado para proveer el contrato de `props` de texto
 *              completo requerido por el componente `SignupForm`.
 * @author RaZ Podestá - MetaShark Tech
 * @version 2.1.0
 * @see .docs-espejo/app/[locale]/signup/page.tsx.md
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";

import {
  SignupForm,
  type SignupFormProps,
} from "@/components/authentication/sign-up-form";
import { AuthCardLayout } from "@/components/layout/AuthCardLayout";
import { SmartLink } from "@/components/ui/SmartLink";
import { clientLogger } from "@/lib/logger";

/**
 * @public
 * @page SignupPage
 * @description Orquesta y ensambla la UI de la página de registro.
 * @param {object} props - Propiedades de la página, incluyendo el locale.
 * @returns {React.ReactElement}
 */
export default function SignupPage({
  params: { locale },
}: {
  params: { locale: string };
}): React.ReactElement {
  clientLogger.trace(
    `[SignupPage] Renderizando orquestador de UI para locale: ${locale}`
  );
  const t = useTranslations("app.[locale].signup.page");

  const bottomLink = t.rich("alreadyHaveAccount", {
    strong: (chunks) => (
      <SmartLink
        href="/login"
        label={chunks}
        className="font-bold text-primary hover:underline"
      />
    ),
  });

  // --- INICIO DE REFACTORIZACIÓN (TS2739) ---
  // Se reconstruye el objeto `signupFormTexts` para que contenga todas las
  // propiedades requeridas por el contrato `SignupFormTexts`.
  const signupFormTexts: SignupFormProps["texts"] = {
    oauth: {
      signInWithProvider: t("signInWithProvider"),
    },
    signUpButton: t("signUpButton"),
    signUpButton_pending: t("signUpButton_pending"),
    fields: {
      email: {
        label: t("email_label"),
        placeholder: "m@example.com", // Placeholder genérico no depende de i18n
      },
      password: {
        label: t("password_label"),
      },
      confirmPassword: {
        label: t("confirm_password_label"),
      },
    },
  };
  // --- FIN DE REFACTORIZACIÓN (TS2739) ---

  return (
    <AuthCardLayout bottomLink={bottomLink}>
      <SignupForm texts={signupFormTexts} />
    </AuthCardLayout>
  );
}
// src/app/[locale]/signup/page.tsx
