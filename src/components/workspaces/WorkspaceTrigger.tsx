// src/components/workspaces/WorkspaceTrigger.tsx
/**
 * @file WorkspaceTrigger.tsx
 * @description Componente de UI soberano. Ha sido refactorizado para consumir
 *              el componente atómico `WorkspaceNameInputField` para su modo de
 *              edición, consolidando la SSoT de la UI.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 7.0.0
 */
"use client";

import * as React from "react";
import { FormProvider } from "react-hook-form";
import { ChevronsUpDown, LayoutGrid } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { useDashboardTranslations } from "@/lib/hooks/useDashboardTranslations";
import { useWorkspaceInlineEditor } from "@/lib/hooks/useWorkspaceInlineEditor";
import { cn } from "@/lib/utils";
import { clientLogger } from "@/lib/logging";
import { WorkspaceNameInputField } from "./form-fields/WorkspaceNameInputField";

interface WorkspaceTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * @public
 * @component WorkspaceTrigger
 * @description Renderiza el disparador para el popover del selector de workspaces.
 *              Maneja el renderizado condicional para la edición en línea del nombre.
 * @param {WorkspaceTriggerProps} props - Propiedades para configurar el disparador.
 * @returns {React.ReactElement}
 */
export const WorkspaceTrigger = React.forwardRef<
  HTMLButtonElement,
  WorkspaceTriggerProps
>((props, ref) => {
  const { tWorkspaces } = useDashboardTranslations();
  const hook = useWorkspaceInlineEditor();
  const {
    isEditing,
    setIsEditing,
    canEdit,
    isApiPending,
    activeWorkspaceName,
    form,
    handleBlur,
    handleKeyDown,
  } = hook;

  clientLogger.trace("[WorkspaceTrigger] Renderizando disparador soberano.", {
    isEditing,
    canEdit,
  });

  if (isEditing) {
    return (
      <FormProvider {...form}>
        <form
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onSubmit={(e) => e.preventDefault()}
        >
          <WorkspaceNameInputField
            register={form.register}
            errors={form.formState.errors}
            isPending={isApiPending}
            fieldName="name"
          />
        </form>
      </FormProvider>
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      role="combobox"
      disabled={isApiPending || props.disabled}
      onDoubleClick={canEdit ? () => setIsEditing(true) : undefined}
      aria-disabled={!canEdit || isApiPending}
      aria-label={tWorkspaces("selectWorkspace_label")}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "w-[220px] justify-between h-auto py-2"
      )}
      {...props}
    >
      <div className="flex items-center gap-2 truncate">
        <LayoutGrid className="h-4 w-4 text-muted-foreground" />
        <span className="truncate font-semibold text-base">
          {isApiPending ? tWorkspaces("changing_status") : activeWorkspaceName}
        </span>
      </div>
      <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
    </button>
  );
});

WorkspaceTrigger.displayName = "WorkspaceTrigger";
// src/components/workspaces/WorkspaceTrigger.tsx
