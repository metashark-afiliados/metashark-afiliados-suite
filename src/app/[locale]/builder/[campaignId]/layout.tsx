// src/app/[locale]/builder/[campaignId]/layout.tsx
/**
 * @file layout.tsx
 * @description Layout principal del constructor. Nivelado a un estándar de élite
 *              con tipado explícito en los callbacks para máxima robustez y claridad.
 * @author Raz Podestá
 * @version 3.2.0
 */
"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { LayoutTemplate, Settings } from "lucide-react";

import {
  BlocksPalette,
  PaletteItemPreview,
} from "@/components/builder/BlocksPalette";
import { BuilderHeader } from "@/components/builder/BuilderHeader";
import { SettingsPanel } from "@/components/builder/SettingsPanel";
import { StatusBar } from "@/components/builder/ui/StatusBar";
import { blockRegistry } from "@/components/templates";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBuilderStore } from "@/lib/builder/core/store";
import { useBuilderDnD } from "@/lib/hooks/useBuilderDnD";
import { type PageBlock } from "@/lib/builder/types.d";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const t = useTranslations("BuilderPage.Header.Tabs");
  const { selectedBlockId, campaignConfig } = useBuilderStore();
  const [activeTab, setActiveTab] = useState("add");
  const { sensors, activeId, handleDragStart, handleDragEnd } = useBuilderDnD();

  useEffect(() => {
    if (!selectedBlockId && activeTab === "edit") {
      setActiveTab("add");
    }
  }, [selectedBlockId, activeTab]);

  // --- INICIO DE REFACTORIZACIÓN DE ÉLITE: TIPADO EXPLÍCITO ---
  const activeBlock =
    activeId &&
    campaignConfig?.blocks.find((b: PageBlock) => b.id === activeId);
  // --- FIN DE REFACTORIZACIÓN DE ÉLITE ---

  const isDraggingFromPalette =
    activeId && String(activeId).startsWith("palette-");

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-screen w-screen flex-col bg-muted">
        <BuilderHeader />
        <div className="flex flex-1 overflow-hidden">
          <aside className="flex h-full w-96 flex-col border-r bg-card">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex flex-1 flex-col"
            >
              <TabsList className="grid w-full grid-cols-2 m-2">
                <TabsTrigger value="add">
                  <LayoutTemplate className="w-4 h-4 mr-2" />
                  {t("add")}
                </TabsTrigger>
                <TabsTrigger value="edit" disabled={!selectedBlockId}>
                  <Settings className="w-4 h-4 mr-2" />
                  {t("settings")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="add" className="flex-1 overflow-y-auto">
                <BlocksPalette />
              </TabsContent>
              <TabsContent value="edit" className="flex-1 overflow-y-auto">
                <SettingsPanel />
              </TabsContent>
            </Tabs>
          </aside>
          <main className="flex-1 h-full overflow-auto">{children}</main>
        </div>
        <StatusBar />
      </div>
      <DragOverlay>
        {activeId ? (
          isDraggingFromPalette ? (
            <PaletteItemPreview
              blockType={String(activeId).replace("palette-", "")}
            />
          ) : activeBlock ? (
            React.createElement(blockRegistry[activeBlock.type], {
              ...activeBlock.props,
              style: activeBlock.styles,
            })
          ) : (
            <Button variant="outline">Elemento Desconocido</Button>
          )
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Robustez de Tipos**: ((Implementada)) Se ha añadido el tipo explícito `PageBlock` al callback de `find`, eliminando el `any` implícito y blindando el código.
 *
 * =====================================================================
 */
// src/app/[locale]/builder/[campaignId]/layout.tsx
