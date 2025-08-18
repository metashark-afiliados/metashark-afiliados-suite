// src/components/workspaces/WorkspaceTrigger.tsx
/**
 * @file src/components/workspaces/WorkspaceTrigger.tsx
 * @description Componente de presentación puro para el gatillo del WorkspaceSwitcher.
 *              Ha sido refactorizado para reemplazar el emoji por un icono vectorial
 *              `LayoutGrid` estándar, mejorando la consistencia del diseño.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ChevronsUpDown, LayoutGrid } from "lucide-react";

import { useWorkspaceContext } from "@/lib/hooks/use-workspace-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDashboard } from "@/lib/context/DashboardContext";

export function WorkspaceTrigger() {
  const t = useTranslations("WorkspaceSwitcher");
  const { activeWorkspace } = useDashboard();
  const {
    isEditing,
    setIsEditing,
    inputValue,
    setInputValue,
    handleSaveName,
    isApiPending,
    inputRef,
    popoverOpen,
    canEdit,
  } = useWorkspaceContext();

  return (
    <div className="w-[220px] justify-between transition-all">
      {isEditing ? (
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleSaveName}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSaveName();
            if (e.key === "Escape") {
              setIsEditing(false);
              setInputValue(activeWorkspace?.name || "");
            }
          }}
          disabled={isApiPending}
          aria-label={t("edit_form.name_aria_label")}
        />
      ) : (
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={popoverOpen}
          aria-label={t("selectWorkspace_label")}
          className="w-full justify-between h-auto py-2"
          disabled={isApiPending}
          onClick={() => canEdit && setIsEditing(true)}
          aria-disabled={!canEdit}
        >
          <div className="flex items-center gap-2 truncate">
            <LayoutGrid className="h-4 w-4 text-muted-foreground" />
            <span className="truncate font-semibold text-base">
              {isApiPending ? t("changing_status") : inputValue}
            </span>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      )}
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Consistencia de Diseño**: ((Implementada)) Se ha reemplazado el emoji por un icono `LayoutGrid` de `lucide-react`, estandarizando la apariencia del selector de workspace con el resto de la aplicación.
 *
 * @subsection Melhorias Futuras
 * 1. **Avatar de Workspace**: ((Vigente)) Considerar añadir una funcionalidad para que los usuarios puedan subir un logo para su workspace, que se mostraría aquí en lugar del icono genérico.
 *
 * =====================================================================
 */
// src/components/workspaces/WorkspaceTrigger.tsx
