// src/app/[locale]/reset-password/page.tsx
/**
 * @file src/app/[locale]/reset-password/page.tsx
 * @description Página y formulario para restablecer la contraseña. Refactorizado a un
 *              estándar de élite, consumiendo el componente soberano `PasswordStrengthMeter`
 *              y resolviendo la cascada de errores de contrato TS2305 y TS2322.
 * @author L.I.A. Legacy
 * @version 6.0.0
 * @see .docs-espejo/app/[locale]/reset-password/page.tsx.md
 */
"use client";

import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import toast from "react-hot-toast";

import { PasswordStrengthMeter } from "@/components/authentication/PasswordStrengthMeter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePasswordAction } from "@/lib/actions/password.actions";
import { useCountdownRedirect } from "@/lib/hooks/use-countdown-redirect";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logger";
import { useRouter } from "@/lib/navigation";
import {
  type ActionResult,
  isActionError,
  isActionSuccess,
  type ValidationErrorKey,
} from "@/lib/validators";

type UpdatePasswordFormState = ActionResult<{ messageKey: ValidationErrorKey }>;

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTypedTranslations("pages.ResetPasswordPage");
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {t("submitButton")}
    </Button>
  );
}

export default function ResetPasswordPage(): React.ReactElement {
  clientLogger.trace("[ResetPasswordPage] Renderizando página.");
  const tPage = useTypedTranslations("pages.ResetPasswordPage");
  const tErrors = useTypedTranslations("shared.ValidationErrors");
  const router = useRouter();
  const [password, setPassword] = useState("");

  const [state, formAction] = useFormState<
    UpdatePasswordFormState | null,
    FormData
  >(updatePasswordAction, null);

  const [redirectEnabled, setRedirectEnabled] = useState(false);
  const REDIRECT_DELAY_SECONDS = 5;

  useCountdownRedirect(REDIRECT_DELAY_SECONDS, () => {
    if (redirectEnabled) {
      router.push("/login");
    }
  });

  useEffect(() => {
    clientLogger.trace("[ResetPasswordPage] El estado de la acción cambió.", {
      state,
    });
    if (isActionError(state)) {
      const errorMessage = tErrors(state.error, {
        defaultValue: state.error,
      });
      toast.error(errorMessage);
    }
    if (isActionSuccess(state)) {
      const successMessage = tErrors(state.data.messageKey, {
        redirectDelay: REDIRECT_DELAY_SECONDS,
      });
      toast.success(successMessage);
      setRedirectEnabled(true);
    }
  }, [state, tErrors, router]);

  return (
    <div className="w-full max-w-md">
      <Card className="border-border/60 bg-card/50 backdrop-blur-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{tPage("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="password">{tPage("newPasswordLabel")}</Label>
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
                {tPage("confirmPasswordLabel")}
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
// src/app/[locale]/reset-password/page.tsx
