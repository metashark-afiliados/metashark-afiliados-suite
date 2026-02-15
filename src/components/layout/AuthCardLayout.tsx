// src/components/layout/AuthCardLayout.tsx
/**
 * @file AuthCardLayout.tsx
 * @description Aparato de layout de élite, atómico y reutilizable. Su única
 *              responsabilidad es proporcionar una estructura visual consistente
 *              y centrada para los formularios de autenticación, cumpliendo con
 *              la "Filosofía LEGO" y el principio DRY.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";

import { LoginCardGradient } from "@/components/gradients/login-card-gradient";
import { LoginGradient } from "@/components/gradients/login-gradient";
import { clientLogger } from "@/lib/logging";

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
    <div className="relative flex min-h-screen w-full items-center justify-center p-4">
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
    </div>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Abstracción de Layout (DRY)**: ((Implementada)) Este nuevo aparato encapsula la lógica de layout que será repetida en las páginas de `login` y `signup`, eliminando la duplicación de código y estableciendo una SSoT visual.
 * 2. **Layout de Élite Centrado**: ((Implementada)) Utiliza Flexbox para garantizar un centrado vertical y horizontal perfecto, proporcionando una base visual robusta y profesional.
 *
 * @subsection Melhorias Futuras
 * 1. **Variantes de Tarjeta**: ((Vigente)) El componente podría ser extendido para aceptar una prop `variant` que modifique sutilmente la apariencia de la tarjeta para diferentes contextos (ej. `variant="compact"` para un modal).
 * 2. **Animación de Entrada**: ((Vigente)) Envolver la tarjeta en `motion.div` de `framer-motion` para añadir una animación de entrada sutil, mejorando la experiencia de usuario.
 *
 * =====================================================================
 */
// src/components/layout/AuthCardLayout.tsx
