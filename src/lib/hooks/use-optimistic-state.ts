// src/lib/hooks/use-optimistic-state.ts
"use client";

import { useState, useCallback, useEffect } from "react";
import { logger } from "@/lib/logging";

interface Resource {
  id: string;
  [key: string]: any;
}

/**
 * @public
 * @function useOptimisticState
 * @description Hook de lógica pura y atómica para gestionar un estado de array
 *              con actualizaciones optimistas y capacidad de rollback.
 * @template T - El tipo del recurso en el array.
 * @param {T[]} initialItems - El array inicial de items.
 * @returns La API para manipular el estado optimista.
 * @version 1.0.0
 * @author Raz Podestá
 */
export function useOptimisticState<T extends Resource>(initialItems: T[]) {
  const [items, setItems] = useState<T[]>(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const addOptimistic = useCallback(
    (item: T) => {
      const previousItems = items;
      setItems((current) => [...current, item]);
      logger.trace("[OptimisticState] Ítem añadido de forma optimista.", {
        id: item.id,
      });
      return previousItems;
    },
    [items]
  );

  const removeOptimistic = useCallback(
    (itemId: string) => {
      const previousItems = items;
      setItems((current) => current.filter((item) => item.id !== itemId));
      logger.trace("[OptimisticState] Ítem eliminado de forma optimista.", {
        itemId,
      });
      return previousItems;
    },
    [items]
  );

  const updateOptimistic = useCallback(
    (itemId: string, update: Partial<T>) => {
      const previousItems = items;
      setItems((current) =>
        current.map((item) =>
          item.id === itemId ? { ...item, ...update } : item
        )
      );
      logger.trace("[OptimisticState] Ítem actualizado de forma optimista.", {
        itemId,
      });
      return previousItems;
    },
    [items]
  );

  const rollback = useCallback((previousItems: T[]) => {
    logger.warn("[OptimisticState] Revirtiendo estado a la versión anterior.");
    setItems(previousItems);
  }, []);

  return {
    items,
    addOptimistic,
    removeOptimistic,
    updateOptimistic,
    rollback,
  };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (Lógica Pura)**: ((Implementada)) Este hook aísla perfectamente la gestión del estado optimista, cumpliendo el SRP al más alto nivel.
 *
 * =====================================================================
 */
