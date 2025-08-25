// src/components/workspaces/WorkspaceTrigger.tsx
/**
 * @file WorkspaceTrigger.tsx
 * @description Componente de UI 100% puro. Recibe strings finales como props.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import * as React from "react";
import { ChevronsUpDown, LayoutGrid } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { useWorkspaceInlineEditor } from "@/lib/hooks/useWorkspaceInlineEditor";
import { cn } from "@/lib/utils";
import { WorkspaceNameInput } from "./WorkspaceNameInput";

interface WorkspaceTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  texts: {
    ariaLabel: string;
    statusText: string;
    editAriaLabel: string;
  };
  hook: ReturnType<typeof useWorkspaceInlineEditor>;
}

export const WorkspaceTrigger = React.forwardRef<
  HTMLButtonElement,
  WorkspaceTriggerProps
>(({ texts, hook, ...props }, ref) => {
  const {
    isEditing,
    setIsEditing,
    canEdit,
    isApiPending,
    activeWorkspaceName,
  } = hook;

  if (isEditing) {
    return <WorkspaceNameInput ariaLabel={texts.editAriaLabel} hook={hook} />;
  }

  return (
    <button
      ref={ref}
      type="button"
      role="combobox"
      disabled={isApiPending || props.disabled}
      onClick={(e) => {
        props.onClick?.(e);
        if (canEdit) setIsEditing(true);
      }}
      aria-disabled={!canEdit || isApiPending}
      aria-label={texts.ariaLabel}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "w-[220px] justify-between h-auto py-2"
      )}
      {...props}
    >
      <div className="flex items-center gap-2 truncate">
        <LayoutGrid className="h-4 w-4 text-muted-foreground" />
        <span className="truncate font-semibold text-base">
          {isApiPending ? texts.statusText : activeWorkspaceName}
        </span>
      </div>
      <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
    </button>
  );
});

WorkspaceTrigger.displayName = "WorkspaceTrigger";
// src/components/workspaces/WorkspaceTrigger.tsx
