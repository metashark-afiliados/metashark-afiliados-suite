// src/components/authentication/sign-up-form.tsx
/**
 * @file src/components/authentication/sign-up-form.tsx
 * @description Orquestador de UI para el formulario de registro. Corregido para
 *              utilizar importaciones relativas directas, resolviendo la
 *              dependencia circular `TS2303`.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
"use client";

import React from "react";
import { FormProvider } from "react-hook-form";
import { Loader2 } from "lucide-react";

import {
  OAuthButtonGroup,
  type OAuthButtonGroupProps,
} from "@/components/authentication";
import { Button } from "@/components/ui/button";
import { useSignUpForm } from "@/lib/hooks/useSignUpForm";
import { clientLogger } from "@/lib/logger";

// --- INICIO DE CORRECCIÓN ARQUITECTÓNICA (Rutas Relativas) ---
import { SignUpConfirmPasswordField } from "./sign-up-form/SignUpConfirmPasswordField";
import { SignUpEmailField } from "./sign-up-form/SignUpEmailField";
import { SignUpLegalCheckboxes } from "./sign-up-form/SignUpLegalCheckboxes";
import { SignUpPasswordField } from "./sign-up-form/SignUpPasswordField";
// --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---

export interface SignupFormProps {
  texts: {
    oauth: OAuthButtonGroupProps["texts"];
    signUpButton: string;
    signUpButton_pending: string;
    fields: {
      email: { label: string; placeholder: string };
      password: { label: string };
      confirmPassword: { label: string };
    };
  };
}

export function SignupForm({ texts }: SignupFormProps): React.ReactElement {
  const { form, isLoading, processSubmit, t, tErrors } = useSignUpForm();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = form;
  const passwordValue = watch("password");

  clientLogger.trace("[SignupForm] Renderizando orquestador de UI.");

  return (
    <div className="space-y-4 p-6">
      <OAuthButtonGroup providers={["google"]} texts={texts.oauth} />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t("signInWith")}
          </span>
        </div>
      </div>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(processSubmit)} className="grid gap-4">
          <SignUpEmailField
            register={register}
            errors={errors}
            isPending={isLoading}
            label={texts.fields.email.label}
            placeholder={texts.fields.email.placeholder}
            errorMessage={
              errors.email?.message
                ? tErrors(errors.email.message as any)
                : undefined
            }
          />
          <SignUpPasswordField
            register={register}
            errors={errors}
            isPending={isLoading}
            passwordValue={passwordValue}
            label={texts.fields.password.label}
            errorMessage={
              errors.password?.message
                ? tErrors(errors.password.message as any)
                : undefined
            }
            ariaLabels={{
              show: "Mostrar contraseña",
              hide: "Ocultar contraseña",
            }}
            strengthMeterTexts={{
              strength_weak: t.rich("strength_weak", {
                strong: (chunks) => <strong>{chunks}</strong>,
              }),
              strength_fair: t.rich("strength_fair", {
                strong: (chunks) => <strong>{chunks}</strong>,
              }),
              strength_good: t.rich("strength_good", {
                strong: (chunks) => <strong>{chunks}</strong>,
              }),
              strength_strong: t.rich("strength_strong", {
                strong: (chunks) => <strong>{chunks}</strong>,
              }),
            }}
          />
          <SignUpConfirmPasswordField
            register={register}
            errors={errors}
            isPending={isLoading}
            label={texts.fields.confirmPassword.label}
            errorMessage={
              errors.confirmPassword?.message
                ? tErrors(errors.confirmPassword.message as any)
                : undefined
            }
            ariaLabels={{
              show: "Mostrar contraseña",
              hide: "Ocultar contraseña",
            }}
          />
          <SignUpLegalCheckboxes
            control={control}
            errors={errors}
            isPending={isLoading}
            texts={{
              legalNotice: t.rich("legalNotice", {
                terms: (chunks) => (
                  <a href="/terms" className="underline">
                    {chunks}
                  </a>
                ),
                privacy: (chunks) => (
                  <a href="/privacy" className="underline">
                    {chunks}
                  </a>
                ),
              }),
              newsletterLabel: t("newsletter_label"),
            }}
            errorMessage={
              errors.termsAccepted?.message
                ? tErrors(errors.termsAccepted.message as any)
                : undefined
            }
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? texts.signUpButton_pending : texts.signUpButton}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
// src/components/authentication/sign-up-form.tsx
