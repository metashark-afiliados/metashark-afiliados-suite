// src/components/authentication/OAuthButtonGroup.tsx
/**
 * @file OAuthButtonGroup.tsx
 * @description Componente de ensamblaje de UI. Refactorizado para ser un
 *              componente puro que recibe su texto a través de props y lo
 *              propaga a sus hijos.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
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
// src/components/authentication/OAuthButtonGroup.tsx
