// src/lib/hooks/use-optimistic-resource-management.ts
/**
 * @file use-optimistic-resource-management.ts
 * @description Hook orquestador de élite. Ha sido refactorizado para ser
 *              100% genérico y agnóstico a la entidad y al contenido de la UI.
 *              Utiliza el patrón de Inversión de Control, aceptando una factoría
 *              `createOptimisticItem` y delegando el feedback de UI al hook consumidor.
 * @author Raz Podestá - MetaShark Tech
 * @version 6.1.0
 * @see .docs-espejo/lib/hooks/use-optimistic-resource-management.ts.md
 */
"use client";

import { useState, useTransition } from "react";

import { type ActionResult, isActionError } from "@/lib/validators";
import { useOptimisticState } from "./use-optimistic-state";

interface Resource {
  id: string;
  [key: string]: any;
}

/**
 * @public
 * @function useOptimisticResourceManagement
 * @description Hook orquestador que compone `useOptimisticState` para gestionar
 *              el ciclo de vida completo de un recurso con UI optimista.
 * @template T - El tipo del recurso.
 * @param {object} params - Parámetros de configuración del hook.
 * @returns La API para gestionar los recursos.
 */
export function useOptimisticResourceManagement<T extends Resource>({
  initialItems,
  createAction,
  deleteAction,
  createOptimisticItem,
}: {
  initialItems: T[];
  createAction?: (formData: FormData) => Promise<ActionResult<{ id: string }>>;
  deleteAction?: (formData: FormData) => Promise<ActionResult<any>>;
  createOptimisticItem?: (formData: FormData) => T;
}) {
  const [isPending, startTransition] = useTransition();
  const [mutatingId, setMutatingId] = useState<string | null>(null);

  const { items, addOptimistic, removeOptimistic, updateOptimistic, rollback } =
    useOptimisticState<T>(initialItems);

  const handleCreate =
    createAction && createOptimisticItem
      ? async (formData: FormData): Promise<ActionResult<{ id: string }>> => {
          const phantomItem = createOptimisticItem(formData);
          const previousItems = addOptimistic(phantomItem);
          setMutatingId(phantomItem.id);

          return new Promise((resolve) => {
            startTransition(async () => {
              const result = await createAction(formData);
              if (isActionError(result)) {
                rollback(previousItems);
              }
              setMutatingId(null);
              resolve(result);
            });
          });
        }
      : undefined;

  const handleDelete = deleteAction
    ? async (formData: FormData): Promise<ActionResult<any>> => {
        const idToDelete = (formData.get("siteId") ||
          formData.get("campaignId")) as string;
        if (!idToDelete) {
          return { success: false, error: "generic.error_invalid_data" };
        }

        const previousItems = removeOptimistic(idToDelete);
        setMutatingId(idToDelete);

        return new Promise((resolve) => {
          startTransition(async () => {
            const result = await deleteAction(formData);
            if (isActionError(result)) {
              rollback(previousItems);
            }
            setMutatingId(null);
            resolve(result);
          });
        });
      }
    : undefined;

  return {
    items,
    isPending,
    mutatingId,
    handleCreate,
    handleDelete,
    updateOptimistic,
  };
}
// src/lib/hooks/use-optimistic-resource-management.ts
