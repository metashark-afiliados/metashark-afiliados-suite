// src/components/authentication/OAuthButtonGroup.tsx
/**
 * @file OAuthButtonGroup.tsx
 * @description Componente de ensamblaje de UI. Refactorizado a un estándar de
 *              élite para ser un componente de presentación 100% puro, recibiendo
 *              todo su contenido textual a través de props y propagándolo a sus
 *              hijos (`OAuthButton`), cumpliendo con el Manifiesto IMAS.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { type Provider } from "@supabase/supabase-js";
import {
  OAuthButton,
  providerDetails,
} from "@/components/authentication/OAuthButton";

export interface OAuthButtonGroupProps {
  providers: Provider[];
  texts: {
    signInWithProvider: string; // Template string: "Continue with {provider}"
  };
}

export function OAuthButtonGroup({ providers, texts }: OAuthButtonGroupProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      {providers.map((provider) => {
        const details = providerDetails[provider];
        if (!details) return null;

        const buttonText = texts.signInWithProvider.replace(
          "{provider}",
          details.name
        );

        return (
          <OAuthButton key={provider} provider={provider} text={buttonText} />
        );
      })}
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente de Presentación 100% Puro**: ((Implementada)) Se ha eliminado la llamada a `useTranslations`. El componente es ahora completamente agnóstico al contenido, adhiriéndose a la "Filosofía LEGO" y al Manifiesto IMAS.
 * 2. **Resolución Preventiva de `FORMATTING_ERROR`**: ((Implementada)) Al no manejar la i18n internamente, este componente ya no puede ser la fuente del error. La responsabilidad de proveer el texto correcto (y sus variables) se transfiere al orquestador padre.
 *
 * @subsection Melhorias Futuras
 * 1. **Renderizado Condicional de Iconos**: ((Vigente)) Si en el futuro se soportan proveedores OAuth cuyo icono no esté en `providerDetails`, el componente podría renderizar un icono genérico en lugar de `null` para una UI más consistente.
 *
 * =====================================================================
 */
