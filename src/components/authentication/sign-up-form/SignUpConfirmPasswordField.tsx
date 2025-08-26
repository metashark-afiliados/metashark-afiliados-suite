// src/components/authentication/sign-up-form/SignUpConfirmPasswordField.tsx
/**
 * @file SignUpConfirmPasswordField.tsx
 * @description Aparato de UI atómico y de presentación puro. Encapsula el
 *              campo de confirmación de contraseña, incluyendo la lógica para
 *              prevenir el pegado de texto. Ha sido refactorizado para consumir
 *              el namespace de i18n canónico y para integrarse con el sistema
 *              de feedback visual de errores.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { type FieldErrors, type UseFormRegister } from "react-hook-form";
import { useTranslations } from "next-intl";
import { type z } from "zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type SignUpSchema } from "@/lib/validators";

type FormData = z.infer<typeof SignUpSchema>;

export interface SignUpConfirmPasswordFieldProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  isPending: boolean;
}

/**
 * @public
 * @component SignUpConfirmPasswordField
 * @description Renderiza el campo de confirmación de contraseña.
 * @param {SignUpConfirmPasswordFieldProps} props - Propiedades para conectar con react-hook-form.
 * @returns {React.ReactElement}
 */
export function SignUpConfirmPasswordField({
  register,
  errors,
  isPending,
}: SignUpConfirmPasswordFieldProps): React.ReactElement {
  const t = useTranslations("app.[locale].signup.page");
  const tErrors = useTranslations("shared.ValidationErrors");

  return (
    <div className="space-y-1">
      <Label htmlFor="confirmPassword">{t("confirm_password_label")}</Label>
      <Input
        id="confirmPassword"
        type="password"
        autoComplete="new-password"
        disabled={isPending}
        aria-invalid={!!errors.confirmPassword}
        {...register("confirmPassword")}
        onPaste={(e) => e.preventDefault()}
        hasError={!!errors.confirmPassword}
      />
      {errors.confirmPassword && (
        <p className="text-sm text-destructive" role="alert">
          {tErrors(errors.confirmPassword.message as any)}
        </p>
      )}
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) Componente Atómico de Confirmación: Aísla la lógica y presentación del campo de confirmación, mejorando la modularidad del formulario.
 * 2. ((Implementada)) Prevención de Pegado: La inclusión de `onPaste={(e) => e.preventDefault()}` es una mejora de UX deliberada para reducir errores de usuario.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) Se podría añadir un feedback visual en tiempo real (ej. un icono de check) que aparezca cuando el valor de este campo coincida con el del campo de contraseña.
 *
 * =====================================================================
 */