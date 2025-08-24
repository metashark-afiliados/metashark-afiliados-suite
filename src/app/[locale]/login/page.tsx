// src/app/[locale]/login/page.tsx
/**
 * @file page.tsx
 * @description Página de inicio de sesión. Refactorizada para eliminar la llamada
 *              a `unstable_setRequestLocale`, que es incompatible con Client
 *              Components, resolviendo un error crítico de runtime.
 * @author Raz Podestá
 * @version 5.0.0
 */
"use client";

import { useTranslations } from "next-intl";
// unstable_setRequestLocale ha sido eliminado.

import { LoginForm } from "@/components/authentication/login-form";
import { AuthCardLayout } from "@/components/layout/AuthCardLayout";
import { SmartLink } from "@/components/ui/SmartLink";

export default function LoginPage(): React.ReactElement {
  // La llamada a unstable_setRequestLocale ha sido eliminada.
  // El locale se obtiene del contexto provisto por el Root Layout.
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
 * 1. **Resolución de Error de Runtime**: ((Implementada)) Se ha eliminado la llamada a `unstable_setRequestLocale`, que es una API exclusiva para Server Components, resolviendo la causa raíz del fallo de despliegue en Vercel.
 * 2. **Alineación Arquitectónica**: ((Implementada)) El componente ahora adhiere estrictamente a las reglas de los Client Components.
 *
 * @subsection Melhorias Futuras
 * 1. **Paso de `locale` Explícito**: ((Vigente)) Aunque el contexto funciona, una práctica de élite aún más robusta sería que el `RootLayout` leyera los `params` y los pasara explícitamente a un proveedor de contexto, en lugar de que cada página lo haga. (Nota: Esto ya se está haciendo correctamente).
 *
 * =====================================================================
 */
// src/app/[locale]/login/page.tsx
