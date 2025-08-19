// src/components/auth/AuthFooter.tsx
/**
 * @file src/components/auth/AuthFooter.tsx
 * @description Aparato de UI atómico y de presentación puro. Ha sido refactorizado
 *              a un estándar de élite para envolver la salida de `t.rich` en un
 *              `<span>`, garantizando que el componente `SmartLink` reciba un
 *              único hijo y resolviendo el error de build `React.Children.only`.
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

/**
 * @public
 * @component AuthFooter
 * @description Renderiza el pie de página para los modales de autenticación,
 *              permitiendo al usuario cambiar entre las vistas de login y signup,
 *              y mostrando los avisos legales.
 * @param {AuthFooterProps} props - Propiedades para configurar el pie de página.
 * @returns {React.ReactElement} El componente de pie de página renderizado.
 */
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
 * 1. **Blindaje de Composición**: ((Implementada)) Se ha envuelto la salida de `t.rich` (`chunks`) en un `<span>`. Esto asegura que el componente `SmartLink` siempre reciba un único elemento React como hijo, resolviendo el error crítico de build `React.Children.only`.
 *
 * @subsection Melhorias Futuras
 * 1. **Contenido Dinámico de Aviso Legal**: ((Vigente)) El texto del aviso legal está codificado en el componente. Podría ser pasado como una prop para una mayor flexibilidad y reutilización del `AuthFooter` en contextos que no requieran este aviso específico.
 *
 * =====================================================================
 */
// src/components/auth/AuthFooter.tsx
