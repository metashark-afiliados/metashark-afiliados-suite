// src/lib/hooks/useDashboardTranslations.ts
/**
 * @file useDashboardTranslations.ts
 * @description Hook soberano y SSoT para la obtención de traducciones en el
 *              ecosistema del Dashboard. Enriquecido para incluir el namespace
 *              de errores de validación.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.1.0
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
 * 1. **Resolución Sistémica de `MISSING_MESSAGE`**: ((Implementada)) Se ha añadido la carga del namespace `shared.ValidationErrors`. Esto resuelve la causa raíz de los errores de `MISSING_MESSAGE` que ocurrían en componentes y hooks que dependen de este namespace para mostrar mensajes de error (ej. `useHandleErrors`, `useWorkspaceInlineEditor`).
 *
 * @subsection Melhorias Futuras
 * 1. **Tipado con Zod**: ((Vigente)) El tipo de retorno de este hook podría ser validado por un schema de Zod que componga los schemas individuales de cada namespace, proporcionando una seguridad de tipos aún mayor en tiempo de compilación.
 *
 * =====================================================================
 */
// src/lib/hooks/useDashboardTranslations.ts
