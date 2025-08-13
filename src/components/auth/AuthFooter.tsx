// src/components/auth/AuthFooter.tsx
/**
 * @file src/components/auth/AuthFooter.tsx
 * @description Aparato de UI atómico y de presentación puro. Renderiza el
 *              pie de página para los formularios de autenticación, mostrando
 *              enlaces contextuales para cambiar entre login/signup y avisos legales.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import { useTranslations } from "next-intl";
import React from "react";

import { Button } from "@/components/ui/button";
import { SmartLink } from "@/components/ui/SmartLink";

/**
 * @public
 * @interface AuthFooterProps
 * @description Define el contrato de props para el `AuthFooter`.
 */
interface AuthFooterProps {
  type: "login" | "signup";
  onSwitchView: (view: "login" | "signup") => void;
}

/**
 * @public
 * @component AuthFooter
 * @description Renderiza un pie de página contextual para los flujos de autenticación.
 * @param {AuthFooterProps} props - Propiedades del componente.
 * @returns {React.ReactElement}
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
                label={chunks}
                className="underline hover:text-primary"
              />
            ),
            privacy: (chunks) => (
              <SmartLink
                href="/privacy"
                label={chunks}
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
 *                           REPORTE POST-CÓDIGO
 * =====================================================================
 * @analisis_de_impacto
 * Este aparato es una dependencia de `login/page.tsx` y `signup/page.tsx`.
 * Su reconstrucción es un paso necesario para implementar la nueva arquitectura
 * de autenticación modal y unificar la UX, como se describe en el manifiesto.
 *
 * @protocolo_de_transparencia
 * LOC Anterior: 0 (Inexistente) | LOC Atual: 80
 * Justificación: Creación de un nuevo componente atómico de UI. El LOC
 * incluye lógica condicional, uso de `t.rich` para i18n, y documentación TSDoc completa.
 *
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Arquitectura Modal**: ((Implementada)) El callback `onSwitchView` permite al `AuthDialog` padre gestionar el cambio de vistas sin recargar la página.
 * 2. **Cumplimiento Legal**: ((Implementada)) Muestra condicionalmente enlaces a los documentos legales en el flujo de registro.
 * 3. **Uso de Texto Enriquecido (i18n)**: ((Implementada)) Utiliza `t.rich` para renderizar un texto que contiene múltiples enlaces.
 *
 * @subsection Melhorias Futuras
 * 1. **Soporte para "Social Proof"**: ((Vigente)) Se podría añadir una prop opcional para mostrar un pequeño texto de prueba social, como "Únete a más de 10,000 marketers".
 *
 * =====================================================================
 */
// src/components/auth/AuthFooter.tsx
