// src/lib/context/IconLibraryContext.tsx
/**
 * @file IconLibraryContext.tsx
 * @description Proveedor de contexto de React para la gestión de librerías de iconos.
 *              Este aparato es fundamental para la implementación de la
 *              intercambiabilidad de librerías de iconos en la UI, desacoplando
 *              el componente `DynamicIcon` de una librería específica.
 *              Provee el mapeo de iconos de la librería activa a sus consumidores.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */

"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ICON_LIBRARIES_MANIFEST,
  type IconLibraryDefinition,
} from "@/config/icon-libraries.config";
import { clientLogger } from "@/lib/logging";

/**
 * @public
 * @interface IconLibraryContextValue
 * @description Define el contrato de los datos que se proveen a través del contexto.
 */
export interface IconLibraryContextValue {
  /**
   * Un objeto que mapea nombres de iconos (en PascalCase) a sus componentes React.
   * Por ejemplo: `{ "ArrowRight": ArrowRightComponent }`.
   */
  icons: Record<string, React.ElementType> | null;
  /**
   * Indica si la librería de iconos está actualmente cargándose.
   */
  isLoading: boolean;
  /**
   * El ID de la librería de iconos activa actualmente.
   */
  activeLibraryId: IconLibraryDefinition["id"] | null;
  /**
   * Un mensaje de error si hubo un problema al cargar la librería.
   */
  error: string | null;
}

const IconLibraryContext = createContext<IconLibraryContextValue | undefined>(
  undefined
);

/**
 * @public
 * @component IconLibraryProvider
 * @description Componente proveedor que carga dinámicamente la librería de iconos
 *              seleccionada y la pone a disposición de sus componentes hijos a través del contexto.
 * @param {object} props
 * @param {React.ReactNode} props.children - Los componentes hijos que consumirán el contexto.
 * @param {IconLibraryDefinition["id"]} props.activeLibraryId - El ID de la librería de iconos a cargar.
 * @returns {React.ReactElement}
 */
export const IconLibraryProvider: React.FC<{
  children: React.ReactNode;
  activeLibraryId: IconLibraryDefinition["id"];
}> = ({ children, activeLibraryId }) => {
  const [loadedIcons, setLoadedIcons] = useState<Record<
    string,
    React.ElementType
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIcons = async () => {
      setIsLoading(true);
      setError(null);
      setLoadedIcons(null); // Limpiar iconos anteriores al cargar una nueva librería

      const libraryDef = ICON_LIBRARIES_MANIFEST.find(
        (def) => def.id === activeLibraryId
      );

      if (!libraryDef) {
        const errorMessage = `[IconLibraryProvider] Librería de iconos no encontrada para ID: '${activeLibraryId}'.`;
        clientLogger.warn(errorMessage);
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      clientLogger.info(
        `[IconLibraryProvider] Cargando dinámicamente la librería: '${libraryDef.name}' (${libraryDef.packageName})...`
      );

      try {
        const iconsMap = await libraryDef.importFn();
        setLoadedIcons(iconsMap);
        clientLogger.info(
          `[IconLibraryProvider] Librería '${libraryDef.name}' cargada con éxito. Total de iconos: ${Object.keys(iconsMap).length}.`
        );
      } catch (err: any) {
        const errorMessage = `[IconLibraryProvider] Fallo al cargar la librería '${libraryDef.name}': ${err.message || "Error desconocido"}.`;
        clientLogger.error(errorMessage, err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadIcons();
  }, [activeLibraryId]);

  const contextValue = useMemo(
    () => ({
      icons: loadedIcons,
      isLoading,
      activeLibraryId,
      error,
    }),
    [loadedIcons, isLoading, activeLibraryId, error]
  );

  return (
    <IconLibraryContext.Provider value={contextValue}>
      {children}
    </IconLibraryContext.Provider>
  );
};

/**
 * @public
 * @function useIconLibrary
 * @description Hook personalizado para consumir de forma segura el `IconLibraryContext`.
 * @throws {Error} Si se usa fuera de un `IconLibraryProvider`.
 * @returns {IconLibraryContextValue} Los datos de la librería de iconos activa.
 */
export const useIconLibrary = (): IconLibraryContextValue => {
  const context = useContext(IconLibraryContext);
  if (context === undefined) {
    throw new Error(
      "Error de Arquitectura: useIconLibrary debe ser utilizado dentro de un IconLibraryProvider."
    );
  }
  return context;
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Creación de Contexto Soberano**: ((Implementada)) Este nuevo aparato establece un contexto React que centraliza la lógica de carga y provisión de librerías de iconos, desacoplando `DynamicIcon` y preparando el terreno para la intercambiabilidad de librerías.
 * 2. **Carga Dinámica y Control de Estado**: ((Implementada)) El proveedor utiliza `useEffect` para cargar dinámicamente la librería seleccionada, gestionando los estados `isLoading` y `error`.
 * 3. **Optimización con Memoización**: ((Implementada)) El valor del contexto se memoiza con `useMemo` para garantizar la estabilidad referencial y prevenir re-renders innecesarios.
 * 4. **Manejo Robusto de Errores y Logging**: ((Implementada)) Incluye validación de `activeLibraryId` y `try/catch` para errores de importación, con logs contextuales a través de `clientLogger`.
 * 5. **Documentación TSDoc de Élite**: ((Implementada)) Cada interfaz, componente y hook está completamente documentado para claridad y mantenibilidad.
 *
 * @subsection Melhorias Futuras
 * 1. **Manejo de Versiones de Librería**: ((Vigente)) El `IconLibraryProvider` podría ser mejorado para aceptar una `version: string` como prop (o parte de `activeLibraryId`) para cargar diferentes versiones de la misma librería si es necesario (ej. `lucide-react@0.200` vs `lucide-react@0.300`).
 * 2. **Fallback de Iconos Global**: ((Vigente)) Si un icono no se encuentra en la librería activa, el proveedor podría intentar buscarlo en una librería de fallback global (ej. `lucide-react` siempre como fallback).
 * 3. **Caché en Memoria de Librerías**: ((Vigente)) Para evitar re-importaciones si el usuario cambia de librería y luego vuelve a una ya cargada, se podría implementar un caché en memoria dentro del proveedor.
 *
 * =====================================================================
 */
// src/lib/context/IconLibraryContext.tsx
