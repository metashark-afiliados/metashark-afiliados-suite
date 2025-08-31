// src/components/authentication/login-form.tsx
/**
 * @file login-form.tsx
 * @description Formulario de inicio de sesión de presentación puro.
 *              Ha sido refactorizado para ser 100% agnóstico a la i18n,
 *              recibiendo todos sus textos a través de props.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @date 2025-08-31
 */
"use client";

import React from "react";
import { useFormState, useFormStatus } from "react-dom";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { signInWithEmailAction } from "@/lib/actions/auth.actions";
import { Link } from "@/lib/navigation";
import { type ActionResult, isActionError } from "@/lib/validators";
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
}

export interface LoginFormProps {
  texts: LoginFormTexts;
}

export function LoginForm({ texts }: LoginFormProps): React.ReactElement {
  const tErrors = useTranslations("shared.ValidationErrors");
  const [state, formAction] = useFormState<ActionResult<never>, FormData>(
    signInWithEmailAction,
    {
      success: false,
      error: "",
    }
  );

  React.useEffect(() => {
    if (isActionError(state)) {
      const errorMessage = tErrors(state.error as any, {
        defaultValue: state.error,
      });
      toast.error(errorMessage);
    }
  }, [state, tErrors]);

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
      <OAuthButtonGroup providers={["google"]} texts={oauthButtonGroupTexts} />
    </form>
  );
}
// src/components/authentication/login-form.tsx
