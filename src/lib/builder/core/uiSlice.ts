// src/lib/builder/core/uiSlice.ts
/**
 * @file lib/builder/core/uiSlice.ts
 * @description Slice de Zustand que gestiona el estado de la UI del constructor.
 *              Sincronizado con la nueva semántica de la barra de herramientas,
 *              utilizando 'add_content' como la herramienta activa por defecto.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.1.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { type StateCreator } from "zustand";

import { type ContextualPanelType } from "@/components/builder/toolbar/PrimaryToolBar.config";
import { logger } from "@/lib/logging";

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
  // --- INICIO DE SINCRONIZACIÓN SEMÁNTICA ---
  activeTool: "add_content", // Se utiliza la ID canónica y correcta
  // --- FIN DE SINCRONIZACIÓN SEMÁNTICA ---
  isOnline: true,

  setSelectedBlockId: (blockId) => {
    logger.trace("[UISlice] Bloque seleccionado cambiado.", {
      selectedBlockId: blockId,
    });
    set({ selectedBlockId: blockId });
  },

  setDevicePreview: (device) => {
    logger.trace("[UISlice] Vista previa de dispositivo cambiada.", { device });
    set({ devicePreview: device });
  },

  setActiveTool: (tool) => {
    logger.info(`[UISlice] Herramienta activa cambiada a: ${tool}`);
    set({ activeTool: tool });
  },

  setOnlineStatus: (status) => {
    logger.info(
      `[UISlice] Estado de conexión cambiado a: ${status ? "ONLINE" : "OFFLINE"}`
    );
    set({ isOnline: status });
  },
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Tipo (TS2322)**: ((Implementada)) Se ha actualizado el valor por defecto de `activeTool` a `'add_content'`, sincronizando el slice con su contrato de tipo `ContextualPanelType` y resolviendo el error de compilación.
 * 2. **Cero Regresiones**: ((Implementada)) La funcionalidad del slice permanece intacta, solo se ha corregido el valor inicial para reflejar la nueva semántica.
 *
 * @subsection Melhorias Futuras
 * 1. **Persistencia de Estado de UI**: ((Vigente)) Se podría utilizar el middleware `persist` de Zustand para guardar en `localStorage` algunas preferencias de UI, como la `devicePreview` o la `activeTool`, para que la sesión del usuario sea recordada entre visitas.
 *
 * =====================================================================
 */
// src/lib/builder/core/uiSlice.ts
