// src/components/auth/SignUpForm.tsx
/**
 * @file src/components/auth/SignUpForm.tsx
 * @description Formulario de cliente soberano para el registro. Reconstruido
 *              a un estándar de élite para desacoplar `react-hook-form` de la
 *              invocación de la Server Action, resolviendo errores de entorno.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";

import React, { useTransition } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { type z } from "zod";

import { signUpAction } from "@/lib/actions/auth.actions";
import { SignUpSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormData = z.infer<typeof SignUpSchema>;

function SubmitButton({ isPending }: { isPending: boolean }) {
  const t = useTranslations("SignUpPage");
  return (
    <Button type="submit" className="w-full" disabled={isPending}>
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isPending ? t("signUpButton_pending") : t("signUpButton")}
    </Button>
  );
}

export function SignUpForm(): React.ReactElement {
  const t = useTranslations("SignUpPage");
  const tErrors = useTranslations("ValidationErrors");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(SignUpSchema),
    mode: "onTouched",
  });

  const processSubmit: SubmitHandler<FormData> = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    startTransition(async () => {
      const result = await signUpAction(null, formData);
      if (result && !result.success) {
        toast.error(
          tErrors(result.error as any, { defaultValue: result.error })
        );
      }
      // El éxito es manejado por la redirección, no se necesita un toast.
    });
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t("email_label")}</Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          {...register("email")}
          disabled={isPending}
        />
        {errors.email && (
          <p className="text-sm text-destructive">
            {tErrors(errors.email.message as any)}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{t("password_label")}</Label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          disabled={isPending}
        />
        {errors.password && (
          <p className="text-sm text-destructive">
            {tErrors(errors.password.message as any)}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t("confirm_password_label")}</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          disabled={isPending}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {tErrors(errors.confirmPassword.message as any)}
          </p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          {...register("termsAccepted")}
          disabled={isPending}
        />
        <Label htmlFor="terms">{t("terms_label")}</Label>
      </div>
      {errors.termsAccepted && (
        <p className="text-sm text-destructive">
          {tErrors(errors.termsAccepted.message as any)}
        </p>
      )}
      <SubmitButton isPending={isPending} />
    </form>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Runtime**: ((Implementada)) ((Vigente)) Se ha eliminado la dependencia de `useFormState`, resolviendo el `TypeError` y estabilizando el componente.
 * 2. **Patrón de Formulario Soberano**: ((Implementada)) ((Vigente)) La nueva implementación es un ejemplo canónico de cómo integrar `react-hook-form` con Server Actions, aumentando la robustez y mantenibilidad.
 *
 * =====================================================================
 */
// src/components/auth/SignUpForm.tsx
