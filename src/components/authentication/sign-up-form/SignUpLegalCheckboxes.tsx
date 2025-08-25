// src/components/authentication/sign-up-form/SignUpLegalCheckboxes.tsx
/**
 * @file SignUpLegalCheckboxes.tsx
 * @description Aparato de UI atómico y de presentación puro. Encapsula los
 *              checkboxes de consentimiento legal y de marketing. Ha sido
 *              refactorizado para consumir el namespace de i18n canónico.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { type Control, Controller, type FieldErrors } from "react-hook-form";
import { useTranslations } from "next-intl";
import { type z } from "zod";

import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/label";
import { SmartLink } from "@/components/ui/SmartLink";
import { type SignUpSchema } from "@/lib/validators";

type FormData = z.infer<typeof SignUpSchema>;

export interface SignUpLegalCheckboxesProps {
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  isPending: boolean;
}

/**
 * @public
 * @component SignUpLegalCheckboxes
 * @description Renderiza los checkboxes para términos y newsletter.
 * @param {SignUpLegalCheckboxesProps} props - Propiedades para conectar con react-hook-form.
 * @returns {React.ReactElement}
 */
export function SignUpLegalCheckboxes({
  control,
  errors,
  isPending,
}: SignUpLegalCheckboxesProps): React.ReactElement {
  const t = useTranslations("app.[locale].signup.page");
  const tErrors = useTranslations("shared.ValidationErrors");

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
            />
          )}
        />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t.rich("legalNotice", {
              terms: (chunks) => (
                <SmartLink href="/terms" label={chunks} className="underline" />
              ),
              privacy: (chunks) => (
                <SmartLink
                  href="/privacy"
                  label={chunks}
                  className="underline"
                />
              ),
            })}
          </Label>
          {errors.termsAccepted && (
            <p className="text-sm text-destructive" role="alert">
              {tErrors(errors.termsAccepted.message as any)}
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
          {t("newsletter_label")}
        </Label>
      </div>
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
 *
 * @subsection Melhorias Futuras
 * 1. **Feedback Visual de Error**: ((Vigente)) El texto del `Label` para los términos podría volverse rojo si `errors.termsAccepted` existe, proporcionando un feedback visual más claro.
 *
 * =====================================================================
 */