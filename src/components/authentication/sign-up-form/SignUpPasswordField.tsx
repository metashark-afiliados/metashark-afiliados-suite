// src/components/authentication/sign-up-form/SignUpPasswordField.tsx
/**
 * @file SignUpPasswordField.tsx
 * @description Aparato de UI atómico y de presentación puro. Encapsula el
 *              campo de entrada de contraseña y el medidor de fortaleza. Ha sido
 *              refactorizado para consumir el namespace de i18n canónico y
 *              para integrarse con el sistema de feedback visual de errores.
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
import { PasswordStrengthMeter } from "../PasswordStrengthMeter";

type FormData = z.infer<typeof SignUpSchema>;

export interface SignUpPasswordFieldProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  isPending: boolean;
  passwordValue: string;
}

/**
 * @public
 * @component SignUpPasswordField
 * @description Renderiza el campo de contraseña con su etiqueta, medidor de
 *              fortaleza y mensaje de error.
 * @param {SignUpPasswordFieldProps} props - Propiedades para conectar con react-hook-form.
 * @returns {React.ReactElement}
 */
export function SignUpPasswordField({
  register,
  errors,
  isPending,
  passwordValue,
}: SignUpPasswordFieldProps): React.ReactElement {
  const t = useTranslations("app.[locale].signup.page");
  const tErrors = useTranslations("shared.ValidationErrors");

  return (
    <div className="space-y-1">
      <Label htmlFor="password">{t("password_label")}</Label>
      <Input
        id="password"
        type="password"
        autoComplete="new-password"
        disabled={isPending}
        aria-invalid={!!errors.password}
        {...register("password")}
        hasError={!!errors.password}
      />
      <PasswordStrengthMeter password={passwordValue} />
      {errors.password && (
        <p className="text-sm text-destructive" role="alert">
          {tErrors(errors.password.message as any)}
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
 * 1. **Resolución de `MISSING_MESSAGE`**: ((Implementada)) Se ha corregido la llamada a `useTranslations` para los mensajes de error, apuntando al namespace canónico `"shared.ValidationErrors"`. Esto resuelve la causa raíz del error de build para este componente.
 * 2. **Feedback Visual de Error**: ((Implementada)) Se ha añadido la prop `hasError={!!errors.password}` al componente `Input`, integrándolo con el sistema de estilos de validación de élite.
 *
 * @subsection Melhorias Futuras
 * 1. **Toggle de Visibilidad**: ((Vigente)) Añadir un icono de "ojo" dentro del `Input` que permita al usuario alternar la visibilidad de la contraseña, una mejora de UX estándar en la industria.
 *
 * =====================================================================
 */
