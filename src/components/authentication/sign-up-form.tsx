// src/components/authentication/sign-up-form.tsx
/**
 * @file sign-up-form.tsx
 * @description Orquestador de UI soberano para el formulario de registro.
 *              Refactorizado para actuar como un orquestador de i18n para sus
 *              componentes hijos, resolviendo un error de compilación.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState, useFormStatus } from "react-dom";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import type { z } from "zod";

import { signUpAction } from "@/lib/actions/auth.actions";
import { SignUpSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import {
  SignUpEmailField,
  SignUpPasswordField,
  SignUpConfirmPasswordField,
  SignUpLegalCheckboxes,
} from "./sign-up-form/index";
import {
  OAuthButtonGroup,
  type OAuthButtonGroupProps,
} from "./OAuthButtonGroup";

type FormData = z.infer<typeof SignUpSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("app.[locale].signup.page");
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? t("signUpButton_pending") : t("signUpButton")}
    </Button>
  );
}

export function SignupForm() {
  const tLogin = useTranslations("app.[locale].login.page");
  const tErrors = useTranslations("shared.ValidationErrors");
  const [state, formAction] = useFormState(signUpAction, {
    success: false,
    error: "",
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(SignUpSchema),
    mode: "onTouched",
    defaultValues: {
      termsAccepted: false,
      newsletterSubscribed: false,
    },
  });

  const password = watch("password");

  React.useEffect(() => {
    if (!state.success && state.error) {
      toast.error(tErrors(state.error as any));
    }
  }, [state, tErrors]);

  const processSubmit: SubmitHandler<FormData> = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    formAction(formData);
  };

  const isPending = useFormStatus().pending || isSubmitting;

  const oauthButtonGroupTexts: OAuthButtonGroupProps["texts"] = {
    signInWithProvider: tLogin("signInWithProvider"),
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4">
      <SignUpEmailField
        register={register}
        errors={errors}
        isPending={isPending}
      />
      <SignUpPasswordField
        register={register}
        errors={errors}
        isPending={isPending}
        passwordValue={password}
      />
      <SignUpConfirmPasswordField
        register={register}
        errors={errors}
        isPending={isPending}
      />
      <SignUpLegalCheckboxes
        control={control}
        errors={errors}
        isPending={isPending}
      />
      <SubmitButton />
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {tLogin("signInWith")}
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
 * 1. **Resolución de Error de Compilación (TS2741)**: ((Implementada)) El componente ahora obtiene las traducciones del namespace consolidado y las pasa como prop a `OAuthButtonGroup`, cumpliendo el nuevo contrato y resolviendo el error.
 * 2. **Cohesión de i18n**: ((Implementada)) Se ha consolidado el consumo de textos de OAuth, eliminando la dispersión de la lógica de i18n.
 *
 * @subsection Melhorias Futuras
 * 1. **Componente Puro**: ((Vigente)) Para una pureza de élite, este componente podría ser refactorizado para recibir todos sus textos y la función `t` a través de props, al igual que se hizo con `LoginForm`.
 *
 * =====================================================================
 */
// src/components/authentication/sign-up-form.tsx
