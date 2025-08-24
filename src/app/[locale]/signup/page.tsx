// src/app/[locale]/signup/page.tsx
/**
 * @file page.tsx
 * @description Ensamblador de UI para la página de registro. Refactorizado a un
 *              estándar de élite para consumir el `AuthCardLayout`, eliminando
 *              código duplicado y adhiriéndose a la "Filosofía LEGO".
 * @author Raz Podestá
 * @version 3.0.0
 */
import { useTranslations } from "next-intl";

import { OAuthButtonGroup } from "@/components/authentication/OAuthButtonGroup";
import { SignupForm } from "@/components/authentication/sign-up-form";
import { AuthCardLayout } from "@/components/layout/AuthCardLayout";
import { SmartLink } from "@/components/ui/SmartLink";

export default function SignupPage(): React.ReactElement {
  const t = useTranslations("pages.SignUpPage");
  const tLogin = useTranslations("pages.LoginPage");
  const tForm = useTranslations("components.auth.LoginForm");

  const formContent = (
    <>
      <SignupForm />
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

  const bottomLink = tLogin.rich("alreadyHaveAccount", {
    signin: (chunks) => (
      <SmartLink
        href="/login"
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
 * 1. **Consumo de Layout Atómico**: ((Implementada)) La página ahora consume `AuthCardLayout`, lo que centraliza la lógica de maquetación y resuelve los problemas de espaciado y scroll.
 * 2. **Principio DRY**: ((Implementada)) Se ha eliminado una cantidad significativa de código de layout duplicado, mejorando la mantenibilidad.
 *
 * @subsection Melhorias Futuras
 * 1. **Componente `AuthFormWrapper`**: ((Vigente)) La estructura que contiene el formulario y los botones OAuth también se repite. Podría ser abstraída a un componente `AuthFormWrapper` para una atomización aún más profunda.
 *
 * =====================================================================
 */
// src/app/[locale]/signup/page.tsx
