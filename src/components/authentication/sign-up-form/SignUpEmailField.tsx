// src/components/authentication/sign-up-form/SignUpEmailField.tsx
/**
 * @file src/components/authentication/sign-up-form/SignUpEmailField.tsx
 * @description Aparato de UI atómico y de presentación puro. Su única responsabilidad
 *              es renderizar el campo de entrada de email, su etiqueta, y el mensaje
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

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logging";
import { type SignUpSchema } from "@/lib/validators";

type FormData = z.infer<typeof SignUpSchema>;

export interface SignUpEmailFieldProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  isPending: boolean;
}

/**
 * @public
 * @component SignUpEmailField
 * @description Renderiza el campo de email con su etiqueta y mensaje de error.
 *              Es un componente controlado que recibe su estado de `react-hook-form`.
 * @param {SignUpEmailFieldProps} props - Propiedades para conectar con el formulario padre.
 * @returns {React.ReactElement}
 */
export function SignUpEmailField({
  register,
  errors,
  isPending,
}: SignUpEmailFieldProps): React.ReactElement {
  const t = useTranslations("app.[locale].signup.page");
  const tErrors = useTypedTranslations("shared.ValidationErrors");

  clientLogger.trace(
    "[SignUpEmailField] Renderizando componente de campo de email."
  );

  return (
    <div className="space-y-1">
      <Label htmlFor="email">{t("email_label")}</Label>
      <Input
        id="email"
        type="email"
        autoComplete="email"
        disabled={isPending}
        aria-invalid={!!errors.email}
        {...register("email")}
        hasError={!!errors.email}
      />
      {errors.email && (
        <p className="text-sm text-destructive" role="alert">
          {tErrors(errors.email.message as any)}
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
 * 1. ((Vigente)) **Icono de Estado de Validación:** Añadir un icono de `Check` o `AlertTriangle` dentro del `Input` para proporcionar un feedback visual instantáneo sobre la validez del email, cambiando dinámicamente al validar el campo `onBlur`.
 * 2. ((Vigente)) **Sugerencias de Dominio:** Para errores de tipeo comunes en dominios (ej. `gmal.com`), se podría integrar una librería ligera que sugiera la corrección ("¿Quisiste decir gmail.com?"), mejorando la tasa de éxito del registro.
 *
 * =====================================================================
 */
// src/components/authentication/sign-up-form/SignUpEmailField.tsx
