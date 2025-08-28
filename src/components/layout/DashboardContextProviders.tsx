// src/components/layout/DashboardContextProviders.tsx
/**
 * @file DashboardContextProviders.tsx
 * @description Aparato de cliente atómico y puro. Su única responsabilidad es
 *              anidar los proveedores de contexto del dashboard (`DashboardProvider`,
 *              `WorkspaceProvider`, y ahora `IconLibraryProvider`), recibiendo
 *              los datos iniciales (`DashboardLayoutData`) como props.
 *              Esta abstracción limpia el componente de layout del servidor
 *              y centraliza la composición de contextos de cliente.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";

import { DashboardProvider } from "@/lib/context/DashboardContext";
// --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Importación de IconLibraryProvider ---
import { IconLibraryProvider } from "@/lib/context/IconLibraryContext";
// --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
import { WorkspaceProvider } from "@/lib/hooks/useWorkspaceContext.tsx";
import { clientLogger } from "@/lib/logging";
import { type DashboardLayoutData } from "./dashboard.loader";

interface DashboardContextProvidersProps {
  children: React.ReactNode;
  value: DashboardLayoutData;
}

/**
 * @public
 * @component DashboardContextProviders
 * @description Componente que envuelve a los componentes bajo prueba con todos
 *              los proveedores de contexto necesarios para el dashboard.
 *              Ahora incluye el `IconLibraryProvider` para la personalización de iconos.
 * @param {DashboardContextProvidersProps} props - Las propiedades para configurar los proveedores.
 * @returns {React.ReactElement} El árbol de componentes envuelto.
 */
export function DashboardContextProviders({
  children,
  value,
}: DashboardContextProvidersProps): React.ReactElement {
  clientLogger.trace(
    "[DashboardContextProviders] Renderizando proveedores de contexto con datos iniciales."
  );

  const activeIconLibraryId =
    value.profile.dashboard_layout?.activeIconLibraryId || "lucide";

  return (
    <DashboardProvider value={value}>
      {/* --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Integración de IconLibraryProvider --- */}
      <IconLibraryProvider activeLibraryId={activeIconLibraryId}>
        <WorkspaceProvider>{children}</WorkspaceProvider>
      </IconLibraryProvider>
      {/* --- FIN DE REFACTORIZACIÓN HOLÍSTICA --- */}
    </DashboardProvider>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Integración de `IconLibraryProvider`**: ((Implementada)) El componente ahora envuelve a sus hijos con `IconLibraryProvider`, pasando la preferencia `activeIconLibraryId` obtenida de `DashboardLayoutData`. Esto es crucial para la personalización de la UI y permite que `DynamicIcon.tsx` funcione correctamente.
 * 2. **Cohesión de Contextos**: ((Implementada)) Este aparato mantiene su rol de ensamblador puro de proveedores, centralizando la configuración de contextos de cliente y adhiriéndose al SRP.
 * 3. **Consumo de Preferencias de UI**: ((Implementada)) Lee `activeIconLibraryId` del perfil del usuario, garantizando que las preferencias se respeten desde el inicio de la sesión del dashboard.
 *
 * @subsection Melhorias Futuras
 * 1. **Proveedores Condicionales**: ((Vigente)) Si futuros contextos solo fueran necesarios para ciertos roles o planes (ej. un `BillingProvider` para planes `pro`), este componente podría renderizar proveedores de forma condicional basándose en `value.profile`, optimizando el árbol de componentes para roles específicos.
 *
 * =====================================================================
 */
// src/components/layout/DashboardContextProviders.tsx
