// src/lib/hooks/use-optimistic-resource-management.ts
/**
 * @file use-optimistic-resource-management.ts
 * @description Hook orquestador de élite. Ha sido refactorizado para ser
 *              100% genérico y agnóstico a la entidad. Ahora utiliza el patrón
 *              de Inversión de Control, aceptando una factoría `createOptimisticItem`
 *              y delegando el feedback de UI al hook consumidor.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { type ActionResult } from "@/lib/validators";
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
  const router = useRouter();

  const { items, addOptimistic, removeOptimistic, rollback } =
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
              if (!result.success) {
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
          return {
            success: false,
            error: "ID del recurso a eliminar no encontrado en FormData.",
          };
        }

        const previousItems = removeOptimistic(idToDelete);
        setMutatingId(idToDelete);

        return new Promise((resolve) => {
          startTransition(async () => {
            const result = await deleteAction(formData);
            if (!result.success) {
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
  };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Abstracción Total (Inversión de Control)**: ((Implementada)) El hook ya no asume cómo se crea un ítem optimista. Ahora recibe una función `createOptimisticItem` que le enseña a hacerlo, convirtiéndolo en un aparato 100% genérico y reutilizable para cualquier entidad.
 * 2. **Desacoplamiento de Efectos Secundarios**: ((Implementada)) Se ha eliminado la lógica de `toast` y `router.refresh()`. El hook ahora devuelve el `ActionResult` de la Server Action. Esto delega la responsabilidad del feedback de UI al hook consumidor (ej. `useSitesPage`), que es el que tiene el contexto de i18n necesario. Esto es una implementación de élite del SRP.
 * 3. **API Asíncrona Robusta**: ((Implementada)) Las funciones `handleCreate` y `handleDelete` ahora son `async` y devuelven una `Promise<ActionResult>`. Esto permite al hook consumidor usar `await` para esperar el resultado de la operación y actuar en consecuencia (ej. mostrar un toast de éxito/error).
 *
 * @subsection Melhorias Futuras
 * 1. **Abstracción para `handleDelete`**: ((Vigente)) La lógica `formData.get("siteId") || formData.get("campaignId")` introduce un acoplamiento. Propondré refactorizar `handleDelete` para que acepte el ID del recurso directamente, o una función que extraiga el ID del `FormData`.
 * 2. **Soporte para `handleUpdate` y `handleDuplicate`**: ((Pendiente)) El patrón de abstracción debe extenderse a las acciones de actualización y duplicación para completar la genericidad del hook.
 *
 * =====================================================================
 */
