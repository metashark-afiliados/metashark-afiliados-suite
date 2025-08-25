// src/components/authentication/sign-up-form/SignUpEmailField.tsx
/**
 * @file SignUpEmailField.tsx
 * @description Aparato de UI atómico y de presentación puro. Encapsula el
 *              campo de entrada de email para el formulario de registro.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { type FieldErrors, type UseFormRegister } from "react-hook-form";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type SignUpSchema } from "@/lib/validators";
import { type z } from "zod";

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
 * @param {SignUpEmailFieldProps} props - Propiedades para conectar con react-hook-form.
 * @returns {React.ReactElement}
 */
export function SignUpEmailField({
  register,
  errors,
  isPending,
}: SignUpEmailFieldProps): React.ReactElement {
  const t = useTranslations("pages.SignUpPage");
  const tErrors = useTranslations("ValidationErrors");

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
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este componente tiene la única responsabilidad de renderizar el campo de email, cumpliendo con la "Filosofía LEGO".
 * 2. **Componente Puro y Controlado**: ((Implementada)) Es 100% agnóstico a la lógica de negocio, recibiendo todo su estado y manejadores a través de props.
 *
 * @subsection Melhorias Futuras
 * 1. **Icono de Estado de Validación**: ((Vigente)) Se podría añadir un icono de `Check` o `X` dentro del input para proporcionar un feedback visual instantáneo sobre la validez del email.
 *
 * =====================================================================
 */
// src/components/authentication/sign-up-form/SignUpEmailField.tsx
