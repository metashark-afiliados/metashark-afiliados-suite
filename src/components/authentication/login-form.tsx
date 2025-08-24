// src/components/authentication/login-form.tsx
/**
 * @file login-form.tsx
 * @description Componente de cliente para el formulario de inicio de sesión.
 *              MODO DE DESARROLLO AISLADO: La lógica de envío ha sido
 *              reemplazada por una redirección directa al dashboard para
 *              acelerar la depuración funcional.
 * @author Raz Podestá
 * @version 4.0.0 (Dev Shortcut)
 */
"use client";

import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/lib/navigation";
import { OAuthButtonGroup } from "./OAuthButtonGroup";

/**
 * @public
 * @component LoginForm
 * @description Renderiza el formulario de inicio de sesión. En modo de desarrollo,
 *              redirige al dashboard al hacer submit.
 * @returns {React.ReactElement} El componente de formulario renderizado.
 */
export function LoginForm(): React.ReactElement {
  const t = useTranslations("pages.LoginPage");
  const tSupabase = useTranslations("components.auth.SupabaseAuthUI");
  const router = useRouter();

  const handleDevLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Bypass directo al dashboard
    router.push("/dashboard");
  };

  return (
    <div
      className={
        "px-6 md:px-16 pb-6 py-8 gap-6 flex flex-col items-center justify-center"
      }
    >
      <Image
        src="/images/logo.png"
        alt="ConvertiKit Logo"
        width={80}
        height={80}
      />
      <div
        className={
          "text-[30px] leading-[36px] font-medium tracking-[-0.6px] text-center"
        }
      >
        {t("title")}
      </div>

      <form onSubmit={handleDevLogin} className="w-full space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">{tSupabase("email_label")}</Label>
          <Input
            type="email"
            id="email"
            name="email"
            autoComplete="username"
            defaultValue="dev@convertikit.com" // Placeholder para conveniencia
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="password">{tSupabase("password_label")}</Label>
          <Input
            type="password"
            id="password"
            name="password"
            autoComplete="current-password"
            defaultValue="password" // Placeholder para conveniencia
          />
        </div>
        <Button type={"submit"} className={"w-full"}>
          {t("signInButton")}
        </Button>
      </form>
    </div>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Shortcut de Desarrollo**: ((Implementada)) El formulario ahora implementa un bypass de autenticación del lado del cliente, redirigiendo directamente al dashboard para agilizar la depuración, según la directiva.
 * 2. **Simplificación de Código**: ((Implementada)) Se ha eliminado la lógica de `useTransition` y `react-hot-toast` que era específica para la Server Action, haciendo el componente más ligero para esta fase de desarrollo.
 *
 * @subsection Melhorias Futuras
 * 1. **Restauración de Lógica de Producción**: ((Vigente)) Este aparato deberá ser revertido a su versión anterior (que invoca `signInWithEmailAction`) antes del despliegue a producción. Se recomienda mantener la versión anterior en un archivo `login-form.tsx.bak` para facilitar la restauración.
 *
 * =====================================================================
 */
// src/components/authentication/login-form.tsx
