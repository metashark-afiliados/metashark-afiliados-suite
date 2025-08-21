// tests/utils/ProvidersWrapper.tsx
/**
 * @file tests/utils/ProvidersWrapper.tsx
 * @description Arnés de Proveedores de Contexto de Élite v13.1.0.
 *              Este aparato es un componente de cliente atómico y puro cuya única
 *              responsabilidad es envolver a los componentes bajo prueba en TODOS
 *              los proveedores de contexto globales necesarios para un renderizado
 *              de alta fidelidad. Actúa como el puente entre los datos de prueba
 *              simulados y la UI, garantizando un entorno de prueba hermético y estable.
 * @author Raz Podestá
 * @version 13.1.0
 */
import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";

import { Command } from "@/components/ui/command";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  DashboardProvider,
  type DashboardContextProps,
} from "@/lib/context/DashboardContext";
import { WorkspaceProvider } from "@/lib/hooks/useWorkspaceContext.tsx";

/**
 * @public
 * @interface ProvidersWrapperProps
 * @description Define el contrato de props para el arnés de proveedores.
 */
interface ProvidersWrapperProps {
  children: React.ReactNode;
  dashboardContextValue: DashboardContextProps;
  locale: string;
  messages: Record<string, any>;
}

/**
 * @public
 * @component ProvidersWrapper
 * @description Ensambla la jerarquía completa de proveedores de contexto en el orden
 *              correcto para simular el árbol de componentes de la aplicación real.
 * @param {ProvidersWrapperProps} props - Propiedades para configurar los proveedores.
 * @returns {React.ReactElement}
 */
export const ProvidersWrapper: React.FC<ProvidersWrapperProps> = ({
  children,
  dashboardContextValue,
  locale,
  messages,
}) => {
  return (
    <MemoryRouterProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <DashboardProvider value={dashboardContextValue}>
          <WorkspaceProvider>
            <TooltipProvider>
              {/* Ciertos componentes como WorkspaceSwitcher esperan estar dentro de un <Command> provider para funcionar correctamente en pruebas. */}
              <Command>{children}</Command>
            </TooltipProvider>
          </WorkspaceProvider>
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
 * 1. **Estabilidad del Arnés de Pruebas**: ((Implementada)) Se ha corregido la ruta de importación de `WorkspaceProvider` y se ha añadido el proveedor `<Command>`, resolviendo errores de runtime que impedían el renderizado de componentes complejos y estabilizando la suite de pruebas.
 * 2. **Alta Fidelidad de Entorno**: ((Implementada)) El wrapper ahora incluye TODOS los proveedores de contexto globales, garantizando que cualquier componente pueda ser renderizado en un entorno que simula fielmente la aplicación real.
 * 3. **Componente Puro y Controlado**: ((Implementada)) El wrapper es un componente de presentación 100% puro que recibe todo su estado a través de props, haciéndolo predecible y desacoplado.
 *
 * @subsection Melhorias Futuras
 * 1. **Inyección de Mocks de Router**: ((Vigente)) Para pruebas más avanzadas, el `MemoryRouterProvider` podría aceptar una prop `url` para simular el renderizado de un componente en una ruta específica, permitiendo probar lógica dependiente del `pathname`.
 *
 * =====================================================================
 */
// tests/utils/ProvidersWrapper.tsx
