// src/components/workspaces/trigger/index.tsx
/**
 * @file index.tsx
 * @description Orquestador de UI soberano para el `WorkspaceTrigger`. Ensambla
 *              los componentes atómicos `DisplayView` y `EditView` para
 *              gestionar la edición en línea del nombre del workspace.
 * @author L.I.A. Legacy
 * @version 11.0.0
 */
"use client";

import { AnimatePresence } from "framer-motion";
import * as React from "react";

import { PopoverTrigger } from "@/components/ui/popover";
import { useWorkspaceInlineEditor } from "@/lib/hooks/useWorkspaceInlineEditor";
import { clientLogger } from "@/lib/logger";
import { DisplayView } from "./DisplayView";
import { EditView } from "./EditView";

/**
 * @public
 * @component WorkspaceTrigger
 * @description Orquesta el renderizado del disparador del selector de workspaces.
 *              Es un componente de cliente soberano que consume el hook `useWorkspaceInlineEditor`
 *              para obtener todo su estado y lógica, y renderiza condicionalmente
 *              la vista de visualización o de edición.
 * @returns {React.ReactElement} El componente disparador del workspace.
 */
export const WorkspaceTrigger = (): React.ReactElement => {
  const hookApi = useWorkspaceInlineEditor();
  clientLogger.trace(
    { isEditing: hookApi.isEditing, canEdit: hookApi.canEdit },
    "[WorkspaceTrigger] Renderizando orquestador soberano."
  );

  return (
    <div className="px-4 py-2 w-[220px]">
      <AnimatePresence mode="wait">
        {hookApi.isEditing ? (
          <EditView
            form={hookApi.form}
            isApiPending={hookApi.isApiPending}
            handleBlur={hookApi.handleBlur}
            handleKeyDown={hookApi.handleKeyDown}
          />
        ) : (
          <PopoverTrigger asChild>
            <DisplayView
              activeWorkspaceName={hookApi.activeWorkspaceName}
              isApiPending={hookApi.isApiPending}
              canEdit={hookApi.canEdit}
              setIsEditing={hookApi.setIsEditing}
            />
          </PopoverTrigger>
        )}
      </AnimatePresence>
    </div>
  );
};
// src/components/workspaces/trigger/index.tsx
