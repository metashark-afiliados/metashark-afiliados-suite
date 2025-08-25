// src/components/authentication/sign--up-form/SignUpConfirmPasswordField.tsx
/**
 * @file SignUpConfirmPasswordField.tsx
 * @description Aparato de UI atómico y de presentación puro. Encapsula el
 *              campo de confirmación de contraseña, incluyendo la lógica para
 *              prevenir el pegado de texto.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
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
  const t = useTranslations("pages.SignUpPage");
  const tErrors = useTranslations("ValidationErrors");

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
 * 1. **Encapsulamiento de Regla de Negocio**: ((Implementada)) La lógica `onPaste={(e) => e.preventDefault()}` está ahora contenida dentro de este componente atómico, asegurando que la regla se aplique consistentemente.
 *
 * @subsection Melhorias Futuras
 * 1. **Feedback Visual en Tiempo Real**: ((Vigente)) Se podría añadir un icono de estado que se vuelva verde cuando el valor de este campo coincida con el campo de contraseña, proporcionando un feedback de UX instantáneo.
 *
 * =====================================================================
 */
// src/components/authentication/sign-up-form/SignUpConfirmPasswordField.tsx
