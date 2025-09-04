// src/components/authentication/login-form.tsx
/**
 * @file login-form.tsx
 * @description Componente de UI puro que ensambla el formulario de inicio de sesión.
 *              Delega toda la lógica a su hook soberano `useLoginForm`.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 3.0.0
 */
"use client";

import React, { useState } from "react";
import { FormProvider } from "react-hook-form";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

import {
  OAuthButtonGroup,
  type OAuthButtonGroupProps,
} from "@/components/authentication";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginForm, type LoginFormTexts } from "@/lib/hooks/useLoginForm";
import { clientLogger } from "@/lib/logger";
import { Link } from "@/lib/navigation";

/**
 * @public
 * @component LoginForm
 * @description Ensambla la UI del formulario de inicio de sesión. Es un componente de
 *              presentación 100% puro.
 * @returns {React.ReactElement}
 */
export function LoginForm(): React.ReactElement {
  clientLogger.trace(
    "[LoginForm] Renderizando componente de presentación puro.",
    { component: "LoginForm" }
  );

  const { form, isLoading, processSubmit, texts } = useLoginForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    const newVisibility = !showPassword;
    setShowPassword(newVisibility);
    clientLogger.info("[LoginForm] Visibilidad de contraseña alternada.", {
      newVisibility,
    });
  };

  const oauthButtonGroupTexts: OAuthButtonGroupProps["texts"] = {
    signInWithProvider: texts.signInWithProvider,
  };

  return (
    <div className="space-y-4 p-6">
      <OAuthButtonGroup providers={["google"]} texts={oauthButtonGroupTexts} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {texts.signInWith}
          </span>
        </div>
      </div>

      <FormProvider {...form}>
        <form onSubmit={handleSubmit(processSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">{texts.email_label}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                autoComplete="email"
                disabled={isLoading}
                hasError={!!errors.email}
                className="pl-9"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive" role="alert">
                {errors.email.message}
              </p>
            )}
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
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                disabled={isLoading}
                hasError={!!errors.password}
                className="pl-9 pr-10"
                {...register("password")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:bg-transparent"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? texts.signInButton_pending : texts.signInButton}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
// src/components/authentication/login-form.tsx
