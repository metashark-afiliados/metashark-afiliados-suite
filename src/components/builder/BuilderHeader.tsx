// src/components/builder/BuilderHeader.tsx
/**
 * @file BuilderHeader.tsx
 * @description Orquestador de UI hiper-atómico para la cabecera del constructor.
 *              Validado para la API de `zustand-undo` v1.0.1. No requiere cambios
 *              gracias a la abstracción del hook `useBuilderHeader`.
 * @author Raz Podestá
 * @version 5.1.1
 */
"use client";

import React from "react";

import { useBuilderHeader } from "@/lib/hooks/use-builder-header";
import { HeaderActions, HeaderControls, HeaderNavigation } from "./header";

export function BuilderHeader(): React.ReactElement {
  const {
    isSaving,
    isDirty,
    isPending,
    devicePreview,
    setDevicePreview,
    undo,
    redo,
    isUndoDisabled,
    isRedoDisabled,
    handleSave,
    t,
  } = useBuilderHeader();

  const isLoading = isSaving || isPending;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-6 relative">
      <HeaderNavigation t={t} />
      <HeaderControls
        undo={undo}
        redo={redo}
        isUndoDisabled={isUndoDisabled}
        isRedoDisabled={isRedoDisabled}
        currentDevice={devicePreview}
        setDevice={setDevicePreview}
      />
      <HeaderActions
        isDirty={isDirty}
        isLoading={isLoading}
        onSave={handleSave}
        t={t}
      />
    </header>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Estabilidad Arquitectónica**: ((Implementada)) La ausencia de cambios en este componente valida la robustez del patrón "Hook, Ensamblador", que aísla la UI de los cambios en la lógica de estado.
 *
 * =====================================================================
 */
// src/components/builder/BuilderHeader.tsx
