// src/components/authentication/sign-up-form/SignUpLegalCheckboxes.tsx
/**
 * @file src/components/authentication/sign-up-form/SignUpLegalCheckboxes.tsx
 * @description Aparato de UI atómico y de presentación puro. Renderiza los
 *              checkboxes de consentimiento legal y suscripción opcional, recibiendo
 *              todo su contenido y estado a través de props.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 2.0.0
 */
"use client";

import React from "react";
import { type Control, Controller, type FieldErrors } from "react-hook-form";
import { type z } from "zod";

import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/label";
import { RichText } from "@/components/ui/RichText";
import { clientLogger } from "@/lib/logger";
import { type SignUpSchema } from "@/lib/validators";

type FormData = z.infer<typeof SignUpSchema>;

/**
 * @public
 * @interface SignUpLegalCheckboxesProps
 * @description El contrato de props para el componente de checkboxes legales.
 *              Define todas las dependencias de `react-hook-form` y los textos
 *              requeridos para una renderización pura.
 */
export interface SignUpLegalCheckboxesProps {
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  isPending: boolean;
  texts: {
    legalNotice: React.ReactNode;
    newsletterLabel: string;
  };
  errorMessage?: string;
}

/**
 * @public
 * @component SignUpLegalCheckboxes
 * @description Renderiza los checkboxes de consentimiento legal. Es un componente
 *              controlado y puro que utiliza el patrón `Controller`.
 * @param {SignUpLegalCheckboxesProps} props - Propiedades para conectar con el formulario.
 * @returns {React.ReactElement}
 */
export function SignUpLegalCheckboxes({
  control,
  errors,
  isPending,
  texts,
  errorMessage,
}: SignUpLegalCheckboxesProps): React.ReactElement {
  clientLogger.trace("[SignUpLegalCheckboxes] Renderizando componente puro.", {
    component: "SignUpLegalCheckboxes",
  });

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-start space-x-2">
        <Controller
          name="termsAccepted"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="terms"
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isPending}
              aria-invalid={!!errors.termsAccepted}
              hasError={!!errors.termsAccepted}
            />
          )}
        />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <RichText>{texts.legalNotice}</RichText>
          </Label>
          {errorMessage && (
            <p className="text-sm text-destructive" role="alert">
              {errorMessage}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-start space-x-2">
        <Controller
          name="newsletterSubscribed"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="newsletter"
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isPending}
            />
          )}
        />
        <Label
          htmlFor="newsletter"
          className="text-sm font-medium leading-none"
        >
          {texts.newsletterLabel}
        </Label>
      </div>
    </div>
  );
}
// src/components/authentication/sign-up-form/SignUpLegalCheckboxes.tsx
