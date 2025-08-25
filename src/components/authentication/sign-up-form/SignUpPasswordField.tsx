// src/components/authentication/sign-up-form/SignUpPasswordField.tsx
/**
 * @file SignUpPasswordField.tsx
 * @description Aparato de UI atómico y de presentación puro. Encapsula el
 *              campo de entrada de contraseña y el medidor de fortaleza.
 * @author Raz Podestá - MetaShark Tech, Florianópolis/SC, Brazil, raz.metashark.tech
 * @version 1.0.1
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
  const t = useTranslations("pages.SignUpPage");
  // --- INICIO DE REFACTORIZACIÓN: Namespace Canónico ---
  const tErrors = useTranslations("shared.ValidationErrors");
  // --- FIN DE REFACTORIZACIÓN ---

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
 * 1. **Resolución de `MISSING_MESSAGE`**: ((Implementada)) Se ha corregido el namespace de `useTranslations` a `"shared.ValidationErrors"`. Esta es una corrección de élite que resuelve la causa raíz de los errores `MISSING_MESSAGE` para este namespace, alineando el componente con la arquitectura IMAS y los schemas de Zod.
 *
 * @subsection Melhorias Futuras
 * 1. **Toggle de Visibilidad**: ((Vigente)) Añadir un icono de "ojo" dentro del `Input` que permita al usuario alternar la visibilidad de la contraseña, una mejora de UX estándar en la industria.
 *
 * =====================================================================
 */
