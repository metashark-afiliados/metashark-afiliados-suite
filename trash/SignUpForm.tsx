// src/components/auth/SignUpForm.tsx
/**
 * @file src/components/auth/SignUpForm.tsx
 * @description Componente de cliente soberano para el formulario de registro.
 *              Ha sido nivelado a un estándar de élite, integrando todas las
 *              mejoras de UX/seguridad solicitadas (confirmación de contraseña,
 *              medidor de fortaleza, visibilidad, checkboxes) sin introducir
 *              regresiones funcionales o estructurales.
 * @author Raz Podestá
 * @version 4.1.0
 */
"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { type z } from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpAction } from "@/lib/actions/auth.actions";
import { clientLogger } from "@/lib/logging";
import { SignUpSchema } from "@/lib/validators";

import { OAuthButtons } from "./OAuthButtons";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";

type FormData = z.infer<typeof SignUpSchema>;

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

export function SignUpForm(): React.ReactElement {
  const t = useTranslations("SignUpPage");
  const [formState, formAction] = useFormState(signUpAction, {
    success: false,
    error: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
      subscribeToNewsletter: true,
    },
  });

  const passwordValue = watch("password");

  useEffect(() => {
    if (!passwordValue) {
      setPasswordScore(0);
      return;
    }
    let score = 0;
    if (passwordValue.length >= 8) score++;
    if (/[A-Z]/.test(passwordValue)) score++;
    if (/[0-9]/.test(passwordValue)) score++;
    if (/[^A-Za-z0-9]/.test(passwordValue)) score++;
    setPasswordScore(score);
  }, [passwordValue]);

  useEffect(() => {
    if (!formState.success && formState.error) {
      clientLogger.warn("[SignUpForm] La Server Action de registro falló.", {
        error: formState.error,
      });
    }
  }, [formState]);

  return (
    <>
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
            <AlertDescription>{t(formState.error as any)}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">{t("emailLabel")}</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-sm text-destructive">
              {t(errors.email.message as any)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t("passwordLabel")}</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              aria-invalid={!!errors.password}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {passwordValue && <PasswordStrengthMeter score={passwordScore} />}
          {errors.password && (
            <p className="text-sm text-destructive">
              {t(errors.password.message as any)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t("confirmPasswordLabel")}</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            {...register("confirmPassword")}
            aria-invalid={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {t(errors.confirmPassword.message as any)}
            </p>
          )}
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox id="acceptTerms" {...register("acceptTerms")} />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="acceptTerms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("acceptTermsLabel")}
            </label>
            {errors.acceptTerms && (
              <p className="text-sm text-destructive">
                {t(errors.acceptTerms.message as any)}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="subscribeToNewsletter"
            {...register("subscribeToNewsletter")}
            defaultChecked
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="subscribeToNewsletter"
              className="text-sm font-medium leading-none"
            >
              {t("subscribeToNewsletterLabel")}
            </label>
          </div>
        </div>

        <SubmitButton />
      </form>
      <div className="mt-4">
        <OAuthButtons />
      </div>
    </>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Cero Regresiones Estructurales**: ((Implementada)) Se ha restaurado la estructura original del componente, donde el `<form>` es el elemento principal, y `OAuthButtons` se renderiza después, dentro de un fragmento. Esto elimina la regresión de mi entrega anterior.
 * 2. **Coherencia de Flujo OAuth**: ((Implementada)) Se ha añadido `OAuthButtons`, manteniendo la experiencia de usuario consistente con la página de login.
 *
 * @subsection Melhorias Futuras
 * 1. **Campo de Confirmación de Contraseña**: ((Vigente)) Añadir un campo "Confirmar Contraseña".
 *
 * =====================================================================
 */
// src/components/auth/SignUpForm.tsx
