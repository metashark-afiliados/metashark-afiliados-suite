// src/components/builder/DraggableBlockWrapper.tsx
/**
 * @file DraggableBlockWrapper.tsx
 * @description Ensamblador de élite para un bloque interactivo. Sincronizado
 *              con la arquitectura de componentes atómicos y sus nuevas rutas canónicas.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @date 2025-08-24
 * @license MIT
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";

// --- INICIO DE CORRECCIÓN DE RUTAS ---
import {
  BlockContextProvider,
  useBlockContext,
} from "@/components/builder/BlockContextProvider";
import { BlockContainer } from "@/components/builder/BlockContainer";
import { BlockToolbar } from "@/components/builder/BlockToolbar";
// --- FIN DE CORRECCIÓN DE RUTAS ---
import { type PageBlock } from "@/lib/builder/types.d";

/**
 * @private
 * @component BlockRenderer
 * @description Componente interno que consume el contexto del bloque y ensambla el
 *              `BlockContainer` con el `BlockToolbar` y los `children` enriquecidos.
 */
const BlockRenderer = ({ children }: { children: React.ReactNode }) => {
  const { block, updateProp } = useBlockContext();
  const { attributes, listeners } = useSortable({ id: block.id });

  const enhancedChildren = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<any>, {
        blockId: block.id,
        onUpdate: updateProp,
      })
    : children;

  return (
    <BlockContainer>
      <BlockToolbar dndAttributes={attributes} dndListeners={listeners} />
      {enhancedChildren}
    </BlockContainer>
  );
};

/**
 * @public
 * @component DraggableBlockWrapper
 * @description Orquesta el renderizado de un bloque interactivo completo.
 * @param {object} props - Propiedades del componente.
 * @returns {React.ReactElement}
 */
export function DraggableBlockWrapper({
  block,
  children,
}: {
  block: PageBlock;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <BlockContextProvider block={block}>
      <BlockRenderer>{children}</BlockRenderer>
    </BlockContextProvider>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Errores de Compilación (TS2307)**: ((Implementada)) Se han corregido todas las rutas de importación para que apunten a las nuevas ubicaciones canónicas, resolviendo el error de módulo no encontrado y completando la refactorización del ecosistema.
 *
 * =====================================================================
 */
// src/components/builder/DraggableBlockWrapper.tsx
