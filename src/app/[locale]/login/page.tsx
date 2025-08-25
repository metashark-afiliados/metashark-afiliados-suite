// src/app/[locale]/login/page.tsx
/**
 * @file page.tsx
 * @description Página de inicio de sesión. Ensambla el `AuthCardLayout` y el
 *              `LoginForm` para construir la vista de inicio de sesión completa.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useTranslations } from "next-intl";

import { LoginForm } from "@/components/authentication/login-form";
import { AuthCardLayout } from "@/components/layout/AuthCardLayout";
import { SmartLink } from "@/components/ui/SmartLink";

export default function LoginPage(): React.ReactElement {
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
 * 1. **Página de Autenticación Dedicada**: ((Implementada)) Este nuevo aparato crea la ruta `/login`, completando el primer paso de la migración del flujo de autenticación.
 * 2. **Composición Atómica (LEGO)**: ((Implementada)) Actúa como un ensamblador puro, componiendo los aparatos atómicos `AuthCardLayout` y `LoginForm`.
 *
 * @subsection Melhorias Futuras
 * 1. **Metadatos Dinámicos**: ((Vigente)) Convertir a un Server Component para poder usar la función `generateMetadata` y establecer el título de la página de forma dinámica y traducida.
 *
 * =====================================================================
 */
// src/app/[locale]/login/page.tsx
