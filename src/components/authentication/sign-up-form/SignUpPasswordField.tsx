// src/components/authentication/sign-up-form/SignUpPasswordField.tsx
/**
 * @file src/components/authentication/sign-up-form/SignUpPasswordField.tsx
 * @description Aparato de UI atómico y de presentación puro. Renderiza el campo
 *              de contraseña, su etiqueta, medidor de fortaleza, mensaje de error
 *              y la funcionalidad de visualización ("ojo").
 * @author L.I.A. Legacy & RaZ WriTe (Arquitecto)
 * @version 2.0.0
 * @see .docs-espejo/components/authentication/sign-up-form/SignUpPasswordField.tsx.md
 */
"use client";

import React, { useState } from "react";
import { type FieldErrors, type UseFormRegister } from "react-hook-form";
import { Eye, EyeOff, Lock } from "lucide-react";
import { type z } from "zod";

import { PasswordStrengthMeter } from "@/components/authentication/PasswordStrengthMeter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clientLogger } from "@/lib/logger";
import { type SignUpSchema } from "@/lib/validators";
import { cn } from "@/lib/utils";

type FormData = z.infer<typeof SignUpSchema>;

export interface SignUpPasswordFieldProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  isPending: boolean;
  passwordValue: string;
  label: string;
  errorMessage?: string;
}

/**
 * @public
 * @component SignUpPasswordField
 * @description Renderiza el campo de contraseña con su medidor de fortaleza y
 *              funcionalidad de visualización. Es un componente controlado y puro.
 * @param {SignUpPasswordFieldProps} props - Propiedades para conectar con el formulario.
 * @returns {React.ReactElement}
 */
export function SignUpPasswordField({
  register,
  errors,
  isPending,
  passwordValue,
  label,
  errorMessage,
}: SignUpPasswordFieldProps): React.ReactElement {
  clientLogger.trace(
    "[SignUpPasswordField] Renderizando componente de campo de senha puro."
  );
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className="space-y-1">
      <Label htmlFor="password">{label}</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          disabled={isPending}
          aria-invalid={!!errors.password}
          className="pl-9 pr-10"
          {...register("password")}
          hasError={!!errors.password}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:bg-transparent"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
      <PasswordStrengthMeter password={passwordValue} />
      {errorMessage && (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
// src/components/authentication/sign-up-form/SignUpPasswordField.tsx
