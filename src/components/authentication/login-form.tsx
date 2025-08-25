// src/components/authentication/login-form.tsx
/**
 * @file login-form.tsx
 * @description Componente de cliente soberano para el formulario de inicio de sesión.
 *              Refactorizado a un estándar de élite para ser un componente de
 *              presentación puro que recibe todos sus textos a través de props,
 *              cumpliendo con el Manifiesto IMAS v3.0.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { useFormState, useFormStatus } from "react-dom";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

import { signInWithEmailAction } from "@/lib/actions/auth.actions";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  OAuthButtonGroup,
  type OAuthButtonGroupProps,
} from "./OAuthButtonGroup";

interface SubmitButtonProps {
  texts: {
    signInButton: string;
    signInButton_pending: string;
  };
}

function SubmitButton({ texts }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? texts.signInButton_pending : texts.signInButton}
    </Button>
  );
}

export interface LoginFormTexts {
  email_label: string;
  password_label: string;
  forgot_password_link: string;
  signInButton: string;
  signInButton_pending: string;
  signInWith: string;
  signInWithProvider: string;
  error_invalid_credentials: string;
}

export interface LoginFormProps {
  texts: LoginFormTexts;
}

export function LoginForm({ texts }: LoginFormProps): React.ReactElement {
  const [state, formAction] = useFormState(signInWithEmailAction, {
    success: false,
    error: "",
  });

  React.useEffect(() => {
    if (!state.success && state.error) {
      const errorMessage =
        texts[state.error as keyof LoginFormTexts] || state.error;
      toast.error(errorMessage);
    }
  }, [state, texts]);

  const oauthButtonGroupTexts: OAuthButtonGroupProps["texts"] = {
    signInWithProvider: texts.signInWithProvider,
  };

  return (
    <form action={formAction} className="grid gap-4 p-6">
      <div className="grid gap-2">
        <Label htmlFor="email">{texts.email_label}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="m@example.com"
          required
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">{texts.password_label}</Label>
          <Link
            href="/forgot-password"
            className="ml-auto inline-block text-sm underline"
          >
            {texts.forgot_password_link}
          </Link>
        </div>
        <Input id="password" name="password" type="password" required />
      </div>
      <SubmitButton texts={texts} />
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {texts.signInWith}
          </span>
        </div>
      </div>
      <OAuthButtonGroup
        providers={["google", "apple"]}
        texts={oauthButtonGroupTexts}
      />
    </form>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente de Presentación Puro**: ((Implementada)) Se ha eliminado `useTranslations`. El componente ahora es 100% agnóstico al contenido y es controlado por su padre (`login/page.tsx`), cumpliendo la "Filosofía LEGO".
 * 2. **Inyección de Dependencia Textual (IDT)**: ((Implementada)) El componente ahora construye el objeto de `props` para `OAuthButtonGroup` y se lo inyecta, cumpliendo con el Manifiesto IMAS.
 * 3. **Consistencia Visual**: ((Implementada)) Se ha añadido el `padding` (`p-6`) que faltaba, alineando el formulario con el diseño de referencia.
 *
 * @subsection Melhorias Futuras
 * 1. **Mapeo de Errores Tipado**: ((Vigente)) La aserción `state.error as keyof LoginFormTexts` podría ser eliminada si el `ActionResult` se tipara con un `enum` de las claves de error válidas, proporcionando una seguridad de tipos aún mayor.
 *
 * =====================================================================
 */
