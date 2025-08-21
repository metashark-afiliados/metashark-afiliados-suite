// src/components/layout/DashboardContextProviders.tsx
"use client";

import React from "react";

import {
  DashboardProvider,
  type DashboardContextProps,
} from "@/lib/context/DashboardContext";
import { WorkspaceProvider } from "@/lib/hooks/useWorkspaceContext.tsx";
import { type DashboardLayoutData } from "./dashboard.loader";

interface DashboardContextProvidersProps {
  children: React.ReactNode;
  value: DashboardLayoutData;
}

/**
 * @public
 * @component DashboardContextProviders
 * @description Componente de cliente atómico y puro. Su única responsabilidad
 *              es anidar los proveedores de contexto del dashboard (`DashboardProvider`
 *              y `WorkspaceProvider`), recibiendo los datos iniciales como props.
 *              Esta abstracción limpia el componente de layout del servidor.
 * @param {DashboardContextProvidersProps} props - Propiedades para el componente.
 * @returns {React.ReactElement}
 * @author Raz Podestá
 * @version 1.0.0
 */
export function DashboardContextProviders({
  children,
  value,
}: DashboardContextProvidersProps) {
  return (
    <DashboardProvider value={value}>
      <WorkspaceProvider>{children}</WorkspaceProvider>
    </DashboardProvider>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad de Contexto (SRP)**: ((Implementada)) Este aparato aísla la lógica de anidamiento de proveedores de contexto, manteniendo el layout principal limpio y enfocado en la estructura, cumpliendo así el Principio de Responsabilidad Única.
 * 2. **Componente Puro y Desacoplado**: ((Implementada)) Es un componente de cliente puro, controlado 100% por sus props, lo que facilita su prueba y mantenimiento.
 *
 * @subsection Melhorias Futuras
 * 1. **Proveedores Condicionales**: ((Vigente)) Si futuros contextos solo fueran necesarios para ciertos roles o planes, este componente podría renderizar proveedores de forma condicional basándose en los `value.profile`, optimizando el árbol de componentes.
 *
 * =====================================================================
 */
// src/components/layout/DashboardContextProviders.tsx
