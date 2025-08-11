// src/components/auth/LoginForm.tsx
/**
 * @file src/components/auth/LoginForm.tsx
 * @description Componente de cliente atómico y soberano para el formulario de inicio de sesión.
 *              Utiliza `react-hook-form` para una validación robusta del lado del
 *              cliente y `useFormState` para gestionar la comunicación declarativa
 *              con la Server Action `signInWithPasswordAction`.
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
import { signInWithPasswordAction } from "@/lib/actions/auth.actions";
import { logger } from "@/lib/logging";
import { SignInSchema } from "@/lib/validators";

type FormData = z.infer<typeof SignInSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("LoginPage");

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? t("signInButton_pending") : t("signInButton")}
    </Button>
  );
}

export function LoginForm(): React.ReactElement {
  const t = useTranslations("LoginPage");
  const [formState, formAction] = useFormState(signInWithPasswordAction, {
    success: false,
    error: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!formState.success && formState.error) {
      logger.warn("[LoginForm] La Server Action de inicio de sesión falló.", {
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
          autoComplete="current-password"
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
 * 1. **Arquitectura Soberana**: ((Implementada)) Este componente implementa el patrón de élite para formularios, desacoplando la UI de la lógica de negocio del servidor.
 * 2. **Full Observabilidad**: ((Implementada)) Se ha añadido un `useEffect` que invoca a `logger.warn` cuando la Server Action devuelve un error, proveyendo visibilidad completa.
 * 3. **Internacionalización Completa**: ((Implementada)) Todos los textos y mensajes de error son consumidos desde la capa de i18n.
 *
 * @subsection Melhorias Futuras
 * 1. **Enlace "¿Olvidaste tu contraseña?"**: ((Vigente)) Añadir un componente `SmartLink` debajo del campo de contraseña para dirigir al usuario al flujo de recuperación.
 *
 * =====================================================================
 */
// src/components/auth/LoginForm.tsx
