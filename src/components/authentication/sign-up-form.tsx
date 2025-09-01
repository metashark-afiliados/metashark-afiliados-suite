// src/components/authentication/sign-up-form.tsx
/**
 * @file sign-up-form.tsx
 * @description Orquestador de UI y ensamblador 100% puro para el formulario de registro.
 *              Delega toda la lógica a su hook soberano `useSignUpForm` y recibe todos
 *              los textos a través de props, adhiriendo al patrón de componente de
 *              presentación puro.
 * @author L.I.A. Legacy & RaZ WriTe (Arquitecto)
 * @version 2.0.0
 * @see .docs-espejo/components/authentication/sign-up-form.tsx.md
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
import { clientLogger } from "@/lib/logger";
import { useSignUpForm } from "@/lib/hooks/useSignUpForm";
import {
  SignUpConfirmPasswordField,
  SignUpEmailField,
  SignUpLegalCheckboxes,
  SignUpPasswordField,
} from "./"; // Importa desde el barrel file

export interface SignupFormTexts {
  oauth: OAuthButtonGroupProps["texts"];
  signUpButton: string;
  signUpButton_pending: string;
  fields: {
    email: { label: string; placeholder: string };
    password: { label: string };
    confirmPassword: { label: string };
  };
}

export interface SignupFormProps {
  texts: SignupFormTexts;
}

/**
 * @public
 * @component SignupForm
 * @description Orquesta la UI para el formulario de registro.
 * @param {SignupFormProps} props - Propiedades para configurar los textos.
 * @returns {React.ReactElement}
 */
export function SignupForm({ texts }: SignupFormProps): React.ReactElement {
  clientLogger.trace("[SignupForm] Renderizando ensamblador de UI puro.");

  const { form, isLoading, processSubmit, t, tErrors } = useSignUpForm();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = form;
  const passwordValue = watch("password");

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
        <form onSubmit={handleSubmit(processSubmit)} className="space-y-4">
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
          />
          <SignUpLegalCheckboxes
            control={control}
            errors={errors}
            isPending={isLoading}
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
