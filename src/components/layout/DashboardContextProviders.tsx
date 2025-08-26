// src/components/layout/DashboardContextProviders.tsx
/**
 * @file DashboardContextProviders.tsx
 * @description Aparato de cliente atómico y puro. Su única responsabilidad es
 *              anidar los proveedores de contexto del dashboard (`DashboardProvider`
 *              y `WorkspaceProvider`), recibiendo los datos iniciales como props.
 *              Esta abstracción limpia el componente de layout del servidor.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";

import { DashboardProvider } from "@/lib/context/DashboardContext";
import { WorkspaceProvider } from "@/lib/hooks/useWorkspaceContext.tsx";
import { clientLogger } from "@/lib/logging";
import { type DashboardLayoutData } from "./dashboard.loader";

interface DashboardContextProvidersProps {
  children: React.ReactNode;
  value: DashboardLayoutData;
}

export function DashboardContextProviders({
  children,
  value,
}: DashboardContextProvidersProps) {
  clientLogger.trace(
    "[DashboardContextProviders] Renderizando proveedores de contexto con datos iniciales."
  );
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
 * 1. ((Implementada)) **Full Observabilidad:** Se ha añadido `clientLogger.trace` para registrar el momento en que los proveedores son renderizados con los datos iniciales, mejorando la visibilidad del ciclo de vida de la hidratación del cliente.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Proveedores Condicionales:** Si futuros contextos solo fueran necesarios para ciertos roles o planes, este componente podría renderizar proveedores de forma condicional basándose en `value.profile`, optimizando el árbol de componentes.
 *
 * =====================================================================
 */
// src/components/layout/DashboardContextProviders.tsx
