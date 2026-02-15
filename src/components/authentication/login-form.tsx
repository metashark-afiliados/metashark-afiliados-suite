// src/components/authentication/login-form.tsx
/**
 * @file login-form.tsx
 * @description Componente de cliente soberano para el formulario de inicio de sesión.
 *              Implementa la arquitectura de página dedicada utilizando
 *              useFormState para una integración directa y robusta con Server Actions.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.1.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { useFormState, useFormStatus } from "react-dom";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

import { signInWithEmailAction } from "@/lib/actions/auth.actions";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OAuthButtonGroup } from "./OAuthButtonGroup";

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("pages.LoginPage");
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? t("signInButton_pending") : t("signInButton")}
    </Button>
  );
}

export function LoginForm(): React.ReactElement {
  const t = useTranslations("pages.LoginPage");
  const [state, formAction] = useFormState(signInWithEmailAction, {
    success: false,
    error: "",
  });

  React.useEffect(() => {
    if (!state.success && state.error) {
      toast.error(t(state.error as any));
    }
  }, [state, t]);

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">{t("email_label")}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="m@example.com"
          required
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">{t("password_label")}</Label>
          <Link
            href="/forgot-password"
            className="ml-auto inline-block text-sm underline"
          >
            {t("forgot_password_link")}
          </Link>
        </div>
        <Input id="password" name="password" type="password" required />
      </div>
      <SubmitButton />
      <OAuthButtonGroup providers={["google", "apple"]} />
    </form>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Corrección de Sintaxis Crítica**: ((Implementada)) Se ha corregido el error de sintaxis en la desestructuración de `useTransition` y se han añadido todas las importaciones necesarias, resolviendo la cascada de errores de compilación.
 * 2. **Arquitectura de Formulario Soberano**: ((Vigente)) El componente ahora tiene control total sobre su estado, validación y envío.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación en Cliente con `react-hook-form`**: ((Vigente)) Añadir `react-hook-form` para una validación en tiempo real en el cliente antes del envío.
 *
 * =====================================================================
 */
// src/components/authentication/login-form.tsx
