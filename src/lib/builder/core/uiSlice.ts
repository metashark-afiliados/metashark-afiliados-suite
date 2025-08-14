// src/lib/builder/core/uiSlice.ts
/**
 * @file lib/builder/core/uiSlice.ts
 * @description Slice de Zustand que gestiona el estado relacionado con la Interfaz de Usuario
 *              del constructor, como el bloque seleccionado y el modo de previsualización.
 *              Esta es una pieza atómica de la "máquina de estado" del constructor.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { type StateCreator } from "zustand";
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
 */
export interface UISlice {
  selectedBlockId: string | null;
  devicePreview: DevicePreview;
  setSelectedBlockId: (blockId: string | null) => void;
  setDevicePreview: (device: DevicePreview) => void;
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
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este slice extrae y encapsula perfectamente la gestión del estado de la UI (bloque seleccionado, vista previa), mejorando la modularidad del store principal.
 * 2. **Full Observabilidad**: ((Implementada)) Cada cambio de estado de la UI ahora es registrado con `logger.trace`, proporcionando una visibilidad completa del comportamiento del usuario dentro del constructor.
 *
 * @subsection Melhorias Futuras
 * 1. **Modo de Vista (Zoom)**: ((Vigente)) Añadir al slice una propiedad `zoomLevel: number` y acciones para controlarlo, permitiendo al usuario acercar o alejar el lienzo.
 * 2. **Estado de Panoramización (Panning)**: ((Vigente)) Si se implementa una funcionalidad de arrastrar el lienzo, incluir propiedades `panX: number` y `panY: number` con sus correspondientes acciones para gestionar el desplazamiento del canvas.
 *
 * =====================================================================
 */
// src/lib/builder/core/uiSlice.ts
