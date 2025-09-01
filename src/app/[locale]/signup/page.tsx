// src/app/[locale]/signup/page.tsx
/**
 * @file page.tsx
 * @description Orquestador de UI soberano para la página de registro. Ensambla
 *              el layout y el formulario, actuando como una capa de adaptación
 *              entre la i18n y los componentes de presentación puros.
 * @author L.I.A. Legacy & RaZ WriTe (Arquitecto)
 * @version 2.0.0
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

  // --- Capa de Adaptación: i18n -> Props ---
  const bottomLink = t.rich("alreadyHaveAccount", {
    strong: (chunks) => (
      <SmartLink
        href="/login"
        label={chunks}
        className="font-bold text-primary hover:underline"
      />
    ),
  });

  const signupFormTexts: SignupFormProps["texts"] = {
    oauth: {
      signInWith: t("signInWith"),
      signInWithProvider: t("signInWithProvider"),
    },
  };

  // --- Capa de Ensamblaje de UI ---
  return (
    <AuthCardLayout bottomLink={bottomLink}>
      <SignupForm texts={signupFormTexts} />
    </AuthCardLayout>
  );
}
// src/app/[locale]/signup/page.tsx
