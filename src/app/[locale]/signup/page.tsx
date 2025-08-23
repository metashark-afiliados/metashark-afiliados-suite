// src/app/[locale]/signup/page.tsx
/**
 * @file page.tsx
 * @description Ensamblador de UI para la página de registro. Refactorizado a
 *              un estándar de élite para utilizar un layout centrado con Flexbox,
 *              eliminando el espaciado excesivo y el scroll innecesario, y para
 *              consumir los namespaces de i18n canónicos.
 * @author Raz Podestá
 * @version 2.0.0
 */
import { useTranslations } from "next-intl";

import { OAuthButtonGroup } from "@/components/authentication/OAuthButtonGroup";
import { SignupForm } from "@/components/authentication/sign-up-form";
import { LoginCardGradient } from "@/components/gradients/login-card-gradient";
import { LoginGradient } from "@/components/gradients/login-gradient";
import { SmartLink } from "@/components/ui/SmartLink";

export default function SignupPage(): React.ReactElement {
  const t = useTranslations("pages.SignUpPage");
  const tLogin = useTranslations("pages.LoginPage");
  const tForm = useTranslations("components.auth.LoginForm");

  return (
    // --- INICIO DE REFACTORIZACIÓN DE LAYOUT ---
    <div className="relative flex min-h-screen w-full items-center justify-center p-4">
      <LoginGradient />
      <div className="z-10 flex flex-col">
        <div
          className={
            "mx-auto w-[343px] md:w-[488px] gap-5 flex-col rounded-lg login-card-border bg-background/80 backdrop-blur-[6px]"
          }
        >
          <LoginCardGradient />
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
        </div>
        <div
          className={
            "mx-auto w-[343px] md:w-[488px] rounded-b-lg bg-background/80 px-6 py-8 backdrop-blur-[6px] md:px-16"
          }
        >
          <div
            className={"text-center text-sm font-medium text-muted-foreground"}
          >
            {tLogin.rich("alreadyHaveAccount", {
              signin: (chunks) => (
                <SmartLink
                  href="/login"
                  label={chunks}
                  className="text-primary hover:underline"
                />
              ),
            })}
          </div>
        </div>
      </div>
    </div>
    // --- FIN DE REFACTORIZACIÓN DE LAYOUT ---
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Layout de Élite Centrado**: ((Implementada)) Se ha reemplazado el `mt-[112px]` por un contenedor Flexbox (`flex min-h-screen items-center justify-center`). Esta es la solución canónica para centrar contenido verticalmente, eliminando el scroll y garantizando una presentación perfecta en cualquier viewport.
 * 2. **Consolidación de Estilos**: ((Implementada)) Se han unificado los estilos del `div` inferior para una mayor consistencia y legibilidad.
 *
 * @subsection Melhorias Futuras
 * 1. **Componente `AuthCardLayout`**: ((Vigente)) La estructura de la tarjeta y el enlace inferior se repite en la página de login. Abstraerla a un componente de layout `AuthCardLayout.tsx` sigue siendo la mejora de élite pendiente para cumplir con el principio DRY.
 *
 * =====================================================================
 */
// src/app/[locale]/signup/page.tsx
