// src/lib/hooks/useLoginForm.ts
/**
 * @file useLoginForm.ts
 * @description Hook Soberano que encapsula toda la lógica y contenido para el
 *              formulario de inicio de sesión. Es la SSoT para este flujo.
 * @author L.I.A. Legacy & RaZ WriTe (Arquitecto)
 * @version 2.0.0
 * @see .docs-espejo/lib/hooks/useLoginForm.ts.md
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

import { signInWithEmailAction } from "@/lib/actions/auth.actions";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logger";
import { isActionError, SignInSchema } from "@/lib/validators";
import { type LoginFormTexts } from "@/components/authentication/login-form";

type FormData = z.infer<typeof SignInSchema>;

interface UseLoginFormReturn {
  form: UseFormReturn<FormData>;
  isLoading: boolean;
  processSubmit: SubmitHandler<FormData>;
  texts: LoginFormTexts;
}

/**
 * @public
 * @function useLoginForm
 * @description Hook Soberano que encapsula la lógica para el formulario de inicio de sesión.
 * @returns {UseLoginFormReturn} Un objeto con la instancia del formulario, la lógica y los textos.
 */
export function useLoginForm(): UseLoginFormReturn {
  const t = useTypedTranslations("app.[locale].login.page");
  const tErrors = useTypedTranslations("shared.ValidationErrors");
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const {
    formState: { isSubmitting },
  } = form;

  const processSubmit: SubmitHandler<FormData> = (data) => {
    clientLogger.trace(
      "[useLoginForm] Iniciando envío de formulario de login.",
      { email: data.email }
    );

    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      // El primer argumento `prevState` es null porque no estamos usando el estado
      // para pasar errores, sino el objeto de retorno.
      const result = await signInWithEmailAction(null, formData);

      if (isActionError(result)) {
        const errorMessage = tErrors(result.error as any, {
          defaultValue: result.error,
        });
        toast.error(errorMessage);
        clientLogger.warn("[useLoginForm] Fallo en el inicio de sesión.", {
          error: result.error,
        });
      }
      // El caso de éxito es manejado por un `redirect` en la Server Action.
    });
  };

  const isLoading = isSubmitting || isPending;

  // Construir el objeto de textos para la UI de presentación pura.
  const texts: LoginFormTexts = {
    email_label: t("email_label"),
    password_label: t("password_label"),
    forgot_password_link: t("forgot_password_link"),
    signInButton: t("signInButton"),
    signInButton_pending: t("signInButton_pending"),
    signInWith: t("signInWith"),
    signInWithProvider: t("signInWithProvider"),
  };

  return {
    form,
    isLoading,
    processSubmit,
    texts,
  };
}
// src/lib/hooks/useLoginForm.ts
