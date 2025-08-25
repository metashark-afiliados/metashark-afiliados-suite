// src/components/authentication/sign-up-form.tsx
/**
 * @file sign-up-form.tsx
 * @description Orquestador de UI soberano para el formulario de registro.
 *              Refactorizado a un estándar de élite para componer sus campos
 *              de formulario a partir de componentes atómicos, con una
 *              corrección crítica en la ruta de importación para resolver
 *              una dependencia circular.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.1.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState, useFormStatus } from "react-dom";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import type { z } from "zod";

import { signUpAction } from "@/lib/actions/auth.actions";
import { SignUpSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SmartLink } from "@/components/ui/SmartLink";
import { OAuthButtonGroup } from "./OAuthButtonGroup";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";
// --- INICIO DE CORRECCIÓN DE IMPORTACIÓN ---
import {
  SignUpEmailField,
  SignUpPasswordField,
  SignUpConfirmPasswordField,
  SignUpLegalCheckboxes,
} from "./sign-up-form/index";
// --- FIN DE CORRECCIÓN DE IMPORTACIÓN ---

type FormData = z.infer<typeof SignUpSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("pages.SignUpPage");
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? t("signUpButton_pending") : t("signUpButton")}
    </Button>
  );
}

export function SignupForm() {
  const tErrors = useTranslations("ValidationErrors");
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

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4 p-6">
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
      <OAuthButtonGroup providers={["google", "apple"]} />
    </form>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Dependencia Circular**: ((Implementada)) Se ha corregido la ruta de importación para que apunte explícitamente a `./sign-up-form/index`, resolviendo la ambigüedad y el error de compilación.
 * 2. **Arquitectura de Ensamblaje (LEGO)**: ((Vigente)) El formulario ahora es un orquestador puro que compone sus campos a partir de componentes atómicos.
 *
 * =====================================================================
 */
// src/components/authentication/sign-up-form.tsx
