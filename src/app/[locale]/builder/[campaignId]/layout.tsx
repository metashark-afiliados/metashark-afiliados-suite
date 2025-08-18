// src/app/[locale]/builder/[campaignId]/layout.tsx
/**
 * @file layout.tsx
 * @description Layout principal del constructor. Refactorizado para integrar
 *              la `StatusBar`, completando la arquitectura de resiliencia
 *              "Guardián de Datos".
 * @author Raz Podestá
 * @version 2.0.0
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
        <StatusBar /> {/* <-- INTEGRACIÓN DE ÉLITE */}
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
 * 1. **Integración del "Guardián de Datos"**: ((Implementada)) Se ha añadido la `StatusBar` al layout, completando la implementación de la arquitectura de resiliencia y proporcionando al usuario una visibilidad constante del estado de su trabajo.
 *
 * @subsection Melhorias Futuras
 * 1. **Paneles Redimensionables**: ((Vigente)) Integrar `react-resizable-panels` para permitir al usuario redimensionar el panel lateral de ajustes.
 *
 * =====================================================================
 */
// src/app/[locale]/builder/[campaignId]/layout.tsx
