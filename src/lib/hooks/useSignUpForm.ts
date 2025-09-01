// src/lib/hooks/useSignUpForm.ts
/**
 * @file useSignUpForm.ts
 * @description Hook Soberano que encapsula la lógica de negocio y estado
 *              para el componente `SignupForm`. Orquesta `react-hook-form`,
 *              la Server Action `signUpAction` y el feedback al usuario.
 *              Ahora también provee las traducciones para sus campos hijos.
 * @author L.I.A. Legacy & RaZ WriTe (Arquitecto)
 * @version 2.0.0
 * @see .docs-espejo/lib/hooks/useSignUpForm.ts.md
 */
"use client";

import { useTransition } from "react";
import {
  useForm,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useTranslations } from "next-intl";

import { signUpAction } from "@/lib/actions/auth.actions";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logger";
import { isActionError, SignUpSchema } from "@/lib/validators";

type FormData = z.infer<typeof SignUpSchema>;

interface UseSignUpFormReturn {
  form: UseFormReturn<FormData>;
  isLoading: boolean;
  processSubmit: SubmitHandler<FormData>;
  t: ReturnType<typeof useTranslations>;
  tErrors: ReturnType<typeof useTypedTranslations>;
}

/**
 * @public
 * @function useSignUpForm
 * @description Hook Soberano que encapsula la lógica para el formulario de registro.
 * @returns {UseSignUpFormReturn} Un objeto con la instancia del formulario y la lógica.
 */
export function useSignUpForm(): UseSignUpFormReturn {
  const t = useTranslations("app.[locale].signup.page");
  const tErrors = useTypedTranslations("shared.ValidationErrors");
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(SignUpSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: true,
      newsletterSubscribed: true,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const processSubmit: SubmitHandler<FormData> = (data) => {
    clientLogger.trace(
      "[useSignUpForm] Iniciando envío de formulario de registro.",
      { email: data.email }
    );

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
        clientLogger.warn("[useSignUpForm] Fallo en el registro.", {
          error: result.error,
        });
      }
    });
  };

  const isLoading = isSubmitting || isPending;

  return {
    form,
    isLoading,
    processSubmit,
    t,
    tErrors,
  };
}
// src/lib/hooks/useSignUpForm.ts
