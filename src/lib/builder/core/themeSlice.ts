// src/lib/builder/core/themeSlice.ts
/**
 * @file themeSlice.ts
 * @description Slice de Zustand atómico. Su única responsabilidad es gestionar
 *              las mutaciones del objeto `theme` de la `Creation`, que incluye
 *              los estilos globales como la fuente y la paleta de colores.
 *              Refactorizado para alinearse con la firma de logging canónica.
 * @author L.I.A. Legacy
 * @version 2.0.0
 * @see .docs-espejo/lib/builder/core/themeSlice.ts.md
 */
import { type StateCreator } from "zustand";

import { setNestedProperty } from "@/lib/helpers/set-nested-property.helper";
import { logger } from "@/lib/logger";
import { type CampaignConfig } from "../types";

/**
 * @public
 * @interface ThemeSlice
 * @description Define el contrato de estado y acciones para el slice de tema.
 */
export interface ThemeSlice {
  /** Referencia al estado principal, será inyectada por el store ensamblador. */
  campaignConfig: CampaignConfig | null;
  /**
   * @action updateGlobalStyle
   * @description Actualiza una propiedad de estilo global en el objeto `theme`.
   *              Maneja rutas de propiedades anidadas (ej. 'globalColors.primary')
   *              de forma segura e inmutable.
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
          { propertyPath, value },
          "[ThemeSlice] Intento de actualizar estilo global sin configuración de campaña cargada."
        );
        return {};
      }

      logger.trace(
        { property: propertyPath, newValue: value },
        "[ThemeSlice] Actualizando estilo global."
      );

      // Se crea una copia profunda del objeto theme para garantizar la inmutabilidad
      // antes de pasarla al helper de mutación.
      const newTheme = JSON.parse(JSON.stringify(state.campaignConfig.theme));

      // Se utiliza el helper para asignar el valor en la ruta anidada.
      setNestedProperty(newTheme, propertyPath, value);

      const newConfig = {
        ...state.campaignConfig,
        theme: newTheme,
      };

      return { campaignConfig: newConfig };
    }),
});
