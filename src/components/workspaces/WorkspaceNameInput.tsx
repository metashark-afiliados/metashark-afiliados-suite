// src/components/workspaces/WorkspaceNameInput.tsx
/**
 * @file WorkspaceNameInput.tsx
 * @description Componente de UI atómico y puro. Renderiza el campo de input
 *              para la edición en línea del nombre del workspace. Su contrato de
 *              props ha sido simplificado para resolver colisiones de tipos.
 * @author Raz Podestá
 * @version 1.0.2 (Type Collision Fix)
 */
import React from "react";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { useWorkspaceInlineEditor } from "@/lib/hooks/useWorkspaceInlineEditor";

// --- INICIO DE CORRECCIÓN DE ÉLITE: Contrato de Props Explícito ---
// En lugar de aceptar todos los atributos de Input, lo que causa colisiones
// de tipo con 'size', definimos explícitamente que no acepta otras props.
export const WorkspaceNameInput = React.forwardRef<HTMLInputElement>(
  (props, ref) => {
    // --- FIN DE CORRECCIÓN DE ÉLITE ---
    const t = useTranslations("WorkspaceSwitcher");
    const {
      inputValue,
      setInputValue,
      handleSaveName,
      isApiPending,
      activeWorkspaceName,
      setIsEditing,
    } = useWorkspaceInlineEditor();

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
        aria-label={t("edit_form.name_aria_label")}
        className="w-[220px]"
        {...props} // AHORA props es un objeto vacío, seguro de propagar.
      />
    );
  }
);

WorkspaceNameInput.displayName = "WorkspaceNameInput";

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Colisión de Tipos**: ((Implementada)) Se ha simplificado el contrato de props para eliminar la propagación de `React.InputHTMLAttributes`, resolviendo el error `TS2322`.
 *
 * =====================================================================
 */
// src/components/workspaces/WorkspaceNameInput.tsx
