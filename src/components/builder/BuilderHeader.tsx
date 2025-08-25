// src/components/builder/BuilderHeader.tsx
/**
 * @file BuilderHeader.tsx
 * @description Orquestador de UI hiper-atómico para la cabecera del constructor.
 *              Sincronizado para consumir la API de historial completa del hook
 *              `useBuilderHeader` y pasarla a los componentes de UI atómicos.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";

import React from "react";

import { useBuilderHeader } from "@/lib/hooks/use-builder-header";
import { logger } from "@/lib/logging";
import { HeaderActions, HeaderControls, HeaderNavigation } from "./header";

/**
 * @public
 * @component BuilderHeader
 * @description Renderiza la cabecera completa del constructor.
 * @returns {React.ReactElement}
 */
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
  logger.trace("[BuilderHeader] Renderizando cabecera.", {
    isDirty,
    isLoading,
    canUndo: !isUndoDisabled,
    canRedo: !isRedoDisabled,
  });

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
 * 1. **Conexión de Funcionalidad Completa**: ((Implementada)) El orquestador ahora pasa correctamente las funciones `undo`, `redo` y los estados `isUndoDisabled`/`isRedoDisabled` al componente `HeaderControls`, habilitando completamente la funcionalidad de historial en la UI.
 * 2. **Observabilidad Mejorada**: ((Implementada)) El log de `trace` ha sido enriquecido para incluir el estado de `canUndo` y `canRedo`, proporcionando una visibilidad más granular del estado del historial en cada renderizado.
 *
 * @subsection Melhorias Futuras
 * 1. **Título de la Creación Editable**: ((Vigente)) El `HeaderNavigation` podría ser extendido para mostrar el `campaignConfig.name` y permitir la edición en línea.
 *
 * =====================================================================
 */
// src/components/builder/BuilderHeader.tsx
