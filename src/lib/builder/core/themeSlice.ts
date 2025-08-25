// src/lib/builder/core/themeSlice.ts
/**
 * @file themeSlice.ts
 * @description Slice de Zustand atómico. Su única responsabilidad es gestionar
 *              las mutaciones del objeto `theme` de la `Creation`, que incluye
 *              los estilos globales como la fuente y la paleta de colores.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-24
 * @license MIT
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type StateCreator } from "zustand";

import { setNestedProperty } from "@/lib/helpers/set-nested-property.helper";
import { logger } from "@/lib/logging";
import { type CampaignConfig } from "../types";

/**
 * @public
 * @interface ThemeSlice
 * @description Define el contrato de estado y acciones para este slice.
 */
export interface ThemeSlice {
  /** Referencia al estado principal, será inyectada por el store ensamblador. */
  campaignConfig: CampaignConfig | null;
  /**
   * @action updateGlobalStyle
   * @description Actualiza una propiedad de estilo global en el objeto `theme`.
   *              Maneja rutas de propiedades anidadas (ej. 'globalColors.primary').
   * @param {string} propertyPath - La ruta de la propiedad a actualizar.
   * @param {string} value - El nuevo valor para la propiedad.
   */
  updateGlobalStyle: (propertyPath: string, value: string) => void;
}

/**
 * @public
 * @function createThemeSlice
 * @description Factoría que crea el slice de Zustand para las mutaciones del tema.
 * @param {StateCreator} set - La función `set` de Zustand para actualizar el estado.
 * @returns {ThemeSlice} El objeto del slice.
 */
export const createThemeSlice: StateCreator<ThemeSlice, [], [], ThemeSlice> = (
  set
) => ({
  campaignConfig: null,

  updateGlobalStyle: (propertyPath, value) =>
    set((state) => {
      if (!state.campaignConfig) {
        logger.warn(
          "[ThemeSlice] Intento de actualizar estilo global sin configuración de campaña cargada."
        );
        return {};
      }

      logger.trace("[ThemeSlice] Actualizando estilo global.", {
        property: propertyPath,
        newValue: value,
      });

      // Crear una copia profunda del objeto theme para asegurar la inmutabilidad.
      const newTheme = JSON.parse(JSON.stringify(state.campaignConfig.theme));

      // Utilizar el helper para asignar el valor en la ruta anidada.
      setNestedProperty(newTheme, propertyPath, value);

      const newConfig = {
        ...state.campaignConfig,
        theme: newTheme,
      };

      return { campaignConfig: newConfig };
    }),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad de Estado (SRP)**: ((Implementada)) Este nuevo slice aísla completamente la lógica de mutación del tema, mejorando la organización del store y adhiriéndose al Principio de Responsabilidad Única.
 * 2. **Manejo de Anidamiento Robusto**: ((Implementada)) Utiliza el helper `setNestedProperty` para manejar de forma segura la actualización de propiedades anidadas como `globalColors.primary`, haciendo la acción `updateGlobalStyle` potente y flexible.
 * 3. **Inmutabilidad Garantizada**: ((Implementada)) Utiliza `JSON.parse(JSON.stringify(...))` para crear una copia profunda del objeto `theme`, garantizando que el estado se actualice de forma inmutable y previniendo efectos secundarios inesperados.
 *
 * @subsection Melhorias Futuras
 * 1. **Acción `applyBrandKit`**: ((Vigente)) Añadir una nueva acción `applyBrandKit(brandKit: BrandKit)` que reemplace el objeto `theme` completo con los colores y fuentes de un "Brand Kit" cargado desde la base de datos.
 * 2. **Validación de Propiedades**: ((Vigente)) La acción `updateGlobalStyle` podría validar `propertyPath` contra las claves permitidas en `CampaignThemeSchema` de Zod antes de aplicar la actualización, para una mayor seguridad de datos.
 *
 * =====================================================================
 */
// src/lib/builder/core/themeSlice.ts
