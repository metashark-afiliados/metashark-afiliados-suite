// src/components/builder/SettingsPanel.tsx
/**
 * @file SettingsPanel.tsx
 * @description Panel de ajustes refactorizado a un orquestador de UI puro.
 *              Ahora renderiza condicionalmente el `SiteAssignmentControl` cuando
 *              detecta una campaña no asignada, cumpliendo con la nueva arquitectura.
 * @author Raz Podestá
 * @version 3.0.0
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { shallow } from "zustand/shallow";

import { blockEditorDefinitions } from "@/lib/builder/block-editor-definitions";
import { useBuilderStore } from "@/lib/builder/core/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { SettingsGroup } from "./SettingsGroup";
import { SiteAssignmentControl } from "./SiteAssignmentControl";

/**
 * @public
 * @component SettingsPanel
 * @description Panel de ajustes dinámico y contextual para los bloques del constructor.
 * @returns {React.ReactElement}
 */
export function SettingsPanel(): React.ReactElement {
  const t = useTranslations("BuilderPage.SettingsPanel");
  const { selectedBlockId, campaignConfig, updateBlockProp, updateBlockStyle } =
    useBuilderStore(
      (state) => ({
        selectedBlockId: state.selectedBlockId,
        campaignConfig: state.campaignConfig,
        updateBlockProp: state.updateBlockProp,
        updateBlockStyle: state.updateBlockStyle,
      }),
      shallow
    );

  const selectedBlock = campaignConfig?.blocks.find(
    (b) => b.id === selectedBlockId
  );

  const isCampaignUnassigned = campaignConfig && !campaignConfig.site_id;

  // --- ARQUITECTURA v12.0: RENDERIZADO CONDICIONAL ---
  if (isCampaignUnassigned) {
    return <SiteAssignmentControl campaignId={campaignConfig.id} />;
  }

  if (!selectedBlock) {
    return (
      <div className="p-4 text-center">
        <h3 className="font-semibold">{t("empty_panel.title")}</h3>
        <p className="text-sm text-muted-foreground mt-2">
          {t("empty_panel.description")}
        </p>
      </div>
    );
  }

  const blockDefinition = blockEditorDefinitions[selectedBlock.type];

  if (!blockDefinition) {
    return (
      <div className="p-4 text-center">
        <h3 className="font-semibold">{t("no_settings_for_block.title")}</h3>
        <p className="text-sm text-muted-foreground mt-2">
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
 * 1. **Implementación de Asignación Diferida**: ((Implementada)) El panel ahora renderiza condicionalmente el `SiteAssignmentControl`, completando la implementación del flujo de usuario de "Asignación Diferida".
 * 2. **Resolución de Error de Compilación**: ((Implementada)) La nueva lógica resuelve el error de compilación `TS2339` que existía previamente.
 *
 * @subsection Melhorias Futuras
 * 1. **Pestaña de "Publicación"**: ((Vigente)) En lugar de reemplazar toda la UI, el `SiteAssignmentControl` podría ser renderizado dentro de una nueva pestaña "Publicar" junto a "Contenido" y "Estilo".
 *
 * =====================================================================
 */
// src/components/builder/SettingsPanel.tsx
