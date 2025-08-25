// src/components/workspaces/WorkspaceSwitcher.tsx
/**
 * @file WorkspaceSwitcher.tsx
 * @description Orquestador de UI soberano. Sincronizado para importar y componer
 *              el `WorkspacePopoverContent` externo y corregido.
 * @author Raz Podestá - MetaShark Tech
 * @version 7.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import React from "react";
import { useTranslations } from "next-intl";

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
  const tErrors = useTranslations("shared.ValidationErrors");

  const inlineEditorHook = useWorkspaceInlineEditor({
    successToastText: t("edit_form.success_toast"),
    errorToastTextFn: (errorKey: string) => tErrors(errorKey as any),
  });

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
 * 1. **Resolución Definitiva de Error de Compilación**: ((Implementada)) La refactorización del `WorkspacePopoverContent` externo y la sincronización de su padre `WorkspaceSwitcher` resuelve el error `TS2741` en su causa raíz.
 *
 * =====================================================================
 */
// src/components/workspaces/WorkspaceSwitcher.tsx
