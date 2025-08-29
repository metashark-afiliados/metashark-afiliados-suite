// src/components/authentication/sign-up-form.tsx
/**
 * @file src/components/authentication/sign-up-form.tsx
 * @description Orquestador de UI y lógica para el formulario de registro.
 *              Ha sido refactorizado holísticamente para eliminar la colisión
 *              entre `useFormState` y `react-hook-form`, adoptando `useTransition`
 *              para una gestión de estado de Server Action robusta y tipo-segura.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React, { useTransition } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { type z } from "zod";

import { OAuthButtonGroup } from "@/components/authentication";
import { Button } from "@/components/ui/button";
import { signUpAction } from "@/lib/actions/auth.actions";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logging";
import { isActionError, SignUpSchema } from "@/lib/validators";
import {
  SignUpConfirmPasswordField,
  SignUpEmailField,
  SignUpLegalCheckboxes,
  SignUpPasswordField,
} from "./sign-up-form/";

type FormData = z.infer<typeof SignUpSchema>;

export interface SignupFormProps {
  texts: {
    oauth: {
      signInWith: string;
      signInWithProvider: string;
    };
  };
}

/**
 * @public
 * @component SignupForm
 * @description Orquesta la UI y la lógica para el formulario de registro.
 * @param {SignupFormProps} props - Propiedades para configurar los textos del componente.
 * @returns {React.ReactElement}
 */
export function SignupForm({ texts }: SignupFormProps): React.ReactElement {
  clientLogger.trace("[SignupForm] Renderizando orquestador de UI.");
  const t = useTranslations("app.[locale].signup.page");
  const tErrors = useTypedTranslations("shared.ValidationErrors");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(SignUpSchema),
    mode: "onTouched",
    defaultValues: {
      termsAccepted: false,
      newsletterSubscribed: true,
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");

  const processSubmit: SubmitHandler<FormData> = (data) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      const result = await signUpAction(null, formData);

      if (isActionError(result)) {
        const errorMessage = tErrors(result.error as any, {
          defaultValue: result.error,
        });
        toast.error(errorMessage);
      }
    });
  };

  const isLoading = isSubmitting || isPending;

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
      <form onSubmit={handleSubmit(processSubmit)} className="space-y-4">
        <SignUpEmailField
          register={register}
          errors={errors}
          isPending={isLoading}
        />
        <SignUpPasswordField
          register={register}
          errors={errors}
          isPending={isLoading}
          passwordValue={passwordValue}
        />
        <SignUpConfirmPasswordField
          register={register}
          errors={errors}
          isPending={isLoading}
        />
        <SignUpLegalCheckboxes
          control={control}
          errors={errors}
          isPending={isLoading}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? t("signUpButton_pending") : t("signUpButton")}
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
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @section Melhorias Futuras
 * 1. ((Vigente)) **Hook `useSignUpForm`:** Para una pureza arquitectónica de élite, toda la lógica de `useForm`, `useTransition` y `processSubmit` podría ser abstraída a un hook soberano `useSignUpForm`. Esto convertiría a `SignupForm` en un componente de presentación 100% puro, enfocado exclusivamente en el ensamblaje de la UI.
 * 2. ((Vigente)) **Feedback Visual en `isPending`:** El estado `isPending` se pasa a los campos, pero se podría mejorar el feedback visual en los `Inputs` y `Checkboxes` (no solo `disabled`) para indicar que el formulario se está procesando, por ejemplo, con un overlay semitransparente.
 *
 * =====================================================================
 */
// src/components/authentication/sign-up-form.tsx
