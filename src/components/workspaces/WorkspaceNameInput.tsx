// src/components/workspaces/WorkspaceNameInput.tsx
/**
 * @file WorkspaceNameInput.tsx
 * @description Componente de UI 100% puro. Recibe strings finales como props.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import React from "react";

import { Input } from "@/components/ui/input";
import { useWorkspaceInlineEditor } from "@/lib/hooks/useWorkspaceInlineEditor";

interface WorkspaceNameInputProps {
  ariaLabel: string;
  hook: ReturnType<typeof useWorkspaceInlineEditor>;
}

export const WorkspaceNameInput = React.forwardRef<
  HTMLInputElement,
  WorkspaceNameInputProps
>(({ ariaLabel, hook }, ref) => {
  const {
    inputValue,
    setInputValue,
    handleSaveName,
    isApiPending,
    activeWorkspaceName,
    setIsEditing,
  } = hook;

  return (
    <Input
      ref={ref}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={handleSaveName}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleSaveName();
        if (e.key === "Escape") {
          setIsEditing(false);
          setInputValue(activeWorkspaceName || "");
        }
      }}
      disabled={isApiPending}
      aria-label={ariaLabel}
      className="w-[220px]"
    />
  );
});

WorkspaceNameInput.displayName = "WorkspaceNameInput";
// src/components/workspaces/WorkspaceNameInput.tsx
