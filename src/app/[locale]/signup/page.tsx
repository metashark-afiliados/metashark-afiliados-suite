// src/app/[locale]/signup/page.tsx
/**
 * @file page.tsx
 * @description Página de registro. Refactorizada a un Componente de Cliente
 *              para resolver el conflicto de renderizado dinámico.
 * @author Raz Podestá
 * @version 4.0.0
 */
"use client"; // <-- DIRECTIVA CRÍTICA

import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

import { SignupForm } from "@/components/authentication/sign-up-form";
import { AuthCardLayout } from "@/components/layout/AuthCardLayout";
import { SmartLink } from "@/components/ui/SmartLink";

export default function SignupPage({
  params: { locale },
}: {
  params: { locale: string };
}): React.ReactElement {
  unstable_setRequestLocale(locale);
  const t = useTranslations("pages.SignUpPage");
  const tLogin = useTranslations("pages.LoginPage");

  const bottomLink = tLogin.rich("alreadyHaveAccount", {
    signin: (chunks) => (
      <SmartLink
        href="/login"
        label={chunks}
        className="text-primary hover:underline"
      />
    ),
  });

  return (
    <AuthCardLayout bottomLink={bottomLink}>
      <SignupForm />
    </AuthCardLayout>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Build**: ((Implementada)) La conversión a un Client Component resuelve el error de renderizado estático.
 *
 * =====================================================================
 */
// src/app/[locale]/signup/page.tsx
