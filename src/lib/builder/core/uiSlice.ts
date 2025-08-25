// src/lib/builder/core/uiSlice.ts
/**
 * @file lib/builder/core/uiSlice.ts
 * @description Slice de Zustand que gestiona todo el estado relacionado con la
 *              Interfaz de Usuario del constructor. Es la SSoT para el estado
 *              visual y de interacción. Sincronizado para incluir la gestión
 *              de la herramienta activa para los nuevos paneles contextuales.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-24
 * @license MIT
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { type StateCreator } from "zustand";

import { type ContextualPanelType } from "@/components/builder/toolbar/PrimaryToolBar.config";
import { logger } from "@/lib/logging";

/**
 * @public
 * @typedef DevicePreview
 * @description Tipos de dispositivos para la previsualización del lienzo.
 */
export type DevicePreview = "desktop" | "tablet" | "mobile";

/**
 * @public
 * @interface UISlice
 * @description Define la estructura del estado y las acciones para el slice de UI.
 *              Este contrato es la API interna para la manipulación del estado
 *              visual del constructor.
 */
export interface UISlice {
  /** El ID del bloque seleccionado actualmente para edición. `null` si no hay selección. */
  selectedBlockId: string | null;
  /** El dispositivo de previsualización activo en el Canvas. */
  devicePreview: DevicePreview;
  /**
   * La herramienta activa en la `PrimaryToolBar`, que determina qué panel
   * contextual (ej. Biblioteca de Bloques) se muestra. `null` si ninguna está activa.
   */
  activeTool: ContextualPanelType | null;
  /** El estado de conexión del navegador. `true` si está online. */
  isOnline: boolean;
  /** Acción para establecer el bloque seleccionado. */
  setSelectedBlockId: (blockId: string | null) => void;
  /** Acción para cambiar el dispositivo de previsualización. */
  setDevicePreview: (device: DevicePreview) => void;
  /** Acción para establecer la herramienta activa. */
  setActiveTool: (tool: ContextualPanelType | null) => void;
  /** Acción para actualizar el estado de conexión. */
  setOnlineStatus: (status: boolean) => void;
}

/**
 * @public
 * @function createUISlice
 * @description Factoría que crea el slice de Zustand para la gestión de la UI del constructor.
 * @param {StateCreator} set - La función `set` de Zustand para actualizar el estado.
 * @returns {UISlice} El objeto de estado y acciones del slice de UI.
 */
export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
  selectedBlockId: null,
  devicePreview: "desktop",
  activeTool: "design", // Por defecto, la herramienta de diseño está activa.
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
 * 1. **Gestión de Paneles Contextuales**: ((Implementada)) Se han añadido `activeTool` y `setActiveTool` al store. Esta es la base de estado para la nueva arquitectura de 4 columnas, permitiendo al `BuilderLayout` renderizar paneles contextuales dinámicamente.
 * 2. **Resolución de Dependencia de Compilación**: ((Implementada)) Esta refactorización satisface la dependencia del componente `PrimaryToolBar.tsx`, resolviendo el error de compilación inminente.
 *
 * @subsection Melhorias Futuras
 * 1. **Modo de Enfoque (`focusMode`)**: ((Vigente)) Añadir una propiedad booleana `isFocusMode: boolean` y una acción `toggleFocusMode`. Cuando esté activo, el `BuilderLayout` podría ocultar todos los paneles para maximizar el área del `Canvas`.
 * 2. **Estado de Carga de Assets**: ((Vigente)) Introducir una propiedad `loadingAssets: string[]` (un array de URLs) y acciones `addLoadingAsset`/`removeLoadingAsset`. Esto permitiría que la UI muestre un indicador de carga global cuando se estén subiendo imágenes.
 * 3. **Historial de Selección de Bloques**: ((Vigente)) Mantener un array `selectionHistory: string[]` que registre los últimos 5 `selectedBlockId`. Esto permitiría implementar una funcionalidad de "Ir a la selección anterior/siguiente".
 *
 * =====================================================================
 */
// src/lib/builder/core/uiSlice.ts
