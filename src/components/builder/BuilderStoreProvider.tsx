// src/components/builder/BuilderStoreProvider.tsx
/**
 * @file BuilderStoreProvider.tsx
 * @description Proveedor de contexto de élite para el `BuilderStore`. Implementa
 *              el patrón de "Hydration Segura" para Zustand en el App Router.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @see .docs-espejo/components/builder/BuilderStoreProvider.tsx.md
 */
"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";

import { createBuilderStore, type BuilderStore } from "@/lib/builder/core";
import { type CampaignConfig } from "@/lib/builder/types.d";
import { clientLogger } from "@/lib/logger";

export interface BuilderStoreProviderProps {
  initialState: CampaignConfig;
  children: ReactNode;
}

const BuilderStoreContext = createContext<BuilderStore | null>(null);

/**
 * @public
 * @component BuilderStoreProvider
 * @description Componente de cliente que crea una instancia del store y la provee.
 * @param {BuilderStoreProviderProps} props - Propiedades para inicializar el proveedor.
 * @returns {React.ReactElement}
 */
export function BuilderStoreProvider({
  children,
  initialState,
}: BuilderStoreProviderProps): React.ReactElement {
  const storeRef = useRef<BuilderStore>();

  if (!storeRef.current) {
    storeRef.current = createBuilderStore();
    storeRef.current.setState({ campaignConfig: initialState });
    clientLogger.info(
      { campaignId: initialState.id },
      "[BuilderStoreProvider] Store de Zustand creado e hidratado."
    );
  }

  return (
    <BuilderStoreContext.Provider value={storeRef.current}>
      {children}
    </BuilderStoreContext.Provider>
  );
}

/**
 * @public
 * @function useBuilderStoreContext
 * @description Hook de consumo para acceder a la instancia del store desde el contexto.
 * @throws {Error} Si se usa fuera de un `BuilderStoreProvider`.
 * @returns {BuilderStore} La instancia del store de Zustand.
 */
export const useBuilderStoreContext = (): BuilderStore => {
  const store = useContext(BuilderStoreContext);
  if (!store) {
    throw new Error(
      "Error de Arquitectura: useBuilderStoreContext debe ser usado dentro de un BuilderStoreProvider."
    );
  }
  return store;
};
// src/components/builder/BuilderStoreProvider.tsx
