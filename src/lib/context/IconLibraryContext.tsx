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

export interface IconLibraryContextValue {
  icons: Record<string, React.ElementType> | null;
  isLoading: boolean;
  activeLibraryId: IconLibraryDefinition["id"] | null;
  error: string | null;
}

const IconLibraryContext = createContext<IconLibraryContextValue | undefined>(
  undefined
);

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
      setLoadedIcons(null);

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
 * @subsection Melhorias Novas
 * 1. **Manejo de Versiones de Librería**: ((Vigente)) El `IconLibraryProvider` podría ser mejorado para aceptar una `version: string` como prop (o parte de `activeLibraryId`) para cargar diferentes versiones de la misma librería si es necesario (ej. `lucide-react@0.200` vs `lucide-react@0.300`).
 * 2. **Fallback de Iconos Global**: ((Vigente)) Si un icono no se encuentra en la librería activa, el proveedor podría intentar buscarlo en una librería de fallback global (ej. `lucide-react` siempre como fallback).
 * 3. **Caché en Memoria de Librerías**: ((Vigente)) Para evitar re-importaciones si el usuario cambia de librería y luego vuelve a una ya cargada, se podría implementar un caché en memoria dentro del proveedor.
 *
 * =====================================================================
 */
// src/lib/context/IconLibraryContext.tsx
