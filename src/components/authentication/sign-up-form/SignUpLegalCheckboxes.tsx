// src/components/authentication/sign-up-form/SignUpLegalCheckboxes.tsx
/**
 * @file src/components/authentication/sign-up-form/SignUpLegalCheckboxes.tsx
 * @description Aparato de UI atómico y de presentación puro. Renderiza los
 *              checkboxes para la aceptación de términos y la suscripción al
 *              boletín, utilizando el patrón `Controller` para una integración
 *              de élite con `react-hook-form`.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.1.0
 * @date 2025-08-29
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
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logging";
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
 * @description Renderiza los checkboxes de consentimiento legal. Utiliza el
 *              componente `Controller` de react-hook-form, que es el patrón
 *              canónico para integrar componentes de UI controlados (como
 *              nuestro `Checkbox` de Shadcn) en el ecosistema del formulario.
 * @param {SignUpLegalCheckboxesProps} props - Propiedades para conectar con el formulario padre.
 * @returns {React.ReactElement}
 */
export function SignUpLegalCheckboxes({
  control,
  errors,
  isPending,
}: SignUpLegalCheckboxesProps): React.ReactElement {
  const t = useTranslations("app.[locale].signup.page");
  const tErrors = useTypedTranslations("shared.ValidationErrors");

  clientLogger.trace(
    "[SignUpLegalCheckboxes] Renderizando componente de checkboxes."
  );

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
 * @author Raz Podestá - MetaShark Tech
 * @version 2.1.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @section Melhorias Futuras
 * 1. ((Vigente)) **Feedback Visual de Error en Checkbox:** El componente `Checkbox` subyacente (`@/components/ui/Checkbox.tsx`) podría ser mejorado para aceptar una prop `hasError: boolean`. Si es `true`, podría aplicar un estilo visual de error (ej., un borde rojo o un anillo) para indicar más claramente qué campo requiere atención.
 *
 * =====================================================================
 */
// src/components/authentication/sign-up-form/SignUpLegalCheckboxes.tsx
