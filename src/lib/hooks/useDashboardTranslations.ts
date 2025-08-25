// src/lib/hooks/useDashboardTranslations.ts
/**
 * @file useDashboardTranslations.ts
 * @description Hook soberano y SSoT para la obtención de traducciones en el
 *              ecosistema del Dashboard. Sincronizado para incluir el namespace
 *              del nuevo `DashboardHeader` atómico.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useTranslations } from "next-intl";

/**
 * @public
 * @function useDashboardTranslations
 * @description Hook que carga y devuelve todas las funciones de traducción
 *              necesarias para el layout principal del dashboard y sus
 *              componentes hijos (sidebars, dialogs, etc.).
 * @returns Un objeto que contiene las funciones `t` para cada namespace requerido.
 */
export function useDashboardTranslations() {
  const tSidebar = useTranslations("components.layout.DashboardSidebar");
  const tHeader = useTranslations("components.layout.DashboardHeader");
  const tWorkspaces = useTranslations(
    "components.workspaces.WorkspaceSwitcher"
  );
  const tDialogs = useTranslations("components.ui.Dialogs");
  const tErrors = useTranslations("shared.ValidationErrors");

  return {
    tSidebar,
    tHeader,
    tWorkspaces,
    tDialogs,
    tErrors,
  };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Completitud de Contrato**: ((Implementada)) El hook ahora carga y provee las traducciones para el `DashboardHeader`, permitiendo su refactorización a un componente puro.
 *
 * =====================================================================
 */
// src/lib/hooks/useDashboardTranslations.ts
