// src/components/layout/DashboardContextProviders.tsx
/**
 * @file DashboardContextProviders.tsx
 * @description Aparato de cliente atómico y puro. Ha sido refactorizado holísticamente
 *              para implementar un "type guard" que valida la preferencia de
 *              librería de iconos del usuario, resolviendo el error de tipo TS2322
 *              y garantizando una integración robusta con `IconLibraryProvider`.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-30
 */
"use client";

import React from "react";
import { type z } from "zod";

import {
  ICON_LIBRARIES_MANIFEST,
  type IconLibraryDefinition,
} from "@/config/icon-libraries.config";
import { DashboardProvider } from "@/lib/context/DashboardContext";
import { IconLibraryProvider } from "@/lib/context/IconLibraryContext";
import { WorkspaceProvider } from "@/lib/hooks/useWorkspaceContext.tsx";
import { clientLogger } from "@/lib/logging";
import { type DashboardLayoutPreferencesSchema } from "@/lib/validators/schemas";
import { type DashboardLayoutData } from "./dashboard.loader";

/**
 * @private
 * @function isValidIconLibraryId
 * @description Guardián de tipo que verifica si un string es un ID de librería de iconos válido.
 * @param {string | undefined} id - El ID a validar.
 * @returns {id is IconLibraryDefinition['id']} `true` si el ID es válido.
 */
const isValidIconLibraryId = (
  id: string | undefined
): id is IconLibraryDefinition["id"] => {
  return ICON_LIBRARIES_MANIFEST.some((lib) => lib.id === id);
};

interface DashboardContextProvidersProps {
  children: React.ReactNode;
  value: DashboardLayoutData;
}

export function DashboardContextProviders({
  children,
  value,
}: DashboardContextProvidersProps): React.ReactElement {
  clientLogger.trace(
    "[DashboardContextProviders] Renderizando proveedores de contexto."
  );

  const dashboardLayoutPrefs = value.profile.dashboard_layout as z.infer<
    typeof DashboardLayoutPreferencesSchema
  >;

  const userPreference = dashboardLayoutPrefs?.activeIconLibraryId;
  const activeIconLibraryId = isValidIconLibraryId(userPreference)
    ? userPreference
    : "lucide"; // Fallback a 'lucide'

  return (
    <DashboardProvider value={value}>
      <IconLibraryProvider activeLibraryId={activeIconLibraryId}>
        <WorkspaceProvider>{children}</WorkspaceProvider>
      </IconLibraryProvider>
    </DashboardProvider>
  );
}
// src/components/layout/DashboardContextProviders.tsx