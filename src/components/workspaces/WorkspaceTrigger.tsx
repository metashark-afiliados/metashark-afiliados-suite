// src/components/workspaces/WorkspaceTrigger.tsx
/**
 * @file WorkspaceTrigger.tsx
 * @description Componente de UI que renderiza el trigger del popover.
 *              Refactorizado para usar un `<button>` nativo con clases de variantes,
 *              logrando una composición perfecta y segura.
 * @author Raz Podestá
 * @version 2.3.0
 */
import * as React from "react";
import { useTranslations } from "next-intl";
import { ChevronsUpDown, LayoutGrid } from "lucide-react";

import { buttonVariants } from "@/components/ui/button"; // Importar SSoT de estilos
import { cn } from "@/lib/utils";
import { useWorkspaceInlineEditor } from "@/lib/hooks/use-workspace-inline-editor";
import { WorkspaceNameInput } from "./WorkspaceNameInput";

/**
 * @public
 * @component WorkspaceTrigger
 * @description Renderiza el trigger del popover, manejando el renderizado condicional.
 *              Reenvía la `ref` a un `<button>` nativo.
 */
export const WorkspaceTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => {
  const t = useTranslations("WorkspaceSwitcher");
  const {
    isEditing,
    setIsEditing,
    canEdit,
    isApiPending,
    activeWorkspaceName,
  } = useWorkspaceInlineEditor();

  if (isEditing) {
    return <WorkspaceNameInput />;
  }

  // --- INICIO DE REFACTORIZACIÓN A PRIMITIVA ---
  // Se usa un <button> nativo y se le aplican los estilos de `buttonVariants`.
  // Esto es más robusto y seguro que usar el <Button> orquestador.
  return (
    <button
      ref={ref}
      type="button" // Tipo explícito para claridad
      role="combobox"
      disabled={isApiPending || props.disabled}
      onClick={(e) => {
        props.onClick?.(e);
        if (canEdit) setIsEditing(true);
      }}
      aria-disabled={!canEdit || isApiPending}
      aria-label={t("selectWorkspace_label")}
      className={cn(
        buttonVariants({ variant: "ghost" }), // Aplicar estilos de variante
        "w-[220px] justify-between h-auto py-2"
      )}
      {...props}
    >
      <div className="flex items-center gap-2 truncate">
        <LayoutGrid className="h-4 w-4 text-muted-foreground" />
        <span className="truncate font-semibold text-base">
          {isApiPending ? t("changing_status") : activeWorkspaceName}
        </span>
      </div>
      <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
    </button>
  );
  // --- FIN DE REFACTORIZACIÓN A PRIMITIVA ---
});

WorkspaceTrigger.displayName = "WorkspaceTrigger";

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución Definitiva de TS2322**: ((Implementada)) Al usar un `<button>` nativo, el componente ahora es 100% compatible con las props que le pasa `PopoverTrigger`, eliminando la colisión de contratos de tipo. Esta es la solución arquitectónica final.
 *
 * =====================================================================
 */
// src/components/workspaces/WorkspaceTrigger.tsx
