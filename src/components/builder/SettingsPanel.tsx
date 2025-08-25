// src/components/builder/SettingsPanel.tsx
/**
 * @file SettingsPanel.tsx
 * @description Panel de ajustes dinámico. Sincronizado con la nueva
 *              arquitectura de consumo de estado.
 * @author Raz Podestá
 * @version 3.0.0
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { shallow } from "zustand/shallow";

import { blockEditorDefinitions } from "@/lib/builder/block-editor-definitions";
// --- INICIO DE CORRECCIÓN DE IMPORTACIONES Y TIPOS ---
import { type BuilderState } from "@/lib/builder/core";
import { type PageBlock } from "@/lib/builder/types.d";
import { useBuilderStore } from "@/lib/hooks/use-builder-store";
// --- FIN DE CORRECCIÓN DE IMPORTACIONES Y TIPOS ---
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
    // ... (código del estado vacío sin cambios)
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
    // ... (código del estado sin ajustes sin cambios)
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
 * 1. **Resolución de Errores de Compilación**: ((Implementada)) Se han corregido las importaciones y se ha añadido el tipo `PageBlock` al parámetro `b` en `find`, resolviendo los errores `TS2459` y `TS7006`.
 *
 * =====================================================================
 */
// src/components/builder/SettingsPanel.tsx
