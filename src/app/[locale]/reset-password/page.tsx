// src/app/[locale]/reset-password/page.tsx
/**
 * @file page.tsx
 * @description Página y formulario para que los usuarios establezcan una nueva contraseña.
 *              Corregido para alinear el estado inicial de `useFormState` con el
 *              contrato de tipo de unión discriminada `ActionResult`.
 * @author Raz Podestá
 * @version 2.1.0
 */
"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import { updatePasswordAction } from "@/lib/actions/password.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { type ActionResult } from "@/lib/validators";

type UpdatePasswordFormState = ActionResult<null>;

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

const PasswordStrengthMeter = ({ score }: { score: number }) => {
  const strengthLevels = [
    { color: "bg-destructive" },
    { color: "bg-destructive" },
    { color: "bg-yellow-500" },
    { color: "bg-green-500" },
    { color: "bg-green-500" },
  ];
  return (
    <div className="flex gap-2 pt-1">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden"
        >
          <motion.div
            className={cn(
              "h-full",
              score > i ? strengthLevels[score].color : "bg-muted"
            )}
            initial={{ width: "0%" }}
            animate={{ width: score > i ? "100%" : "0%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      ))}
    </div>
  );
};

export default function ResetPasswordPage() {
  const t = useTranslations("pages.ResetPasswordPage");
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);

  const [state, formAction] = useFormState<UpdatePasswordFormState, FormData>(
    updatePasswordAction,
    {
      success: false,
      error: "",
    }
  );

  useEffect(() => {
    if (state && !state.success && state.error) {
      toast.error(state.error);
    }
    if (state && state.success) {
      toast.success(t("successToast"));
      setTimeout(() => router.push("/auth/login"), 3000);
    }
  }, [state, router, t]);

  useEffect(() => {
    let score = 0;
    if (!password) {
      setStrength(0);
      return;
    }
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    setStrength(score);
  }, [password]);

  return (
    <div className="w-full max-w-md">
      <Card className="border-border/60 bg-card/50 backdrop-blur-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div>
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
              {password.length > 0 && (
                <PasswordStrengthMeter score={strength} />
              )}
            </div>
            <div>
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
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Tipos**: ((Implementada)) Se ha eliminado la propiedad `data: null` del estado inicial del `useFormState` cuando `success` es `false`, resolviendo el error `TS2353` y alineando el estado con el contrato de tipo `ActionResult`.
 *
 */
// src/app/[locale]/reset-password/page.tsx
