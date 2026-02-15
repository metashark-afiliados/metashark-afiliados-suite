// src/components/builder/BuilderStoreProvider.tsx
/**
 * @file BuilderStoreProvider.tsx
 * @description Proveedor de contexto de élite para el `BuilderStore`. Implementa
 *              el patrón de "Hydration Segura" para Zustand en el App Router.
 *              Sincronizado con la arquitectura de SSoT canónica del núcleo de estado.
 * @author L.I.A. Legacy
 * @version 2.0.0
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 * @date 2025-08-24
 */
"use client";

import { createContext, useRef, type ReactNode, useContext } from "react";
import { useStore } from "zustand";

import { createBuilderStore, type BuilderStore } from "@/lib/builder/core";
import { type CampaignConfig } from "@/lib/builder/types.d";
import { logger } from "@/lib/logging";

/**
 * @public
 * @interface BuilderStoreProviderProps
 * @description Contrato de props para el proveedor.
 */
export interface BuilderStoreProviderProps {
  /**
   * El estado inicial para hidratar el store, preparado por un Server Component.
   */
  initialState: CampaignConfig;
  /**
   * Los componentes hijos que tendrán acceso al store.
   */
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
    logger.info("[BuilderStoreProvider] Store de Zustand creado e hidratado.", {
      campaignId: initialState.id,
    });
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
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización Arquitectónica**: ((Implementada)) Se ha corregido la ruta de importación para que apunte al manifiesto del módulo (`@/lib/builder/core`), resolviendo el error `Module not found` y alineando el componente con la SSoT de estado.
 * 2. **Observabilidad Mejorada**: ((Implementada)) El log de hidratación ahora incluye el `campaignId` para una trazabilidad más granular.
 *
 * @subsection Melhorias Futuras
 * 1. **Selector de Estado Atómico**: ((Vigente)) Para una optimización de rendimiento de élite, se podría crear un hook `useBuilderStoreSelector` que combine `useBuilderStoreContext` y `useStore` con un selector.
 *
 * =====================================================================
 */
// src/components/builder/BuilderStoreProvider.tsx
