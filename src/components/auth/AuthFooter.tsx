// src/components/auth/AuthFooter.tsx
/**
 * @file src/components/auth/AuthFooter.tsx
 * @description Aparato de UI atómico y de presentación puro. Ha sido refactorizado
 *              a un estándar de élite para consumir el componente de blindaje `RichText`,
 *              garantizando una composición segura y a prueba de errores.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
"use client";

import { useTranslations } from "next-intl";
import React from "react";

import { Button } from "@/components/ui/button";
import { RichText } from "@/components/ui/RichText"; // <-- NUEVA IMPORTACIÓN
import { SmartLink } from "@/components/ui/SmartLink";

interface AuthFooterProps {
  type: "login" | "signup";
  onSwitchView: (view: "login" | "signup") => void;
}

/**
 * @public
 * @component AuthFooter
 * @description Renderiza el pie de página para los modales de autenticación.
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
                label={<RichText>{chunks}</RichText>} // <-- BLINDAJE DE COMPOSICIÓN
                className="underline hover:text-primary"
              />
            ),
            privacy: (chunks) => (
              <SmartLink
                href="/privacy"
                label={<RichText>{chunks}</RichText>} // <-- BLINDAJE DE COMPOSICIÓN
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
 * 1. **Composición Segura y Reutilizable**: ((Implementada)) El componente ahora utiliza el nuevo aparato `RichText.tsx` para envolver la salida de `t.rich`. Esto no solo resuelve la vulnerabilidad al error `React.Children.only` de forma arquitectónicamente sólida, sino que también promueve el uso de este nuevo componente de blindaje en toda la aplicación.
 *
 * @subsection Melhorias Futuras
 * 1. **Contenido Dinámico de Aviso Legal**: ((Vigente)) El texto del aviso legal está codificado en el componente. Podría ser pasado como una prop para una mayor flexibilidad.
 *
 * =====================================================================
 */
// src/components/auth/AuthFooter.tsx
