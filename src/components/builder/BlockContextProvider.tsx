// src/components/builder/BlockContextProvider.tsx
/**
 * @file BlockContextProvider.tsx
 * @description Proveedor de contexto de élite para un bloque. Refactorizado a un
 *              estándar de pureza atómica. Su única responsabilidad es invocar
 *              el hook soberano `useBlockData` y proveer el valor resultante a
 *              su árbol de componentes hijos.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-24
 * @license MIT
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import * as React from "react";

import { type PageBlock } from "@/lib/builder/types.d";
import { useBlockData } from "@/lib/hooks/use-block-data";

/**
 * @public
 * @interface BlockContextValue
 * @description El contrato de datos que este proveedor expone a sus consumidores.
 */
export interface BlockContextValue {
  block: PageBlock;
  isSelected: boolean;
  isFirst: boolean;
  isLast: boolean;
  selectBlock: () => void;
  deleteBlock: () => void;
  duplicateBlock: () => void;
  moveBlockUp: () => void;
  moveBlockDown: () => void;
  updateProp: (propName: string, value: any) => void;
}

const BlockContext = React.createContext<BlockContextValue | null>(null);

/**
 * @public
 * @function useBlockContext
 * @description Hook para consumir de forma segura el BlockContext.
 * @throws {Error} Si se usa fuera de un BlockContextProvider.
 * @returns {BlockContextValue} El valor del contexto del bloque.
 */
export const useBlockContext = (): BlockContextValue => {
  const context = React.useContext(BlockContext);
  if (!context) {
    throw new Error(
      "Error de Arquitectura: useBlockContext debe ser usado dentro de un BlockContextProvider."
    );
  }
  return context;
};

/**
 * @public
 * @component BlockContextProvider
 * @description Componente proveedor puro que conecta la lógica del hook `useBlockData` con el contexto.
 * @param {object} props
 * @param {PageBlock} props.block - El objeto de datos del bloque actual.
 * @param {React.ReactNode} props.children - Los componentes hijos que consumirán el contexto.
 * @returns {React.ReactElement}
 */
export function BlockContextProvider({
  block,
  children,
}: {
  block: PageBlock;
  children: React.ReactNode;
}) {
  const contextValue = useBlockData(block);

  return (
    <BlockContext.Provider value={contextValue}>
      {children}
    </BlockContext.Provider>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Pureza Arquitectónica (SRP)**: ((Implementada)) El componente ahora es un proveedor de UI 100% puro. Su única responsabilidad es proveer el contexto, delegando toda la lógica al hook `useBlockData`. Esto representa la culminación de la "Filosofía LEGO".
 * 2. **Simplificación Radical**: ((Implementada)) El código del componente es ahora trivialmente simple, lo que aumenta drásticamente su legibilidad y mantenibilidad.
 *
 * @subsection Melhorias Futuras
 * 1. **Optimización con `React.memo`**: ((Vigente)) Aunque el `contextValue` está memoizado en el hook, el `BlockContextProvider` podría ser envuelto en `React.memo` como una capa adicional de optimización para prevenir re-renderizados si sus props (`block`, `children`) no cambian.
 *
 * =====================================================================
 */
// src/components/builder/BlockContextProvider.tsx
