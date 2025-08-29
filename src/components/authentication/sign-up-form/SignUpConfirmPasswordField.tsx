// src/components/authentication/sign-up-form/SignUpConfirmPasswordField.tsx
/**
 * @file src/components/authentication/sign-up-form/SignUpConfirmPasswordField.tsx
 * @description Aparato de UI atómico y de presentación puro. Renderiza el campo
 *              de confirmación de contraseña, su etiqueta y el mensaje de error de
 *              validación para el formulario de registro.
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

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logging";
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
 * @description Renderiza el campo de confirmación de contraseña. Es un componente
 *              controlado que recibe su estado de `react-hook-form`.
 * @param {SignUpConfirmPasswordFieldProps} props - Propiedades para conectar con el formulario padre.
 * @returns {React.ReactElement}
 */
export function SignUpConfirmPasswordField({
  register,
  errors,
  isPending,
}: SignUpConfirmPasswordFieldProps): React.ReactElement {
  const t = useTranslations("app.[locale].signup.page");
  const tErrors = useTypedTranslations("shared.ValidationErrors");

  clientLogger.trace(
    "[SignUpConfirmPasswordField] Renderizando componente de campo de confirmación de contraseña."
  );

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
 * @author Raz Podestá - MetaShark Tech
 * @version 2.1.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @section Melhorias Futuras
 * 1. ((Vigente)) **Feedback Visual de Coincidencia en Tiempo Real:** Implementar una lógica que observe el valor de este campo y el del campo de contraseña principal. Cuando coincidan, mostrar un icono `Check` verde junto al campo y aplicar un borde verde. Si no coinciden después de que el campo pierda el foco (`onBlur`), mostrar un icono `X` y un borde rojo. Esta es una mejora de UX de alto impacto.
 * 2. ((Vigente)) **Conmutador de Visibilidad:** Al igual que el campo de contraseña principal, añadir un icono de "ojo" para alternar la visibilidad del texto.
 *
 * =====================================================================
 */
// src/components/authentication/sign-up-form/SignUpConfirmPasswordField.tsx
