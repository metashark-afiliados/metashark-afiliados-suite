// src/app/[locale]/signup/page.tsx
/**
 * @file page.tsx
 * @description Página de registro. Refactorizada a un orquestador de UI
 *              soberano que ensambla el layout y el formulario de registro,
 *              pasando los textos como props.
 * @author Raz Podestá - MetaShark Tech
 * @version 7.0.0
 * @date 2025-08-31
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

import {
  SignupForm,
  type SignupFormProps,
} from "@/components/authentication/sign-up-form";
import { AuthCardLayout } from "@/components/layout/AuthCardLayout";
import { SmartLink } from "@/components/ui/SmartLink";
import { clientLogger } from "@/lib/logging";

export default function SignupPage({
  params: { locale },
}: {
  params: { locale: string };
}): React.ReactElement {
  try {
    unstable_setRequestLocale(locale);
  } catch (error) {
    // Ignorar el error esperado en el cliente.
  }

  clientLogger.trace("[SignupPage] Renderizando página de registro.");
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

  const signupFormTexts: SignupFormProps["texts"] = {
    oauth: {
      signInWith: t("signInWith"),
      signInWithProvider: t("signInWithProvider"),
    },
  };

  return (
    <AuthCardLayout bottomLink={bottomLink}>
      <SignupForm texts={signupFormTexts} />
    </AuthCardLayout>
  );
}
// src/app/[locale]/signup/page.tsx
