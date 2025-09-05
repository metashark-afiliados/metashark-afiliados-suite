// src/app/[locale]/forgot-password/page.tsx
/**
 * @file src/app/[locale]/forgot-password/page.tsx
 * @description Página y formulario para solicitar la recuperación de contraseña.
 *              Refactorizado a un estándar de élite, utilizando `null` como
 *              estado inicial para `useFormState` y guardianes de tipo para un
 *              manejo de errores robusto, resolviendo el error TS2322.
 * @author L.I.A. Legacy
 * @version 3.0.0
 * @see .docs-espejo/app/[locale]/forgot-password/page.tsx.md
 */
"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordResetAction } from "@/lib/actions/password.actions";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import {
  type ActionResult,
  isActionError,
  type ValidationErrorKey,
} from "@/lib/validators";

type RequestPasswordResetState = ActionResult<null, ValidationErrorKey>;

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("pages.ForgotPasswordPage");
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? t("sendingButton") : t("submitButton")}
    </Button>
  );
}

export default function ForgotPasswordPage() {
  const t = useTranslations("pages.ForgotPasswordPage");
  const tErrors = useTypedTranslations("shared.ValidationErrors");

  const [state, formAction] = useFormState<
    RequestPasswordResetState | null,
    FormData
  >(requestPasswordResetAction, null);

  useEffect(() => {
    if (isActionError(state)) {
      const errorMessage = tErrors(state.error, {
        defaultValue: "An unexpected error occurred.",
      });
      toast.error(errorMessage);
    }
  }, [state, tErrors]);

  return (
    <div className="w-full max-w-md">
      <Card className="border-border/60 bg-card/50 backdrop-blur-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="email">{t("emailLabel")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
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
// src/app/[locale]/forgot-password/page.tsx
