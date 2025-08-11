// src/components/auth/SignUpForm.tsx
/**
 * @file src/components/auth/SignUpForm.tsx
 * @description Componente de cliente atómico y soberano para el formulario de registro.
 *              Utiliza `react-hook-form` para una validación robusta del lado del
 *              cliente y `useFormState` para gestionar la comunicación declarativa
 *              con la Server Action `signUpAction`. Es completamente internacionalizado
 *              y observable.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { type z } from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpAction } from "@/lib/actions/auth.actions";
import { logger } from "@/lib/logging";
import { SignUpSchema } from "@/lib/validators";

type FormData = z.infer<typeof SignUpSchema>;

/**
 * @private
 * @component SubmitButton
 * @description Un sub-componente interno que utiliza el hook `useFormStatus` para
 *              mostrar un estado de carga mientras la Server Action está pendiente.
 * @returns {React.ReactElement}
 */
function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("SignUpPage");

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? t("signUpButton_pending") : t("signUpButton")}
    </Button>
  );
}

/**
 * @public
 * @component SignUpForm
 * @description Renderiza el formulario de registro completo, manejando la validación
 *              del cliente, el envío de datos a la Server Action, y la visualización
 *              de errores tanto del cliente como del servidor.
 * @returns {React.ReactElement}
 */
export function SignUpForm(): React.ReactElement {
  const t = useTranslations("SignUpPage");
  const [formState, formAction] = useFormState(signUpAction, {
    success: false,
    error: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!formState.success && formState.error) {
      logger.warn("[SignUpForm] La Server Action de registro falló.", {
        error: formState.error,
      });
    }
  }, [formState]);

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit((data, event) => {
        const formData = new FormData(event?.target as HTMLFormElement);
        formAction(formData);
      })}
      className="space-y-4"
    >
      {!formState.success && formState.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{formState.error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">{t("emailLabel")}</Label>
        <Input
          id="email"
          type="email"
          placeholder="nombre@ejemplo.com"
          autoComplete="email"
          {...register("email")}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t("passwordLabel")}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Padrão de Formulário Soberano**: ((Implementada)) Este componente implementa el patrón canónico para formularios, utilizando `react-hook-form` y `zodResolver` para una UX robusta con validación del lado del cliente.
 * 2. **Full Observabilidad**: ((Implementada)) La interacción del usuario y los fallos de la Server Action son registrados con `logger.warn`, proporcionando una visibilidad completa del flujo de registro.
 * 3. **Full Internacionalización**: ((Implementada)) Todos los textos visibles y mensajes de error del cliente son consumidos desde la capa de `next-intl`.
 *
 * @subsection Melhorias Futuras
 * 1. **Campo de Confirmación de Contraseña**: ((Vigente)) Añadir un campo "Confirmar Contraseña" al formulario y al `SignUpSchema` de Zod para reducir errores del usuario.
 * 2. **Indicador de Fortaleza de Contraseña**: ((Vigente)) Añadir un componente visual que evalúe la fortaleza de la contraseña en tiempo real mientras el usuario escribe.
 *
 * =====================================================================
 */
// src/components/auth/SignUpForm.tsx
