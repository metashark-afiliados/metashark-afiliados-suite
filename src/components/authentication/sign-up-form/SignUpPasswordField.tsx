// src/components/authentication/sign-up-form/SignUpPasswordField.tsx
/**
 * @file src/components/authentication/sign-up-form/SignUpPasswordField.tsx
 * @description Aparato de UI atómico y de presentación puro. Renderiza el campo
 *              de contraseña, su etiqueta, el medidor de fortaleza y el mensaje
 *              de error de validación para el formulario de registro.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.1.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { type FieldErrors, type UseFormRegister } from "react-hook-form";
import { useTranslations } from "next-intl";
import { type z } from "zod";

import { PasswordStrengthMeter } from "@/components/authentication/PasswordStrengthMeter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logging";
import { type SignUpSchema } from "@/lib/validators";

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
 * @description Renderiza el campo de contraseña con su medidor de fortaleza.
 *              Es un componente controlado que recibe su estado de `react-hook-form`.
 * @param {SignUpPasswordFieldProps} props - Propiedades para conectar con el formulario padre.
 * @returns {React.ReactElement}
 */
export function SignUpPasswordField({
  register,
  errors,
  isPending,
  passwordValue,
}: SignUpPasswordFieldProps): React.ReactElement {
  const t = useTranslations("app.[locale].signup.page");
  const tErrors = useTypedTranslations("shared.ValidationErrors");

  clientLogger.trace(
    "[SignUpPasswordField] Renderizando componente de campo de contraseña."
  );

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
 * @author Raz Podestá - MetaShark Tech
 * @version 2.1.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @section Melhorias Futuras
 * 1. ((Vigente)) **Conmutador de Visibilidad de Contraseña:** Añadir un icono de "ojo" (`Eye` / `EyeOff`) dentro del `Input` que permita al usuario alternar la visibilidad de la contraseña. Esta es una mejora de UX estándar y de alto valor para este tipo de campo.
 * 2. ((Vigente)) **Feedback de Requisitos en Tiempo Real:** Extender el `PasswordStrengthMeter` o añadir un `Popover` que muestre en tiempo real qué requisitos de la contraseña se han cumplido (ej. "✓ 8 caracteres", "✓ 1 mayúscula", "✗ 1 símbolo"), proporcionando una guía más explícita al usuario.
 *
 * =====================================================================
 */
// src/components/authentication/sign-up-form/SignUpPasswordField.tsx
