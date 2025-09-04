// src/lib/hooks/use-optimistic-state.ts
/**
 * @file use-optimistic-state.ts
 * @description Hook de lógica pura y atómico para gestionar un estado de array
 *              con actualizaciones optimistas y capacidad de rollback. Refactorizado
 *              para utilizar el `clientLogger` canónico, resolviendo errores críticos
 *              de importación de módulos y de tipos.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
"use client";

import { useCallback, useEffect, useState } from "react";
import { clientLogger } from "@/lib/logger";

/**
 * @private
 * @interface Resource
 * @description Contrato base para los elementos gestionados por este hook,
 *              garantizando que cada elemento tenga un identificador único.
 */
interface Resource {
  id: string;
  [key: string]: any;
}

/**
 * @public
 * @function useOptimisticState
 * @description Hook de lógica pura y atómica para gestionar un estado de array
 *              con actualizaciones optimistas y capacidad de rollback.
 * @template T - El tipo del recurso en el array, debe extender de `Resource`.
 * @param {T[]} initialItems - El array inicial de items.
 * @returns La API para manipular el estado optimista.
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
      clientLogger.trace("[OptimisticState] Ítem añadido de forma optimista.", {
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
      clientLogger.trace(
        "[OptimisticState] Ítem eliminado de forma optimista.",
        { itemId }
      );
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
      clientLogger.trace(
        "[OptimisticState] Ítem actualizado de forma optimista.",
        { itemId, update }
      );
      return previousItems;
    },
    [items]
  );

  const rollback = useCallback((previousItems: T[]) => {
    clientLogger.warn(
      "[OptimisticState] Revirtiendo estado a la versión anterior."
    );
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
// src/lib/hooks/use-optimistic-state.ts
