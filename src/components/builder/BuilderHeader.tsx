// src/components/builder/BuilderHeader.tsx
/**
 * @file BuilderHeader.tsx
 * @description Orquestador de UI hiper-atómico para la cabecera del constructor.
 *              Su responsabilidad es ensamblar los componentes de navegación,
 *              controles y acciones, consumiendo el hook soberano `useBuilderHeader`
 *              para obtener el estado y los manejadores de eventos.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import React from "react";

import { useBuilderHeader } from "@/lib/hooks/use-builder-header";
import { HeaderActions, HeaderControls, HeaderNavigation } from "./header";
import { logger } from "@/lib/logging";

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
 * 1. **Componente Estructural Fundamental**: ((Implementada)) Se ha creado la cabecera, una pieza central de la nueva UI del constructor.
 * 2. **Arquitectura "Hook, Ensamblador"**: ((Implementada)) Este componente es un ejemplo canónico de un ensamblador de UI puro que consume un hook soberano, adhiriéndose a la filosofía de desacoplamiento de élite.
 * 3. **Full Observabilidad**: ((Implementada)) Se ha añadido un log de `trace` para monitorear sus ciclos de renderizado.
 *
 * @subsection Melhorias Futuras
 * 1. **Título de la Creación Editable**: ((Vigente)) El `HeaderNavigation` podría ser extendido para mostrar el `campaignConfig.name` y permitir la edición en línea, similar al `WorkspaceTrigger`.
 * 2. **Menú de "Publicar"**: ((Vigente)) El `HeaderActions` es el lugar canónico para añadir un botón "Publicar", que abriría un modal para crear una `Campaign` a partir de la `Creation` actual.
 *
 * =====================================================================
 */
// src/components/builder/BuilderHeader.tsx
