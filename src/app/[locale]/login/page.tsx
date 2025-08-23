// src/app/[locale]/login/page.tsx
/**
 * @file page.tsx
 * @description Ensamblador de UI para la página de inicio de sesión. Refactorizado
 *              a un estándar de élite para utilizar un layout centrado con Flexbox
 *              y para consumir los namespaces de i18n canónicos, garantizando la
 *              consistencia con la página de registro.
 * @author Raz Podestá
 * @version 2.0.0
 */
import { useTranslations } from "next-intl";

import { LoginForm } from "@/components/authentication/login-form";
import { OAuthButtonGroup } from "@/components/authentication/OAuthButtonGroup";
import { LoginCardGradient } from "@/components/gradients/login-card-gradient";
import { LoginGradient } from "@/components/gradients/login-gradient";
import { SmartLink } from "@/components/ui/SmartLink";

/**
 * @public
 * @page LoginPage
 * @description Renderiza la página de inicio de sesión completa.
 * @returns {React.ReactElement} El componente de página renderizado.
 */
export default function LoginPage(): React.ReactElement {
  const t = useTranslations("pages.LoginPage");
  const tSignUp = useTranslations("pages.SignUpPage");
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
        </div>
        <div
          className={
            "mx-auto w-[343px] md:w-[488px] rounded-b-lg bg-background/80 px-6 py-8 backdrop-blur-[6px] md:px-16"
          }
        >
          <div
            className={"text-center text-sm font-medium text-muted-foreground"}
          >
            {tSignUp.rich("dontHaveAccount", {
              signup: (chunks) => (
                <SmartLink
                  href="/signup"
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
 * 1. **Consistencia de UI**: ((Implementada)) Se ha aplicado el mismo layout Flexbox que en la página de registro, garantizando que ambas páginas de autenticación compartan una estructura visual idéntica y de élite.
 *
 * @subsection Melhorias Futuras
 * 1. **Componente `AuthCardLayout`**: ((Vigente)) La estructura de la tarjeta y el enlace inferior se repite en ambas páginas de autenticación. La creación de un componente `AuthCardLayout.tsx` es la próxima mejora lógica para un cumplimiento estricto del principio DRY.
 *
 * =====================================================================
 */
// src/app/[locale]/login/page.tsx
