// src/components/auth/AuthFooter.tsx
/**
 * @file src/components/auth/AuthFooter.tsx
 * @description Aparato de UI atómico y de presentación puro. Ha sido refactorizado
 *              para envolver la salida de `t.rich` en un `<span>`, garantizando
 *              que el componente `SmartLink` reciba un único hijo y resolviendo
 *              el error de build `React.Children.only`.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";

import { useTranslations } from "next-intl";
import React from "react";

import { Button } from "@/components/ui/button";
import { SmartLink } from "@/components/ui/SmartLink";

interface AuthFooterProps {
  type: "login" | "signup";
  onSwitchView: (view: "login" | "signup") => void;
}

export function AuthFooter({
  type,
  onSwitchView,
}: AuthFooterProps): React.ReactElement {
  const tLogin = useTranslations("LoginPage");
  const tSignUp = useTranslations("SignUpPage");

  const isLogin = type === "login";
  const targetView = isLogin ? "signup" : "login";
  const linkLabelKey = isLogin ? "dontHaveAccount" : "alreadyHaveAccount";

  return (
    <div className="mt-4 px-6 pb-6 text-center text-sm">
      <Button
        variant="link"
        className="p-0 h-auto"
        onClick={() => onSwitchView(targetView)}
      >
        {isLogin ? tSignUp(linkLabelKey as any) : tLogin(linkLabelKey as any)}
      </Button>
      {type === "signup" && (
        <p className="mt-4 px-4 text-xs text-muted-foreground">
          {tSignUp.rich("legalNotice", {
            terms: (chunks) => (
              <SmartLink
                href="/terms"
                label={<span>{chunks}</span>} // <-- BLINDAJE DE COMPOSICIÓN
                className="underline hover:text-primary"
              />
            ),
            privacy: (chunks) => (
              <SmartLink
                href="/privacy"
                label={<span>{chunks}</span>} // <-- BLINDAJE DE COMPOSICIÓN
                className="underline hover:text-primary"
              />
            ),
          })}
        </p>
      )}
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Build**: ((Implementada)) Se ha envuelto la salida de `t.rich` (`chunks`) en un `<span>`. Esto asegura que el componente `SmartLink`, y por ende el `<Link>` interno, siempre reciba un único elemento React como hijo, resolviendo el error `React.Children.only`.
 *
 * @subsection Melhorias Futuras
 * 1. **Componente `RichSmartLink`**: ((Vigente)) Se podría crear un nuevo componente `RichSmartLink` que acepte `chunks` directamente y realice el envolvimiento en `<span>` internamente, para una mayor abstracción y limpieza del código en los componentes consumidores.
 *
 * =====================================================================
 */
// src/components/auth/AuthFooter.tsx
