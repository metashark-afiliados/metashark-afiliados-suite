// src/app/[locale]/builder/[campaignId]/layout.tsx
/**
 * @file layout.tsx
 * @description Layout principal del constructor de campañas. Es un orquestador de UI
 *              de alto nivel que configura el contexto de Drag and Drop y ensambla
 *              todos los componentes principales del editor.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { DndContext, DragOverlay } from "@dnd-kit/core";

import {
  BlocksPalette,
  PaletteItemPreview,
} from "@/components/builder/BlocksPalette";
import { BuilderHeader } from "@/components/builder/BuilderHeader";
import { SettingsPanel } from "@/components/builder/SettingsPanel";
import { blockRegistry } from "@/components/templates";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBuilderStore } from "@/lib/builder/core/store";
import { useBuilderDnD } from "@/lib/hooks/useBuilderDnD";
import { LayoutTemplate, Settings } from "lucide-react";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const t = useTranslations("components.builder.BuilderHeader"); // Usado para los tabs
  const { selectedBlockId, campaignConfig } = useBuilderStore();
  const [activeTab, setActiveTab] = useState("add");
  const { sensors, activeId, handleDragStart, handleDragEnd } = useBuilderDnD();

  useEffect(() => {
    // Cambia automáticamente a la pestaña 'add' si se deselecciona un bloque
    if (!selectedBlockId && activeTab === "edit") {
      setActiveTab("add");
    }
  }, [selectedBlockId, activeTab]);

  const activeBlock =
    activeId && campaignConfig?.blocks.find((b) => b.id === activeId);
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
                  {t("Tabs.add")}
                </TabsTrigger>
                <TabsTrigger value="edit" disabled={!selectedBlockId}>
                  <Settings className="w-4 h-4 mr-2" />
                  {t("Tabs.settings")}
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
 * 1. **Consumo de Hook Atómico**: ((Implementada)) Toda la lógica de D&D ha sido extraída y ahora se consume desde el hook `useBuilderDnD`, convirtiendo este layout en un orquestador de UI mucho más limpio.
 * 2. **Composición de Orquestadores**: ((Implementada)) Este componente ensambla los orquestadores de UI de nivel inferior (`BuilderHeader`, `BlocksPalette`, `SettingsPanel`), demostrando un patrón de composición de élite.
 *
 * @subsection Melhorias Futuras
 * 1. **Paneles Redimensionables**: ((Vigente)) Integrar una librería como `react-resizable-panels` para permitir al usuario redimensionar el panel lateral de ajustes.
 *
 * =====================================================================
 */
// src/app/[locale]/builder/[campaignId]/layout.tsx
