// src/app/[locale]/signup/page.tsx
/**
 * @file page.tsx
 * @description Página de registro. Refactorizada a un estándar de élite para ser
 *              completamente autónoma en su consumo de i18n, proveyendo
 *              todas las props de texto requeridas a sus componentes hijos.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useTranslations } from "next-intl";

import {
  SignupForm,
  type SignupFormProps,
} from "@/components/authentication/sign-up-form";
import { AuthCardLayout } from "@/components/layout/AuthCardLayout";
import { SmartLink } from "@/components/ui/SmartLink";
import { clientLogger } from "@/lib/logging";

export default function SignupPage(): React.ReactElement {
  clientLogger.trace("[SignupPage] Renderizando página de registro.");
  const t = useTranslations("app.[locale].signup.page");

  const bottomLink = t.rich("alreadyHaveAccount", {
    strong: (chunks) => (
      <SmartLink
        href="/login"
        label={chunks}
        className="text-primary hover:underline"
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) Resolución de `MISSING_MESSAGE` y `FORMATTING_ERROR`: Se ha eliminado la dependencia del namespace de `login`. El componente ahora es 100% autocontenido y provee las props de texto correctas a `SignupForm`, resolviendo los errores de Vercel.
 * 2. ((Implementada)) Autonomía de Módulo (Filosofía LEGO): El componente ahora cumple estrictamente con la arquitectura IMAS, mejorando la modularidad y mantenibilidad.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) El patrón de `AuthCardLayout` y `bottomLink` es similar entre `LoginPage` y `SignupPage`. Podría ser abstraído a un componente `AuthPageLayout` que reciba el `children` (el formulario) y las props para el enlace inferior.
 *
 * =====================================================================
 */
