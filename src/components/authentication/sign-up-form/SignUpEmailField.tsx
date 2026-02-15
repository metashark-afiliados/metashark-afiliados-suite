// src/components/authentication/sign-up-form/SignUpEmailField.tsx
/**
 * @file SignUpEmailField.tsx
 * @description Aparato de UI atómico y de presentación puro. Encapsula el
 *              campo de entrada de email para el formulario de registro.
 * @author Raz Podestá - MetaShark Tech, Florianópolis/SC, Brazil, raz.metashark.tech
 * @version 1.0.1
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
  // --- INICIO DE REFACTORIZACIÓN: Namespace Canónico ---
  const tErrors = useTranslations("shared.ValidationErrors");
  // --- FIN DE REFACTORIZACIÓN ---

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
 * 1. **Resolución de `MISSING_MESSAGE`**: ((Implementada)) Se ha corregido el namespace de `useTranslations` a `"shared.ValidationErrors"`. Esta es una corrección de élite que resuelve la causa raíz de los errores `MISSING_MESSAGE` para este namespace, alineando el componente con la arquitectura IMAS y los schemas de Zod.
 *
 * @subsection Melhorias Futuras
 * 1. **Icono de Estado de Validación**: ((Vigente)) Se podría añadir un icono de `Check` o `X` dentro del input para proporcionar un feedback visual instantáneo sobre la validez del email.
 *
 * =====================================================================
 */
