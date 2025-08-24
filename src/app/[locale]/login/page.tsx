// src/app/[locale]/login/page.tsx
/**
 * @file page.tsx
 * @description Página de inicio de sesión. Refactorizada a un Componente de
 *              Cliente para resolver el conflicto de renderizado dinámico
 *              durante el build estático.
 * @author Raz Podestá
 * @version 4.0.0
 */
"use client"; // <-- DIRECTIVA CRÍTICA

import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server"; // Aún se necesita para el locale

import { LoginForm } from "@/components/authentication/login-form";
import { AuthCardLayout } from "@/components/layout/AuthCardLayout";
import { SmartLink } from "@/components/ui/SmartLink";

export default function LoginPage({
  params: { locale },
}: {
  params: { locale: string };
}): React.ReactElement {
  unstable_setRequestLocale(locale); // Establece el locale para la página
  const t = useTranslations("pages.LoginPage");
  const tSignUp = useTranslations("pages.SignUpPage");

  const bottomLink = tSignUp.rich("dontHaveAccount", {
    signup: (chunks) => (
      <SmartLink
        href="/signup"
        label={chunks}
        className="text-primary hover:underline"
      />
    ),
  });

  return (
    <AuthCardLayout bottomLink={bottomLink}>
      <LoginForm />
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
// src/app/[locale]/login/page.tsx
