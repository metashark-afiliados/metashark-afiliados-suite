// src/app/[locale]/login/page.tsx
/**
 * @file page.tsx
 * @description Ensamblador de UI para la página de inicio de sesión. Refactorizado
 *              a un estándar de élite para consumir el `AuthCardLayout`, garantizando
 *              la consistencia visual y el cumplimiento del principio DRY.
 * @author Raz Podestá
 * @version 3.0.0
 */
import { useTranslations } from "next-intl";

import { LoginForm } from "@/components/authentication/login-form";
import { OAuthButtonGroup } from "@/components/authentication/OAuthButtonGroup";
import { AuthCardLayout } from "@/components/layout/AuthCardLayout";
import { SmartLink } from "@/components/ui/SmartLink";

export default function LoginPage(): React.ReactElement {
  const t = useTranslations("pages.LoginPage");
  const tSignUp = useTranslations("pages.SignUpPage");
  const tForm = useTranslations("components.auth.LoginForm");

  const formContent = (
    <>
      <LoginForm />
      <div className="relative px-6 md:px-16 pb-4">
        <div className="absolute inset-x-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {tForm("signInWith")}
          </span>
        </div>
      </div>
      <div className="px-6 md:px-16 pb-8">
        <OAuthButtonGroup providers={["google", "apple"]} />
      </div>
    </>
  );

  const bottomLink = tSignUp.rich("dontHaveAccount", {
    signup: (chunks) => (
      <SmartLink
        href="/signup"
        label={chunks}
        className="text-primary hover:underline"
      />
    ),
  });

  return <AuthCardLayout bottomLink={bottomLink}>{formContent}</AuthCardLayout>;
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Consistencia Visual y de Código**: ((Implementada)) Al consumir `AuthCardLayout`, esta página ahora es visual y estructuralmente idéntica a la página de registro, cumpliendo un principio fundamental de la UX de élite.
 * 2. **Principio DRY**: ((Implementada)) Se ha eliminado el código de layout duplicado.
 *
 * @subsection Melhorias Futuras
 * 1. **Componente `AuthFormWrapper`**: ((Vigente)) La estructura interna del `formContent` sigue siendo un candidato para ser abstraída a un componente reutilizable.
 *
 * =====================================================================
 */
// src/app/[locale]/login/page.tsx
