// src/components/authentication/sign-up-form/SignUpEmailField.tsx
/**
 * @file SignUpEmailField.tsx
 * @description Aparato de UI atómico y de presentación puro. Encapsula el
 *              campo de entrada de email para el formulario de registro. Ha sido
 *              refactorizado para consumir el namespace de i18n canónico,
 *              resolviendo un error crítico de build `MISSING_MESSAGE`.
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
  const t = useTranslations("app.[locale].signup.page");
  const tErrors = useTranslations("shared.ValidationErrors");

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
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de `MISSING_MESSAGE`**: ((Implementada)) Se ha corregido la llamada a `useTranslations` para los mensajes de error, apuntando al namespace canónico `"shared.ValidationErrors"`. Esto resuelve la causa raíz del error de build para este componente.
 * 2. **Feedback Visual de Error**: ((Implementada)) Se ha añadido la prop `hasError={!!errors.email}` al componente `Input`, integrándolo con el sistema de estilos de validación de élite.
 *
 * @subsection Melhorias Futuras
 * 1. **Icono de Estado de Validación**: ((Vigente)) Se podría añadir un icono de `Check` o `X` dentro del input para proporcionar un feedback visual instantáneo sobre la validez del email.
 *
 * =====================================================================
 */
