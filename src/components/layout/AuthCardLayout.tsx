// src/components/layout/AuthCardLayout.tsx
/**
 * @file AuthCardLayout.tsx
 * @description Aparato de layout de élite, atómico y reutilizable. Es la SSoT
 *              visual para el Portal de Acceso, proporcionando una estructura
 *              consistente e inmersiva para los formularios de autenticación.
 * @author Raz Podestá - MetaShark Tech & RaZ WriTe (Arquitecto)
 * @version 1.0.0
 * @see .docs-espejo/components/layout/AuthCardLayout.tsx.md
 */
"use client";

import React from "react";

import { LoginCardGradient } from "@/components/gradients/login-card-gradient";
import { LoginGradient } from "@/components/gradients/login-gradient";
import { clientLogger } from "@/lib/logger";

/**
 * @public
 * @interface AuthCardLayoutProps
 * @description Define el contrato de props para el layout de autenticación.
 */
export interface AuthCardLayoutProps {
  /**
   * El contenido principal de la tarjeta, típicamente un formulario
   * (`LoginForm` o `SignupForm`).
   */
  children: React.ReactNode;
  /**
   * El elemento de enlace que se muestra debajo de la tarjeta principal
   * (ej. "¿Ya tienes una cuenta? Inicia sesión").
   */
  bottomLink: React.ReactNode;
}

/**
 * @public
 * @component AuthCardLayout
 * @description Renderiza un layout centrado con una tarjeta estilizada para
 *              formularios de autenticación.
 * @param {AuthCardLayoutProps} props - Propiedades para configurar el layout.
 * @returns {React.ReactElement}
 */
export function AuthCardLayout({
  children,
  bottomLink,
}: AuthCardLayoutProps): React.ReactElement {
  clientLogger.trace("[AuthCardLayout] Renderizando layout de autenticación.");
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center p-4">
      <LoginGradient />
      <div className="z-10 flex flex-col">
        <div
          className={
            "mx-auto w-full max-w-sm md:max-w-md flex-col rounded-lg login-card-border bg-background/80 backdrop-blur-[6px]"
          }
        >
          <LoginCardGradient />
          {children}
        </div>
        <div
          className={
            "mx-auto mt-4 w-full max-w-sm md:max-w-md rounded-b-lg px-6 py-4"
          }
        >
          <div
            className={"text-center text-sm font-medium text-muted-foreground"}
          >
            {bottomLink}
          </div>
        </div>
      </div>
    </main>
  );
}
// src/components/layout/AuthCardLayout.tsx
