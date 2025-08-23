// src/components/authentication/sign-up-form.tsx
/**
 * @file sign-up-form.tsx
 * @description Formulario de cliente soberano para el registro. Alineado con la
 *              arquitectura de ConvertiKit, consume las Server Actions y validadores
 *              canónicos del proyecto. Actualizado para importar sus dependencias
 *              atómicas desde el directorio canónico.
 * @author Raz Podestá
 * @version 4.1.0
 */
"use client";

import React, { useTransition } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { type z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SmartLink } from "@/components/ui/SmartLink";
import { signUpAction } from "@/lib/actions/auth.actions";
import { SignUpSchema } from "@/lib/validators";
// --- INICIO DE CORRECCIÓN DE RUTA DE IMPORTACIÓN ---
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";
// --- FIN DE CORRECCIÓN DE RUTA DE IMPORTACIÓN ---

type FormData = z.infer<typeof SignUpSchema>;

export function SignupForm() {
  const t = useTranslations("SignUpPage");
  const tErrors = useTranslations("ValidationErrors");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(SignUpSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
      newsletterSubscribed: false,
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
      if (result && !result.success) {
        toast.error(tErrors(result.error as any));
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(processSubmit)}
      className={"px-6 md:px-16 pb-6 py-8 gap-4 flex flex-col"}
    >
      <div
        className={
          "text-[30px] leading-[36px] font-medium tracking-[-0.6px] text-center"
        }
      >
        {t("title")}
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">{t("email_label")}</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          disabled={isPending}
        />
        {errors.email && (
          <p className="text-sm text-destructive">
            {tErrors(errors.email.message as any)}
          </p>
        )}
      </div>

      <div className="space-y-1">
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

      <PasswordStrengthMeter password={passwordValue} />

      <div className="space-y-1">
        <Label htmlFor="confirmPassword">{t("confirm_password_label")}</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          disabled={isPending}
          onPaste={(e: React.ClipboardEvent) => e.preventDefault()}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {tErrors(errors.confirmPassword.message as any)}
          </p>
        )}
      </div>

      <div className="space-y-2 pt-2">
        <div className="flex items-start space-x-2">
          <Checkbox id="terms" {...register("termsAccepted")} />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t.rich("legalNotice", {
                terms: (chunks) => (
                  <SmartLink
                    href="/terms"
                    label={chunks}
                    className="underline"
                  />
                ),
                privacy: (chunks) => (
                  <SmartLink
                    href="/privacy"
                    label={chunks}
                    className="underline"
                  />
                ),
              })}
            </Label>
          </div>
        </div>
        {errors.termsAccepted && (
          <p className="text-sm text-destructive">
            {tErrors(errors.termsAccepted.message as any)}
          </p>
        )}
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox id="newsletter" {...register("newsletterSubscribed")} />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor="newsletter"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t("newsletter_label")}
          </Label>
        </div>
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isPending ? t("signUpButton_pending") : t("signUpButton")}
      </Button>
    </form>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Dependencia**: ((Implementada)) Se ha corregido la ruta de importación de `PasswordStrengthMeter` para que apunte a la nueva ubicación canónica, resolviendo uno de los errores de compilación `TS2307`.
 *
 * @subsection Melhorias Futuras
 * 1. **Abstracción de `SubmitButton`**: ((Vigente)) La lógica del botón de envío con estado de carga es un patrón repetido. Podría ser abstraído a un componente `SubmitButton` atómico para mayor reutilización y cumplimiento del principio DRY.
 *
 * =====================================================================
 */
// src/components/authentication/sign-up-form.tsx
