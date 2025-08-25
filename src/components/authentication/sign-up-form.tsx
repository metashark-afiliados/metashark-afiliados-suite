// src/components/authentication/sign-up-form.tsx
/**
 * @file sign-up-form.tsx
 * @description Orquestador de UI soberano para el formulario de registro.
 *              Refactorizado a un estándar de élite para ser un componente de
 *              presentación más puro, recibiendo textos de OAuth vía props y
 *              resolviendo dependencias cruzadas de i18n.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
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

export interface SignupFormProps {
  texts: {
    oauth: {
      signInWith: string;
      signInWithProvider: string;
    };
  };
}

export function SignupForm({ texts }: SignupFormProps) {
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
    signInWithProvider: texts.oauth.signInWithProvider,
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
            {texts.oauth.signInWith}
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
 * 1. **Resolución de Dependencia Cruzada**: ((Implementada)) Se ha eliminado la llamada `useTranslations("app.[locale].login.page")`. El componente ahora es puro con respecto a los textos de OAuth, recibiéndolos a través de `props`. Esto resuelve la causa raíz del error `FORMATTING_ERROR`.
 * 2. **Adhesión a la "Filosofía LEGO"**: ((Implementada)) Al no tener dependencias de i18n externas, este componente se convierte en una "pieza de LEGO" más robusta y reutilizable.
 *
 * @subsection Melhorias Futuras
 * 1. **Componente 100% Puro**: ((Vigente)) Para una pureza de élite, todas las llamadas a `useTranslations` (incluyendo `tErrors`) podrían ser eliminadas y sus textos requeridos pasados a través de `props`, convirtiéndolo en un componente de presentación 100% puro.
 *
 * =====================================================================
 */
