// src/lib/hooks/use-optimistic-resource-management.ts
"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { logger } from "@/lib/logging";
import { type ActionResult } from "@/lib/validators";
import { useOptimisticState } from "./use-optimistic-state";

interface Resource {
  id: string;
  [key: string]: any;
}

/**
 * @public
 * @exports useOptimisticResourceManagement
 * @description Hook orquestador que compone `useOptimisticState` para gestionar
 *              el ciclo de vida completo de un recurso con UI optimista.
 * @template T - El tipo del recurso.
 * @param {object} params - Parámetros de configuración del hook.
 * @returns La API para gestionar los recursos.
 * @version 3.0.0
 * @author Raz Podestá
 */
export function useOptimisticResourceManagement<T extends Resource>({
  initialItems,
  entityName,
  createAction,
  deleteAction,
  updateAction,
  duplicateAction,
}: {
  initialItems: T[];
  entityName: string;
  createAction?: (formData: FormData) => Promise<ActionResult<{ id: string }>>;
  deleteAction?: (formData: FormData) => Promise<ActionResult<any>>;
  updateAction?: (id: string) => Promise<ActionResult<any>>;
  duplicateAction?: (id: string) => Promise<ActionResult<{ id: string }>>;
}) {
  const [isPending, startTransition] = useTransition();
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const router = useRouter();

  const { items, addOptimistic, removeOptimistic, updateOptimistic, rollback } =
    useOptimisticState<T>(initialItems);

  const handleCreate = createAction
    ? (formData: FormData, optimisticItem: Omit<T, "id">) => {
        const phantomItem = {
          id: `optimistic-${Date.now()}`,
          ...optimisticItem,
        } as T;
        const previousItems = addOptimistic(phantomItem);
        setMutatingId(phantomItem.id);

        startTransition(async () => {
          const result = await createAction(formData);
          if (result.success) {
            toast.success(`${entityName} creado con éxito.`);
            router.refresh();
          } else {
            toast.error(result.error || `No se pudo crear el ${entityName}.`);
            rollback(previousItems);
          }
          setMutatingId(null);
        });
      }
    : undefined;

  const handleDelete = deleteAction
    ? (formData: FormData) => {
        const idToDelete = (formData.get("siteId") ||
          formData.get("campaignId")) as string;
        if (!idToDelete) return;

        const previousItems = removeOptimistic(idToDelete);
        setMutatingId(idToDelete);

        startTransition(async () => {
          const result = await deleteAction(formData);
          if (result.success) {
            toast.success(`${entityName} eliminado con éxito.`);
            router.refresh();
          } else {
            toast.error(
              result.error || `No se pudo eliminar el ${entityName}.`
            );
            rollback(previousItems);
          }
          setMutatingId(null);
        });
      }
    : undefined;

  const handleUpdate = updateAction
    ? (id: string, optimisticUpdate: Partial<T>) => {
        const previousItems = updateOptimistic(id, optimisticUpdate);
        setMutatingId(id);
        startTransition(async () => {
          const result = await updateAction(id);
          if (!result.success) {
            toast.error(
              result.error || `No se pudo actualizar el ${entityName}.`
            );
            rollback(previousItems);
          }
          setMutatingId(null);
        });
      }
    : undefined;

  const handleDuplicate = duplicateAction
    ? (idToDuplicate: string) => {
        setMutatingId(idToDuplicate);
        startTransition(async () => {
          const result = await duplicateAction(idToDuplicate);
          if (result.success) {
            // No hay UI optimista aquí, solo refrescamos al éxito
            router.refresh();
          } else {
            toast.error(
              result.error || `No se pudo duplicar el ${entityName}.`
            );
          }
          setMutatingId(null);
        });
      }
    : undefined;

  return {
    items,
    isPending,
    mutatingId,
    handleCreate,
    handleDelete,
    handleUpdate,
    handleDuplicate,
  };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Hiper-Atomicidad (Orquestador Puro)**: ((Implementada)) Este hook ahora solo orquesta, componiendo el hook `useOptimisticState`.
 *
 * =====================================================================
 */
