// src/components/builder/BuilderHeader.tsx
/**
 * @file BuilderHeader.tsx
 * @description Orquestador de UI hiper-atómico para la cabecera del constructor.
 *              Sincronizado para consumir la API de historial completa del hook
 *              `useBuilderHeader` y pasarla a los componentes de UI atómicos.
 *              **Actualizado para permitir la edición en línea del título de la campaña.**
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";

import { EditableText } from "@/components/builder/ui/EditableText";
import { useBuilderHeader } from "@/lib/hooks/use-builder-header";
import { logger } from "@/lib/logging";
import { HeaderActions, HeaderControls, HeaderNavigation } from "./header";

/**
 * @public
 * @component BuilderHeader
 * @description Renderiza la cabecera completa del constructor.
 *              Ahora incluye un título de campaña editable en línea.
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
    updateCampaignName, // <-- Consumir la acción del hook
    campaignConfig, // <-- Acceder a campaignConfig
    t,
  } = useBuilderHeader();

  const isLoading = isSaving || isPending;
  logger.trace("[BuilderHeader] Renderizando cabecera.", {
    isDirty,
    isLoading,
    canUndo: !isUndoDisabled,
    canRedo: !isRedoDisabled,
    campaignName: campaignConfig?.name,
  });

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-6 relative">
      <HeaderNavigation t={t} />
      <div className="flex-1 flex items-center justify-center">
        <EditableText
          tag="h2"
          value={campaignConfig?.name || t("empty_campaign_name_placeholder")}
          onSave={updateCampaignName}
          className="text-lg font-semibold truncate px-2 py-1 rounded-md hover:bg-muted cursor-pointer"
          placeholder={t("empty_campaign_name_placeholder")}
        />
      </div>
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
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Edición en Línea del Título de Campaña**: ((Implementada)) Se ha integrado el componente `EditableText` para mostrar el nombre de la campaña y permitir su edición en línea. Esto mejora directamente la UX del constructor.
 * 2. **Conexión con el Store de Estado**: ((Implementada)) El `EditableText` se conecta a la acción `updateCampaignName` del hook `useBuilderHeader`, que a su vez muta el `campaignConfig` en el `BuilderStore`.
 * 3. **Mejora de la Accesibilidad y UX**: ((Implementada)) El título es ahora interactivo y se enfoca en el campo de edición al hacer doble clic, con un `placeholder` claro.
 * 4. **Estilización y Layout**: ((Implementada)) Se ha ajustado el layout del header para centrar el título y aplicar estilos sutiles para indicar que es editable.
 * 5. **Full Observabilidad**: ((Implementada)) Se ha actualizado el `logger.trace` para incluir el nombre de la campaña actual, mejorando la visibilidad en desarrollo.
 * 6. **Internacionalización Completa de Placeholder**: ((Implementada)) La clave `empty_campaign_name_placeholder` ha sido añadida a `BuilderHeader.schema.ts` y a `BuilderHeader.json`, asegurando que este texto sea traducible.
 *
 * @subsection Melhorias Futuras
 * 1. **Indicador Visual de Estado de Guardado en Título**: ((Vigente)) Cuando el título se edita y `isDirty` es `true`, el `EditableText` podría mostrar un icono de "no guardado" o cambiar su estilo para reflejar que los cambios están pendientes de ser guardados, similar al `SaveStatusButton`.
 *
 * =====================================================================
 */
