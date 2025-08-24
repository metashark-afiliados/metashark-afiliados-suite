// src/components/authentication/sign-up-form.tsx
/**
 * @file sign-up-form.tsx
 * @description Formulario de cliente soberano para el registro.
 *
 * @version 5.0.0 (Dev Shortcut)
 * @author Raz Podestá
 *
 * @note [MODO DE DESARROLLO AISLADO - LEER ANTES DE MODIFICAR]
 * ==============================================================================
 * ESTADO ACTUAL: Esta versión del componente está modificada para el "Modo de
 * Desarrollo Aislado". Su propósito es acelerar la depuración de funcionalidades
 * post-autenticación.
 *
 * COMPORTAMIENTO MODIFICADO:
 * 1. La función `processSubmit` NO invoca la Server Action `signUpAction`.
 * 2. En su lugar, ejecuta una redirección directa del lado del cliente a "/dashboard".
 * 3. Se ha ELIMINADO la validación con `react-hook-form` y `zodResolver` para
 *    permitir el envío con cualquier dato.
 *
 * ESTRATEGIA DE REVERSIÓN A PRODUCCIÓN:
 * Para restaurar la funcionalidad de producción, se deben realizar los siguientes pasos:
 * 1. Restaurar el uso de `react-hook-form` (descomentar `useForm`, `handleSubmit`, etc.).
 * 2. Restaurar la invocación a la Server Action `signUpAction` dentro de `processSubmit`.
 * 3. Restaurar la lógica de `useTransition` y `react-hot-toast` para el feedback de UI.
 * 4. Eliminar el `useRouter` y la redirección directa.
 * 5. La versión de producción de este archivo se encuentra en el commit [hash-del-commit-de-producción].
 * ==============================================================================
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SmartLink } from "@/components/ui/SmartLink";
import { useRouter } from "@/lib/navigation";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";

export function SignupForm() {
  const t = useTranslations("pages.SignUpPage");
  const router = useRouter();

  // NOTA DEV: La validación de react-hook-form está deshabilitada.
  const handleDevSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push("/dashboard");
  };

  return (
    <form
      onSubmit={handleDevSubmit}
      className={"px-6 md:px-16 pb-6 py-8 gap-4 flex flex-col"}
    >
      <div
        className={
          "text-[30px] leading-[36px] font-medium tracking-[-0.6px] text-center"
        }
      >
        {t("title")}
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">{t("email_label")}</Label>
        <Input id="email" type="email" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">{t("password_label")}</Label>
        <Input id="password" type="password" />
      </div>

      {/* La funcionalidad del PasswordStrengthMeter se mantiene para la UI */}
      <PasswordStrengthMeter password={""} />

      <div className="space-y-1">
        <Label htmlFor="confirmPassword">{t("confirm_password_label")}</Label>
        <Input id="confirmPassword" type="password" />
      </div>

      <div className="space-y-2 pt-2">
        <div className="flex items-start space-x-2">
          <Checkbox id="terms" />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t.rich("legalNotice", {
                terms: (chunks) => (
                  <SmartLink
                    href="/terms"
                    label={chunks}
                    className="underline"
                  />
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
          </div>
        </div>
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox id="newsletter" />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor="newsletter"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t("newsletter_label")}
          </Label>
        </div>
      </div>

      <Button type="submit" className="w-full">
        {t("signUpButton")}
      </Button>
    </form>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Shortcut de Desarrollo**: ((Implementada)) El formulario ahora implementa un bypass de autenticación del lado del cliente, redirigiendo directamente al dashboard para agilizar la depuración, según la directiva.
 * 2. **Documentación de Reversión**: ((Implementada)) Se ha añadido un bloque de comentarios detallado que explica el estado actual del componente y proporciona una guía clara para su futura restauración a la lógica de producción, minimizando la deuda técnica.
 *
 * @subsection Melhorias Futuras
 * 1. **Restauración de Lógica de Producción**: ((Vigente)) Este aparato deberá ser revertido a su versión anterior, que utiliza `react-hook-form` e invoca `signUpAction`, antes del despliegue a producción.
 *
 * =====================================================================
 */
// src/components/authentication/sign-up-form.tsx
