// tests/utils/ProvidersWrapper.tsx
/**
 * @file tests/utils/ProvidersWrapper.tsx
 * @description Aparato de infraestructura de pruebas: El Simulador de Entorno.
 *              Esta es la Única Fuente de Verdad para la composición del árbol
 *              de proveedores del entorno de pruebas. Envuelve los componentes
 *              bajo prueba con todos los contextos necesarios (`DashboardProvider`,
 *              `NextIntlClientProvider`, `MemoryRouterProvider`, `TooltipProvider`),
 *              inyectando datos simulados para crear un entorno de renderizado
 *              aislado y de alta fidelidad.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";

import { TooltipProvider } from "@/components/ui/tooltip";
import {
  DashboardProvider,
  type DashboardContextProps,
} from "@/lib/context/DashboardContext";
import { WorkspaceProvider } from "@/lib/hooks/useWorkspaceContext.tsx";

/**
 * @public
 * @interface ProvidersWrapperProps
 * @description Contrato de props para el componente `ProvidersWrapper`.
 */
export interface ProvidersWrapperProps {
  children: React.ReactNode;
  dashboardContextValue: DashboardContextProps;
  locale: string;
  messages: Record<string, any>;
  providerOverrides?: {
    /** Si es `false`, no envolverá con `WorkspaceProvider`. */
    withWorkspaceProvider?: boolean;
  };
}

/**
 * @public
 * @component ProvidersWrapper
 * @description Componente que envuelve a los componentes bajo prueba con todos
 *              los proveedores de contexto necesarios.
 * @param {ProvidersWrapperProps} props - Las propiedades para configurar los proveedores.
 * @returns {React.ReactElement} El árbol de componentes envuelto.
 */
export const ProvidersWrapper: React.FC<ProvidersWrapperProps> = ({
  children,
  dashboardContextValue,
  locale,
  messages,
  providerOverrides = {},
}) => {
  const { withWorkspaceProvider = true } = providerOverrides;
  let content = children;

  // Envolver condicionalmente con WorkspaceProvider si es necesario.
  if (withWorkspaceProvider) {
    content = <WorkspaceProvider>{content}</WorkspaceProvider>;
  }

  return (
    <MemoryRouterProvider>
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone="UTC"
      >
        <DashboardProvider value={dashboardContextValue}>
          <TooltipProvider>{content}</TooltipProvider>
        </DashboardProvider>
      </NextIntlClientProvider>
    </MemoryRouterProvider>
  );
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Entorno de Prueba de Alta Fidelidad**: ((Implementada)) Este aparato simula el entorno de la aplicación completa, permitiendo que los componentes que dependen de múltiples contextos (`useDashboard`, `useWorkspaceContext`, `useTranslations`) se rendericen correctamente.
 * 2. **Composición Flexible**: ((Implementada)) La prop `providerOverrides` permite a las pruebas desactivar proveedores específicos, facilitando la prueba de componentes en aislamiento sin su contexto completo.
 *
 * @subsection Melhorias Futuras
 * 1. **Proveedores Dinámicos**: ((Vigente)) En lugar de una lógica booleana simple, `providerOverrides` podría aceptar un array de nombres de proveedores a omitir (`omitProviders: ['WorkspaceProvider']`), haciendo la configuración más explícita y escalable.
 *
 * =====================================================================
 */
// tests/utils/ProvidersWrapper.tsx
