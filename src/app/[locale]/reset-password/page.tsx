/**
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

import { updatePasswordAction } from "@/lib/actions/password.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordStrengthMeter } from "@/components/authentication/PasswordStrengthMeter";
import { type ActionResult, isActionError } from "@/lib/validators";
import { clientLogger } from "@/lib/logging";

/**
 * @type UpdatePasswordFormState
 * @description Define el tipo de estado para el formulario, alineado con el
 *              contrato de retorno de `updatePasswordAction`.
 */
type UpdatePasswordFormState = ActionResult<{ messageKey: string }>;

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("pages.ResetPasswordPage");
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {t("submitButton")}
    </Button>
  );
}

export default function ResetPasswordPage() {
  clientLogger.trace("[ResetPasswordPage] Renderizando página.");
  const t = useTranslations("pages.ResetPasswordPage");
  const tValidation = useTranslations("shared.ValidationErrors");
  const router = useRouter();
  const [password, setPassword] = useState("");

  const [state, formAction] = useFormState<UpdatePasswordFormState, FormData>(
    updatePasswordAction,
    { success: false, error: "" }
  );

  useEffect(() => {
    if (isActionError(state)) {
      const errorMessage = tValidation(state.error as any, {
        defaultValue: state.error,
      });
      toast.error(errorMessage);
    }
    if (state.success) {
      const successMessage = tValidation(state.data.messageKey as any);
      toast.success(successMessage);
      setTimeout(() => router.push("/login"), 3000);
    }
  }, [state, router, tValidation]);

  return (
    <div className="w-full max-w-md">
      <Card className="border-border/60 bg-card/50 backdrop-blur-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="password">{t("newPasswordLabel")}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <PasswordStrengthMeter password={password} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">
                {t("confirmPasswordLabel")}
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-1"
              />
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Feedback de Requisitos en Tiempo Real**: ((Vigente)) Además del medidor de fortaleza, se podría añadir un `Popover` que muestre en tiempo real qué requisitos se han cumplido (ej. "✓ 8 caracteres", "✗ Una mayúscula") para una UX de élite.
 * 2. **Desacoplamiento con `react-hook-form`**: ((Vigente)) Migrar este formulario a `react-hook-form` con `zodResolver` proporcionaría validación del lado del cliente en tiempo real y una gestión de estado más robusta, alineándolo con el formulario de registro.
 *
 * =====================================================================
 */
