// src/components/workspaces/trigger/DisplayView.tsx
/**
 * @file DisplayView.tsx
 * @description Aparato de UI atómico y de presentación puro. Muestra el
 *              estado actual del workspace activo.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import { motion } from "framer-motion";
import { ChevronsUpDown, LayoutGrid, Pencil } from "lucide-react";
import * as React from "react";

import { useDashboardTranslations } from "@/lib/hooks/useDashboardTranslations";
import { cn } from "@/lib/utils";

interface DisplayViewProps {
  activeWorkspaceName: string;
  isApiPending: boolean;
  canEdit: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

export const DisplayView = React.forwardRef<
  HTMLButtonElement,
  DisplayViewProps
>(({ activeWorkspaceName, isApiPending, canEdit, setIsEditing }, ref) => {
  const { tWorkspaces } = useDashboardTranslations();
  return (
    <motion.button
      key="display"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.15 }}
      ref={ref}
      type="button"
      role="combobox"
      disabled={isApiPending}
      onDoubleClick={canEdit ? () => setIsEditing(true) : undefined}
      aria-label={tWorkspaces("selectWorkspace_label")}
      className={cn(
        "flex items-center justify-between w-full h-auto px-3 py-2 text-sm font-medium transition-colors rounded-md group hover:bg-muted text-foreground"
      )}
    >
      <div className="flex items-center gap-2 truncate">
        <LayoutGrid className="h-4 w-4 text-muted-foreground" />
        <span className="truncate font-semibold text-base">
          {isApiPending ? tWorkspaces("changing_status") : activeWorkspaceName}
        </span>
        {canEdit && (
          <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
      <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
    </motion.button>
  );
});
DisplayView.displayName = "DisplayView";
// src/components/workspaces/trigger/DisplayView.tsx
