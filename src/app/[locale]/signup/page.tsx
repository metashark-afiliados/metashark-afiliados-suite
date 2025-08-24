// src/app/[locale]/signup/page.tsx
/**
 * @file page.tsx
 * @description Página de registro. Refactorizada para eliminar la llamada
 *              a `unstable_setRequestLocale`, que es incompatible con Client
 *              Components, resolviendo un error crítico de runtime.
 * @author Raz Podestá
 * @version 5.0.0
 */
"use client";

import { useTranslations } from "next-intl";
// unstable_setRequestLocale ha sido eliminado.

import { SignupForm } from "@/components/authentication/sign-up-form";
import { AuthCardLayout } from "@/components/layout/AuthCardLayout";
import { SmartLink } from "@/components/ui/SmartLink";

export default function SignupPage(): React.ReactElement {
  // La llamada a unstable_setRequestLocale ha sido eliminada.
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
 * 1. **Resolución de Error de Runtime**: ((Implementada)) Se ha eliminado la llamada a `unstable_setRequestLocale`, resolviendo el fallo de despliegue.
 * 2. **Alineación Arquitectónica**: ((Implementada)) El componente ahora adhiere estrictamente a las reglas de los Client Components.
 *
 * @subsection Melhorias Futuras
 * 1. **Componente `AuthPage` Genérico**: ((Vigente)) Las páginas de Login y Signup comparten una estructura idéntica. Podrían ser abstraídas a un único componente `AuthPage` que reciba el formulario a renderizar como `children`.
 *
 * =====================================================================
 */
// src/app/[locale]/signup/page.tsx
