// src/app/[locale]/forgot-password/page.tsx
/**
 * @file src/app/[locale]/forgot-password/page.tsx
 * @description Página y formulario para solicitar la recuperación de contraseña.
 *              Ha sido refactorizado a un componente de cliente soberano para
 *              utilizar `useFormState` y proporcionar una UX de élite.
 *              Corregido para manejar correctamente los errores de tipo en el
 *              uso de `useFormState`.
 * @author Raz Podestá
 * @version 2.0.2
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
import { type ActionResult } from "@/lib/validators";

// Define a local type alias for clarity, matching ActionResult<null>
type RequestPasswordResetState = ActionResult<null>;

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
  const [state, formAction] = useFormState<RequestPasswordResetState, FormData>(
    requestPasswordResetAction,
    {
      success: false,
      error: "",
      // --- INICIO DE CORRECCIÓN: Eliminado `data: null` para el estado de error ---
      // La inicialización del estado de error no debe incluir 'data: null'
      // ya que el tipo ActionResult<null> no lo define cuando success es false.
      // --- FIN DE CORRECCIÓN ---
    }
  );

  useEffect(() => {
    // CORRECTION: Explicitly narrow the type to ensure 'error' property exists
    if (state && !state.success && state.error) {
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
 * 1. **Corrección de Tipos en `useFormState`**: ((Implementada)) Se ha eliminado la propiedad `data: null` del estado inicial del `useFormState` cuando `success` es `false`, resolviendo el error `TS2353` y alineando el objeto de estado con el contrato de tipo `ActionResult`.
 *
 * @subsection Melhorias Futuras
 * 1. **Feedback de Validación en Tiempo Real**: ((Vigente)) Aunque `onTouched` está configurado, la UI podría mejorarse para mostrar marcas de verificación verdes junto a los campos que pasan la validación, proporcionando un feedback más proactivo.
 *
 * =====================================================================
 */
// src/app/[locale]/forgot-password/page.tsx
