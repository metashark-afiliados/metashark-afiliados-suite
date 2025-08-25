// src/lib/hooks/useTemplateGalleryStore.ts
/**
 * @file useTemplateGalleryStore.ts
 * @description Store de estado global de Zustand. Es la Única Fuente de Verdad (SSoT)
 *              para gestionar el estado de la UI del modal de la galería de plantillas.
 *              Desacopla el componente que abre el modal (`BlockLibrary`) del modal mismo.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { create } from "zustand";

import { type BlockCategoryId } from "@/config/block-categories.config";
import { logger } from "@/lib/logging";

/**
 * @public
 * @interface TemplateGalleryState
 * @description Define la estructura del estado y las acciones para el store.
 */
interface TemplateGalleryState {
  /** Determina si el modal de la galería está visible. */
  isOpen: boolean;
  /**
   * Almacena el ID de la categoría de bloques que se está mostrando actualmente en el modal.
   * `null` si el modal está cerrado.
   */
  activeCategoryId: BlockCategoryId | null;
  /**
   * @action open
   * @description Abre el modal de la galería para una categoría específica.
   * @param {BlockCategoryId} categoryId - El ID de la categoría a mostrar.
   */
  open: (categoryId: BlockCategoryId) => void;
  /**
   * @action close
   * @description Cierra el modal de la galería y resetea la categoría activa.
   */
  close: () => void;
}

/**
 * @public
 * @constant useTemplateGalleryStore
 * @description Hook de Zustand que proporciona acceso al estado del modal de la galería
 *              y a las acciones para manipularlo desde cualquier componente de cliente.
 */
export const useTemplateGalleryStore = create<TemplateGalleryState>((set) => ({
  isOpen: false,
  activeCategoryId: null,
  open: (categoryId) => {
    logger.trace(
      `[Zustand:TemplateGallery] Abriendo galería para la categoría: ${categoryId}`
    );
    set({ isOpen: true, activeCategoryId: categoryId });
  },
  close: () => {
    logger.trace("[Zustand:TemplateGallery] Cerrando galería.");
    set({ isOpen: false, activeCategoryId: null });
  },
}));

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Estado Global Desacoplado**: ((Implementada)) Este store es una implementación de élite de la "Filosofía LEGO". Permite que el `BlockLibrary` y el `TemplateGalleryModal` se comuniquen sin tener conocimiento directo el uno del otro, maximizando la modularidad.
 * 2. **API Semántica y Observable**: ((Implementada)) Las acciones (`open`, `close`) proporcionan una API clara e intencionada, y su invocación se registra para una observabilidad completa del flujo de usuario.
 *
 * @subsection Melhorias Futuras
 * 1. **Gestión de Estado Interno del Modal**: ((Vigente)) El store podría expandirse para gestionar el estado interno del modal, como el término de búsqueda o los filtros aplicados dentro de la galería de plantillas.
 * 2. **Persistencia de Sesión para DX**: ((Vigente)) Se podría utilizar el middleware `persist` de Zustand para guardar la última categoría abierta en `sessionStorage`, de modo que al recargar la página durante el desarrollo, el modal se vuelva a abrir automáticamente, acelerando el ciclo de depuración.
 *
 * =====================================================================
 */
// src/lib/hooks/useTemplateGalleryStore.ts
