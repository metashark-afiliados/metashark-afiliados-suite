// src/components/layout/AuthCardLayout.tsx
/**
 * @file AuthCardLayout.tsx
 * @description Aparato de layout de élite, atómico y reutilizable. Su única
 *              responsabilidad es proporcionar una estructura visual consistente
 *              y centrada para los formularios de autenticación, cumpliendo con
 *              la "Filosofía LEGO" y el principio DRY.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import React from "react";

import { LoginCardGradient } from "@/components/gradients/login-card-gradient";
import { LoginGradient } from "@/components/gradients/login-gradient";

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
 * 1. **Abstracción de Layout (DRY)**: ((Implementada)) Este nuevo aparato encapsula la lógica de layout repetida de las páginas de `login` y `signup`, eliminando la duplicación de código.
 * 2. **Layout de Élite Centrado**: ((Implementada)) Utiliza Flexbox para garantizar un centrado vertical y horizontal perfecto, resolviendo los problemas de espaciado y scroll innecesario.
 *
 * @subsection Melhorias Futuras
 * 1. **Variantes de Tarjeta**: ((Vigente)) El componente podría ser extendido para aceptar una prop `variant` que modifique sutilmente la apariencia de la tarjeta para diferentes contextos (ej. `variant="compact"`).
 *
 * =====================================================================
 */
// src/components/layout/AuthCardLayout.tsx
