// src/lib/hooks/useDashboardTranslations.ts
/**
 * @file useDashboardTranslations.ts
 * @description Hook soberano y SSoT para la obtención de traducciones en el
 *              ecosistema del Dashboard. Centraliza la carga de todos los
 *              namespaces compartidos para garantizar la consistencia y
 *              resolver errores de `MISSING_MESSAGE` de forma sistémica.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useTypedTranslations } from "@/lib/i18n/hooks";

/**
 * @public
 * @function useDashboardTranslations
 * @description Hook que carga y devuelve todas las funciones de traducción
 *              necesarias para el layout principal del dashboard y sus
 *              componentes hijos (sidebars, dialogs, etc.).
 * @returns Un objeto que contiene las funciones `t` para cada namespace requerido.
 */
export function useDashboardTranslations() {
  const tSidebar = useTypedTranslations("components.layout.DashboardSidebar");
  const tHeader = useTypedTranslations("components.layout.DashboardHeader");
  const tWorkspaces = useTypedTranslations(
    "components.workspaces.WorkspaceSwitcher"
  );
  const tDialogs = useTypedTranslations("components.ui.Dialogs");
  const tErrors = useTypedTranslations("shared.ValidationErrors");

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
 * 1. ((Implementada)) Centralización de Dependencias (SSoT): Este hook se convierte en la Única Fuente de Verdad para las traducciones del dashboard, mejorando la mantenibilidad y el SRP.
 * 2. ((Implementada)) Resolución Sistémica de `MISSING_MESSAGE`: Al cargar el namespace `shared.ValidationErrors` aquí, se resuelve la causa raíz de los errores de build que se originaban en los hooks `useHandleErrors` y `useWorkspaceInlineEditor`.
 * 3. ((Implementada)) Seguridad de Tipos de Élite: Utiliza `useTypedTranslations` para garantizar que solo se puedan acceder a claves de traducción válidas en tiempo de compilación.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) Tipado con Zod: El tipo de retorno de este hook podría ser validado por un schema de Zod que componga los schemas individuales de cada namespace, proporcionando una seguridad de tipos de élite en tiempo de compilación.
 * 2. ((Vigente)) Memoización del Objeto de Retorno: Aunque `useTypedTranslations` es memoizado, el objeto de retorno de este hook podría ser envuelto en `useMemo` para una capa adicional de optimización, previniendo re-renderizados innecesarios en los consumidores si sus props no cambian.
 *
 * =====================================================================
 */
