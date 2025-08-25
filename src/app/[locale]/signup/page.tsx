// src/app/[locale]/signup/page.tsx
/**
 * @file page.tsx
 * @description Página de registro. Ensambla el `AuthCardLayout` y el `SignupForm`
 *              para construir la vista de registro completa, finalizando la
 *              migración a la arquitectura de páginas dedicadas.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useTranslations } from "next-intl";

import { SignupForm } from "@/components/authentication/sign-up-form";
import { AuthCardLayout } from "@/components/layout/AuthCardLayout";
import { SmartLink } from "@/components/ui/SmartLink";

export default function SignupPage(): React.ReactElement {
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
 * 1. **Finalización de Flujo de Autenticación**: ((Implementada)) Este aparato completa la migración del flujo de registro a una página dedicada.
 * 2. **Composición Atómica (LEGO)**: ((Implementada)) Actúa como un ensamblador puro, componiendo `AuthCardLayout` y `SignupForm`.
 *
 * =====================================================================
 */
// src/app/[locale]/signup/page.tsx
