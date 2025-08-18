// src/components/auth/LoginForm.tsx
/**
 * @file src/components/auth/LoginForm.tsx
 * @description Componente de cliente que encapsula la UI de autenticación.
 *              Ha sido corregido para consumir las claves de i18n desde los
 *              namespaces correctos, resolviendo un error de mensaje faltante.
 * @author Raz Podestá
 * @version 5.1.0
 */
"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { AlertCircle, Loader2 } from "lucide-react";

import { signInWithEmailAction } from "@/lib/actions/auth.actions";
import { clientLogger } from "@/lib/logging";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { OAuthButton } from "./OAuthButton";

function SubmitButton() {
  const t = useTranslations("LoginPage");
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? t("signInButton_pending") : t("signInButton")}
    </Button>
  );
}

export function LoginForm(): React.ReactElement {
  const tSupabase = useTranslations("SupabaseAuthUI");
  const tLogin = useTranslations("LoginPage");
  const tForm = useTranslations("LoginForm"); // <-- CORRECCIÓN: Namespace añadido
  const searchParams = useSearchParams();
  const oauthError = searchParams.get("error");
  const oauthMessageKey = searchParams.get("message");

  const [state, formAction] = useFormState(signInWithEmailAction, undefined);

  useEffect(() => {
    if (state && !state.success && state.error) {
      clientLogger.warn("[LoginForm] Error de autenticación de email/pass.", {
        errorKey: state.error,
      });
      toast.error(tLogin(state.error as any));
    }
  }, [state, tLogin]);

  return (
    <div className="space-y-4">
      {oauthError && oauthMessageKey && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{tLogin(oauthMessageKey as any)}</AlertDescription>
        </Alert>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <Label htmlFor="email">{tSupabase("email_label")}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="dev@convertikit.com"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="password">{tSupabase("password_label")}</Label>
          <Input
            id="password"
            name="password"
            type="password"
            defaultValue="password"
            required
            className="mt-1"
          />
        </div>
        <SubmitButton />
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            {tForm("signInWith")} {/* <-- CORRECCIÓN: Namespace corregido */}
          </span>
        </div>
      </div>

      <OAuthButton provider="google" />
    </div>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Corrección de Namespace I18n**: ((Implementada)) Se ha añadido la carga del namespace `LoginForm` y se ha corregido la llamada `t()` para usarlo. Esto resuelve el error de `MISSING_MESSAGE` y restaura la UI a su estado funcional completo.
 *
 * @subsection Melhorias Futuras
 * 1. **Múltiples Proveedores OAuth**: ((Vigente)) Se podría renderizar dinámicamente una lista de `<OAuthButton />` basada en una configuración.
 *
 * =====================================================================
 */
// src/components/auth/LoginForm.tsx