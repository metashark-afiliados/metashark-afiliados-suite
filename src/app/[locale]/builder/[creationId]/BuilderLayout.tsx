// src/app/[locale]/builder/[creationId]/BuilderLayout.tsx
/**
 * @file BuilderLayout.tsx
 * @description Orquestador de UI de cliente para el entorno del constructor.
 *              Refactorizado para implementar "Lienzo Infinito", permitiendo
 *              el scroll vertical en el área del canvas y optimizando el layout.
 * @author Raz Podestá - MetaShark Tech
 * @version 6.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import React, { useEffect } from "react";
import { shallow } from "zustand/shallow";

import { PaletteItemPreview } from "@/components/builder/BlocksPalette";
import { BuilderHeader } from "@/components/builder/BuilderHeader";
import { ContextualPanel } from "@/components/builder/panels/ContextualPanel";
import { SettingsPanel } from "@/components/builder/SettingsPanel";
import { PrimaryToolBar } from "@/components/builder/toolbar/PrimaryToolBar";
import { useBuilderStore } from "@/lib/hooks/use-builder-store";
import { useBuilderDnD } from "@/lib/hooks/useBuilderDnD";
import { logger } from "@/lib/logging";
import { cn } from "@/lib/utils";

export function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const { setOnlineStatus, activeTool } = useBuilderStore(
    (state) => ({
      setOnlineStatus: state.setOnlineStatus,
      activeTool: state.activeTool,
    }),
    shallow
  );

  const { sensors, activeId, handleDragStart, handleDragEnd, handleDragOver } =
    useBuilderDnD();

  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setOnlineStatus(navigator.onLine);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setOnlineStatus]);

  const activeTemplate =
    activeId && String(activeId).startsWith("template-")
      ? String(activeId).replace("template-", "")
      : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="flex flex-col h-screen w-full bg-muted/40">
        <BuilderHeader />
        <main
          className={cn(
            "flex-1 grid overflow-hidden",
            activeTool
              ? "grid-cols-[80px_300px_1fr_350px]"
              : "grid-cols-[80px_1fr_350px]"
          )}
          data-testid="builder-main-grid"
        >
          <aside className="bg-card border-r">
            <PrimaryToolBar />
          </aside>

          {activeTool && (
            <aside
              className="bg-card border-r overflow-y-auto transition-all duration-300 ease-in-out"
              data-testid="contextual-panel-container"
            >
              <ContextualPanel />
            </aside>
          )}

          {/* --- INICIO DE REFACTORIZACIÓN "LIENZO INFINITO" --- */}
          <div className="bg-background overflow-y-auto p-4 md:p-8">
            <div className="min-h-full">{children}</div>
          </div>
          {/* --- FIN DE REFACTORIZACIÓN "LIENZO INFINITO" --- */}

          <aside className="bg-card border-l overflow-y-auto">
            <SettingsPanel />
          </aside>
        </main>
      </div>
      <DragOverlay>
        {activeTemplate ? (
          <PaletteItemPreview blockType={activeTemplate} />
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
 * 1. **Lienzo con Scroll Vertical**: ((Implementada)) Se ha aplicado `overflow-y-auto` al contenedor del `Canvas` y `min-h-full` al `children`, permitiendo el scroll vertical.
 * 2. **Optimización de Espacio**: ((Implementada)) Se ha añadido padding (`p-4 md:p-8`) alrededor del `Canvas` para mejorar el uso del espacio y la estética, eliminando los márgenes excesivos.
 * 3. **Sincronización D&D**: ((Implementada)) Se ha actualizado la lógica del `DragOverlay` para que funcione con las nuevas `TemplateCard`.
 *
 * @subsection Melhorias Futuras
 * 1. **Zoom del Canvas**: ((Vigente)) Añadir controles en la UI para permitir al usuario hacer zoom in/out en el canvas.
 *
 * =====================================================================
 */
// src/app/[locale]/builder/[creationId]/BuilderLayout.tsx
