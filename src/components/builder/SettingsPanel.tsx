// src/components/builder/SettingsPanel.tsx
/**
 * @file SettingsPanel.tsx
 * @description Panel de ajustes dinámico. Orquesta la visualización de los
 *              controles de edición para el bloque seleccionado, consumiendo el
 *              estado del `BuilderStore` y el manifiesto `blockEditorDefinitions`.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { shallow } from "zustand/shallow";

import { blockEditorDefinitions } from "@/lib/builder/block-editor-definitions";
import { type BuilderState } from "@/lib/builder/core";
import { type PageBlock } from "@/lib/builder/types.d";
import { useBuilderStore } from "@/lib/hooks/use-builder-store";
import { logger } from "@/lib/logging";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsGroup } from "./SettingsGroup";

const settingsPanelSelector = (state: BuilderState) => ({
  selectedBlockId: state.selectedBlockId,
  campaignConfig: state.campaignConfig,
  updateBlockProp: state.updateBlockProp,
  updateBlockStyle: state.updateBlockStyle,
});

export function SettingsPanel(): React.ReactElement {
  const t = useTranslations("components.builder.SettingsPanel");

  const { selectedBlockId, campaignConfig, updateBlockProp, updateBlockStyle } =
    useBuilderStore(settingsPanelSelector, shallow);

  const selectedBlock = campaignConfig?.blocks.find(
    (b: PageBlock) => b.id === selectedBlockId
  );

  logger.trace("[SettingsPanel] Renderizando panel de ajustes.", {
    selectedBlockId,
  });

  if (!selectedBlock) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <h3 className="font-semibold text-foreground">
          {t("empty_panel.title")}
        </h3>
        <p className="text-sm mt-2">{t("empty_panel.description")}</p>
      </div>
    );
  }

  const blockDefinition = blockEditorDefinitions[selectedBlock.type];

  if (!blockDefinition) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <h3 className="font-semibold text-foreground">
          {t("no_settings_for_block.title")}
        </h3>
        <p className="text-sm mt-2">
          {t.rich("no_settings_for_block.description", {
            blockType: selectedBlock.type,
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-bold text-lg border-b pb-2">
        {t("editing_block_title", { blockType: selectedBlock.type })}
      </h3>
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">{t("tabs.content")}</TabsTrigger>
          <TabsTrigger value="style">{t("tabs.style")}</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="pt-4">
          <SettingsGroup
            block={selectedBlock}
            definitions={blockDefinition.properties}
            values={selectedBlock.props}
            updateFn={updateBlockProp}
          />
        </TabsContent>
        <TabsContent value="style" className="pt-4">
          <SettingsGroup
            block={selectedBlock}
            definitions={blockDefinition.styles}
            values={selectedBlock.styles}
            updateFn={updateBlockStyle}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Panel de Edición Dinámico**: ((Implementada)) Este componente es el cerebro de la edición. Se adapta dinámicamente al bloque seleccionado y orquesta la renderización de sus controles.
 * 2. **Arquitectura Desacoplada**: ((Implementada)) Consume el estado global, el manifiesto de configuración y compone los `SettingsGroup`, actuando como un orquestador de alto nivel sin lógica de presentación de campos.
 *
 * @subsection Melhorias Futuras
 * 1. **Pestaña "Avanzado"**: ((Vigente)) Añadir una tercera pestaña para ajustes avanzados, como IDs de CSS, clases personalizadas o atributos de datos.
 *
 * =====================================================================
 */
// src/components/builder/SettingsPanel.tsx
