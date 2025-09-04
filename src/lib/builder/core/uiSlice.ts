// src/lib/builder/core/uiSlice.ts
/**
 * @file lib/builder/core/uiSlice.ts
 * @description Slice de Zustand que gestiona el estado de la UI del constructor.
 *              Refactorizado para usar `clientLogger` con la firma correcta.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
"use client";

import { type StateCreator } from "zustand";

import { type ContextualPanelType } from "@/components/builder/toolbar/PrimaryToolBar.config";
import { clientLogger } from "@/lib/logger";

export type DevicePreview = "desktop" | "tablet" | "mobile";

export interface UISlice {
  selectedBlockId: string | null;
  devicePreview: DevicePreview;
  activeTool: ContextualPanelType | null;
  isOnline: boolean;
  setSelectedBlockId: (blockId: string | null) => void;
  setDevicePreview: (device: DevicePreview) => void;
  setActiveTool: (tool: ContextualPanelType | null) => void;
  setOnlineStatus: (status: boolean) => void;
}

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
  selectedBlockId: null,
  devicePreview: "desktop",
  activeTool: "add_content",
  isOnline: true,

  setSelectedBlockId: (blockId) => {
    clientLogger.trace("[UISlice] Bloque seleccionado cambiado.", {
      selectedBlockId: blockId,
    });
    set({ selectedBlockId: blockId });
  },

  setDevicePreview: (device) => {
    clientLogger.trace("[UISlice] Vista previa de dispositivo cambiada.", {
      device,
    });
    set({ devicePreview: device });
  },

  setActiveTool: (tool) => {
    clientLogger.info(
      `[UISlice] Herramienta activa cambiada a: ${tool || "ninguna"}`
    );
    set({ activeTool: tool });
  },

  setOnlineStatus: (status) => {
    clientLogger.info(
      `[UISlice] Estado de conexión cambiado a: ${status ? "ONLINE" : "OFFLINE"}`
    );
    set({ isOnline: status });
  },
});
// src/lib/builder/core/uiSlice.ts
