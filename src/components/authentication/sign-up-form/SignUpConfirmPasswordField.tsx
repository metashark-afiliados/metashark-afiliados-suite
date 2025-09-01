// src/components/authentication/sign-up-form/SignUpConfirmPasswordField.tsx
/**
 * @file src/components/authentication/sign-up-form/SignUpConfirmPasswordField.tsx
 * @description Aparato de UI atómico y de presentación puro. Renderiza el campo
 *              de confirmación de contraseña, incluyendo la funcionalidad de
 *              visualización ("ojo").
 * @author L.I.A. Legacy & RaZ WriTe (Arquitecto)
 * @version 1.0.0
 * @see .docs-espejo/components/authentication/sign-up-form/SignUpConfirmPasswordField.tsx.md
 */
"use client";

import React, { useState } from "react";
import { type FieldErrors, type UseFormRegister } from "react-hook-form";
import { Eye, EyeOff, Lock } from "lucide-react";
import { type z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clientLogger } from "@/lib/logger";
import { type SignUpSchema } from "@/lib/validators";
import { cn } from "@/lib/utils";

type FormData = z.infer<typeof SignUpSchema>;

export interface SignUpConfirmPasswordFieldProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  isPending: boolean;
  label: string;
  errorMessage?: string;
}

/**
 * @public
 * @component SignUpConfirmPasswordField
 * @description Renderiza el campo de confirmación de contraseña con
 *              funcionalidad de visualización. Es un componente controlado y puro.
 * @param {SignUpConfirmPasswordFieldProps} props - Propiedades para conectar con el formulario.
 * @returns {React.ReactElement}
 */
export function SignUpConfirmPasswordField({
  register,
  errors,
  isPending,
  label,
  errorMessage,
}: SignUpConfirmPasswordFieldProps): React.ReactElement {
  clientLogger.trace(
    "[SignUpConfirmPasswordField] Renderizando componente de campo de confirmação de senha puro."
  );
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className="space-y-1">
      <Label htmlFor="confirmPassword">{label}</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          disabled={isPending}
          aria-invalid={!!errors.confirmPassword}
          className="pl-9 pr-10"
          {...register("confirmPassword")}
          hasError={!!errors.confirmPassword}
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
      {errorMessage && (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
// src/components/authentication/sign-up-form/SignUpConfirmPasswordField.tsx
