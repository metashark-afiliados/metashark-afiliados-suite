// src/components/workspaces/WorkspaceSwitcher.tsx
/**
 * @file WorkspaceSwitcher.tsx
 * @description Orquestador de UI soberano. Sincronizado para consumir la nueva
 *              API del hook `useWorkspaceInlineEditor` sin argumentos.
 * @author Raz Podestá - MetaShark Tech
 * @version 8.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import React from "react";
import { type useTranslations } from "next-intl";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDashboard } from "@/lib/context/DashboardContext";
import {
  useWorkspaceContext,
  WorkspaceProvider,
} from "@/lib/hooks/useWorkspaceContext.tsx";
import { useWorkspaceInlineEditor } from "@/lib/hooks/useWorkspaceInlineEditor";
import { useWorkspaceManager } from "@/lib/hooks/useWorkspaceManager";
import { WorkspacePopoverContent } from "./WorkspacePopoverContent";
import { WorkspaceTrigger } from "./WorkspaceTrigger";

const WorkspaceSwitcherContent = ({
  t,
}: {
  t: ReturnType<typeof useTranslations>;
}) => {
  const { workspaces, activeWorkspace } = useDashboard();
  const { canEdit, canDelete } = useWorkspaceContext();
  const {
    popoverOpen,
    setPopoverOpen,
    handleWorkspaceSelect,
    ...actionHandlers
  } = useWorkspaceManager();

  // --- INICIO DE CORRECCIÓN DE API ---
  // El hook ahora es soberano y no requiere la inyección de dependencias de i18n.
  const inlineEditorHook = useWorkspaceInlineEditor();
  // --- FIN DE CORRECCIÓN DE API ---

  const triggerTexts = {
    ariaLabel: t("selectWorkspace_label"),
    statusText: t("changing_status"),
    editAriaLabel: t("edit_form.name_aria_label"),
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <WorkspaceTrigger texts={triggerTexts} hook={inlineEditorHook} />
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        <WorkspacePopoverContent
          t={t}
          workspaces={workspaces}
          activeWorkspaceId={activeWorkspace!.id}
          onWorkspaceSelect={handleWorkspaceSelect}
          canEdit={canEdit}
          canDelete={canDelete}
          {...actionHandlers}
        />
      </PopoverContent>
    </Popover>
  );
};

export function WorkspaceSwitcher({
  t,
}: {
  t: ReturnType<typeof useTranslations>;
}): React.ReactElement | null {
  const { activeWorkspace } = useDashboard();
  if (!activeWorkspace) {
    return null;
  }
  return (
    <WorkspaceProvider>
      <WorkspaceSwitcherContent t={t} />
    </WorkspaceProvider>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) Resolución de Error de Compilación (TS2554): Se ha actualizado la llamada al hook `useWorkspaceInlineEditor` para que no reciba argumentos, sincronizándola con su nueva API soberana.
 * 2. ((Implementada)) Cierre de Cadena de Refactorización: Esta corrección completa la cadena de refactorización iniciada en `useHandleErrors`, asegurando que toda la lógica de edición en línea sea coherente y funcional.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) Memoización de Props de Textos: El objeto `triggerTexts` podría ser envuelto en `React.useMemo` para una optimización de micro-rendimiento, previniendo su recreación en cada renderizado.
 *
 * =====================================================================
 */
