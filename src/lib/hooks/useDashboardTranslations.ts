// src/lib/hooks/useDashboardTranslations.ts
/**
 * @file useDashboardTranslations.ts
 * @description Hook soberano y SSoT para i18n en el layout del Dashboard. Ha sido
 *              refactorizado para reducir su alcance y cargar únicamente los
 *              namespaces globales del layout, delegando las traducciones de
 *              página a hooks más específicos.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 4.0.0
 */
"use client";

import { useFormatter } from "next-intl";
import { useMemo } from "react";

import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logger";

/**
 * @public
 * @function useDashboardTranslations
 * @description Hook que carga y devuelve las funciones de traducción
 *              necesarias para el layout principal del dashboard.
 *              Su valor de retorno está memoizado para optimizar el rendimiento.
 * @returns Un objeto estable que contiene las funciones `t` para cada namespace requerido.
 */
export function useDashboardTranslations() {
  clientLogger.trace(
    "[useDashboardTranslations] Inicializando hook SSoT de i18n para el layout."
  );

  const tSidebar = useTypedTranslations("components.layout.DashboardSidebar");
  const tHeader = useTypedTranslations("components.layout.DashboardHeader");
  const tWorkspaces = useTypedTranslations(
    "components.workspaces.WorkspaceSwitcher"
  );
  const tDialogs = useTypedTranslations("components.ui.Dialogs");
  const tErrors = useTypedTranslations("shared.ValidationErrors");
  const tFormatter = useFormatter();

  return useMemo(
    () => ({
      tSidebar,
      tHeader,
      tWorkspaces,
      tDialogs,
      tErrors,
      tFormatter,
    }),
    [tSidebar, tHeader, tWorkspaces, tDialogs, tErrors, tFormatter]
  );
}
// src/lib/hooks/useDashboardTranslations.ts
