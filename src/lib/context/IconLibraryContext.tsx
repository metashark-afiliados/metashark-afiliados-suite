// src/lib/context/IconLibraryContext.tsx
/**
 * @file IconLibraryContext.tsx
 * @description Proveedor de contexto de React para la gestión de la librería de iconos activa.
 *              Ha sido simplificado radicalmente; su única responsabilidad es proveer
 *              el ID de la librería de iconos activa a sus componentes consumidores.
 *              Corregido un error de tipeo sintáctico en la etiqueta de cierre.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.1
 * @date 2025-08-30
 */
"use client";

import React, { createContext, useContext, useMemo } from "react";

import { type IconLibraryDefinition } from "@/config/icon-libraries.config";
import { clientLogger } from "@/lib/logger";

export interface IconLibraryContextValue {
  activeLibraryId: IconLibraryDefinition["id"];
}

const IconLibraryContext = createContext<IconLibraryContextValue | undefined>(
  undefined
);

export const IconLibraryProvider: React.FC<{
  children: React.ReactNode;
  activeLibraryId: IconLibraryDefinition["id"];
}> = ({ children, activeLibraryId }) => {
  clientLogger.trace(
    `[IconLibraryProvider] Proveyendo librería activa: '${activeLibraryId}'.`
  );

  const contextValue = useMemo(
    () => ({
      activeLibraryId,
    }),
    [activeLibraryId]
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
// src/lib/context/IconLibraryContext.tsx
