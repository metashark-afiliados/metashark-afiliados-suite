// src/components/authentication/login-form.tsx
/**
 * @file login-form.tsx
 * @description Componente de cliente soberano para el formulario de inicio de sesión.
 *              Sincronizado para consumir los namespaces de i18n canónicos.
 * @author Raz Podestá
 * @version 3.1.0
 */
"use client";

import Image from "next/image";
import React, { useTransition } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

import { signInWithEmailAction } from "@/lib/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OAuthButtonGroup } from "./OAuthButtonGroup";

/**
 * @public
 * @component LoginForm
 * @description Renderiza el formulario de inicio de sesión, gestionando su estado y la invocación de la Server Action.
 * @returns {React.ReactElement} El componente de formulario renderizado.
 */
export function LoginForm(): React.ReactElement {
  const t = useTranslations("pages.LoginPage");
  const tSupabase = useTranslations("components.auth.SupabaseAuthUI");
  const [isPending, startTransition] = useTransition();

  const handleLogin = (formData: FormData) => {
    startTransition(async () => {
      const result = await signInWithEmailAction(null, formData);
      if (result && !result.success) {
        toast.error(t(result.error as any));
      }
    });
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

      <form action={handleLogin} className="w-full space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">{tSupabase("email_label")}</Label>
          <Input
            type="email"
            id="email"
            name="email"
            autoComplete="username"
            disabled={isPending}
            required
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="password">{tSupabase("password_label")}</Label>
          <Input
            type="password"
            id="password"
            name="password"
            autoComplete="current-password"
            disabled={isPending}
            required
          />
        </div>
        <Button type={"submit"} disabled={isPending} className={"w-full"}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? t("signInButton_pending") : t("signInButton")}
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
 * 1. **Sincronización de i18n**: ((Implementada)) Se ha corregido el namespace para `tSupabase`, resolviendo futuros errores `MISSING_MESSAGE`.
 *
 * =====================================================================
 */
// src/components/authentication/login-form.tsx
