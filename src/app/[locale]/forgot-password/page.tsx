// src/app/[locale]/forgot-password/page.tsx
/**
 * @file page.tsx
 * @description Página y formulario para solicitar la recuperación de contraseña.
 *              Ha sido refactorizado a un componente de cliente soberano para
 *              utilizar `useFormState` y proporcionar una UX de élite.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

import { requestPasswordResetAction } from "@/lib/actions/password.actions";
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
  const [state, formAction] = useFormState(requestPasswordResetAction, {
    success: false,
    error: null,
  });

  useEffect(() => {
    // La redirección se maneja en la Server Action.
    // Aquí solo mostramos el error si Zod o el rate limiter fallan.
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Arquitectura de Cliente Soberano**: ((Implementada)) El uso de `"use client"` y `useFormState` permite un feedback de errores instantáneo y una UX superior sin recargas de página.
 * 2. **Feedback de Usuario (Toast)**: ((Implementada)) Los errores de validación o de rate limit se comunican al usuario de forma clara a través de notificaciones toast.
 *
 * =====================================================================
 */
// src/app/[locale]/forgot-password/page.tsx
