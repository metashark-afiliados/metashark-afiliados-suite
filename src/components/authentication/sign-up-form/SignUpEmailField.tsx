// src/components/authentication/sign-up-form/SignUpEmailField.tsx
/**
 * @file SignUpEmailField.tsx
 * @description Aparato de UI atómico y de presentación 100% puro. Renderiza el
 *              campo de email, recibiendo todo su contenido y estado vía props,
 *              e integrando un icono para una UX de élite.
 * @author L.I.A. Legacy & RaZ WriTe (Arquitecto)
 * @version 2.0.0
 * @see .docs-espejo/components/authentication/sign-up-form/SignUpEmailField.tsx.md
 */
"use client";

import { type FieldErrors, type UseFormRegister } from "react-hook-form";
import { Mail } from "lucide-react";
import { type z } from "zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clientLogger } from "@/lib/logger";
import { type SignUpSchema } from "@/lib/validators";

type FormData = z.infer<typeof SignUpSchema>;

export interface SignUpEmailFieldProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  isPending: boolean;
  label: string;
  placeholder: string;
  errorMessage?: string;
}

/**
 * @public
 * @component SignUpEmailField
 * @description Renderiza el campo de email. Es un componente controlado y puro.
 * @param {SignUpEmailFieldProps} props - Propiedades para conectar con el formulario.
 * @returns {React.ReactElement}
 */
export function SignUpEmailField({
  register,
  errors,
  isPending,
  label,
  placeholder,
  errorMessage,
}: SignUpEmailFieldProps): React.ReactElement {
  clientLogger.trace(
    "[SignUpEmailField] Renderizando componente de campo de email puro."
  );

  return (
    <div className="space-y-1">
      <Label htmlFor="email">{label}</Label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="email"
          type="email"
          placeholder={placeholder}
          autoComplete="email"
          disabled={isPending}
          aria-invalid={!!errors.email}
          className="pl-9"
          {...register("email")}
          hasError={!!errors.email}
        />
      </div>
      {errorMessage && (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
// src/components/authentication/sign-up-form/SignUpEmailField.tsx