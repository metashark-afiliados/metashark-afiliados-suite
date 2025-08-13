// src/components/auth/OAuthButtons.tsx
/**
 * @file src/components/auth/OAuthButtons.tsx
 * @description Componente de cliente atómico para renderizar los botones de
 *              inicio de sesión con proveedores OAuth (ej. Google).
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import { useTranslations } from "next-intl";
import { FaGoogle } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signInWithOAuthAction } from "@/lib/actions/auth.actions";

export function OAuthButtons(): React.ReactElement {
  const t = useTranslations("LoginPage");

  const handleOAuthSignIn = async (provider: "google") => {
    const formData = new FormData();
    formData.append("provider", provider);
    await signInWithOAuthAction(formData);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            {t("signInWith")}
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => handleOAuthSignIn("google")}
      >
        <FaGoogle className="mr-2 h-4 w-4" />
        Google
      </Button>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Integración OAuth**: ((Implementada)) Componente de UI dedicado para el inicio de sesión con proveedores externos, mejorando la UX del flujo de autenticación.
 * 2. **Componente Atómico**: ((Implementada)) Sigue la "Filosofía LEGO", es puro y reutilizable.
 *
 * @subsection Melhorias Futuras
 * 1. **Proveedores Dinámicos**: ((Vigente)) El componente podría recibir una prop `providers` (un array de strings) para renderizar dinámicamente los botones de los proveedores OAuth habilitados en la configuración.
 *
 * =====================================================================
 */
// src/components/auth/OAuthButtons.tsx
