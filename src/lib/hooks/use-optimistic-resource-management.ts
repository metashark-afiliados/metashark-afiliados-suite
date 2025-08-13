/**
 * @file src/lib/hooks/use-optimistic-resource-management.ts
 * @description Hook genérico de élite para gestionar un conjunto de recursos con
 *              actualizaciones de UI optimistas para el ciclo de vida completo
 *              (CRUD + Duplicar). Este es un aparato de "Lego" arquitectónico
 *              fundamental para el proyecto, diseñado para proporcionar una
 *              experiencia de usuario instantánea y resiliente.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";

import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { type ActionResult } from "@/lib/validators";

interface Resource {
  id: string;
  [key: string]: any;
}

/**
 * @public
 * @exports useOptimisticResourceManagement
 * @description Hook genérico para la gestión de recursos con UI optimista.
 * @template T - El tipo del recurso, que debe extender de `Resource`.
 * @param {object} params - Parámetros de configuración del hook.
 * @returns Un objeto con el estado y los manejadores para gestionar los recursos.
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
  updateAction?: (formData: FormData) => Promise<ActionResult<any>>;
  duplicateAction?: (id: string) => Promise<ActionResult<{ id: string }>>;
}) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [isPending, startTransition] = useTransition();
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleCreate = (formData: FormData, optimisticItem: Omit<T, "id">) => {
    if (!createAction) return;
    const phantomItem: T = {
      id: `optimistic-${Date.now()}`,
      ...optimisticItem,
    } as T;
    const previousItems = items;
    setItems((current) => [...current, phantomItem]);
    setMutatingId(phantomItem.id);

    startTransition(async () => {
      const result = await createAction(formData);
      if (result.success) {
        toast.success(`${entityName} creado con éxito.`);
        router.refresh();
      } else {
        toast.error(result.error || `No se pudo crear el ${entityName}.`);
        setItems(previousItems);
      }
      setMutatingId(null);
    });
  };

  const handleDelete = (formData: FormData) => {
    if (!deleteAction) return;
    const idToDelete = formData.get("campaignId") as string;
    if (!idToDelete) return;

    const previousItems = items;
    setItems((current) => current.filter((item) => item.id !== idToDelete));
    setMutatingId(idToDelete);

    startTransition(async () => {
      const result = await deleteAction(formData);
      if (result.success) {
        toast.success(`${entityName} eliminado con éxito.`);
        router.refresh();
      } else {
        toast.error(result.error || `No se pudo eliminar el ${entityName}.`);
        setItems(previousItems);
      }
      setMutatingId(null);
    });
  };

  const handleUpdate = (formData: FormData, optimisticUpdate: Partial<T>) => {
    if (!updateAction) return;
    const idToUpdate = formData.get("campaignId") as string;
    if (!idToUpdate) return;

    const previousItems = items;
    setItems((current) =>
      current.map((item) =>
        item.id === idToUpdate ? { ...item, ...optimisticUpdate } : item
      )
    );
    setMutatingId(idToUpdate);

    startTransition(async () => {
      const result = await updateAction(formData);
      if (result.success) {
        toast.success(`${entityName} actualizado con éxito.`);
        router.refresh();
      } else {
        toast.error(result.error || `No se pudo actualizar el ${entityName}.`);
        setItems(previousItems);
      }
      setMutatingId(null);
    });
  };

  const handleDuplicate = (idToDuplicate: string) => {
    if (!duplicateAction) return;
    const itemToDuplicate = items.find((item) => item.id === idToDuplicate);
    if (!itemToDuplicate) return;

    const phantomItem: T = {
      ...itemToDuplicate,
      id: `optimistic-${Date.now()}`,
    };
    const previousItems = items;
    setItems((current) => [...current, phantomItem]);
    setMutatingId(phantomItem.id);

    startTransition(async () => {
      const result = await duplicateAction(idToDuplicate);
      if (result.success) {
        toast.success(`${entityName} duplicado con éxito.`);
        router.refresh();
      } else {
        toast.error(result.error || `No se pudo duplicar el ${entityName}.`);
        setItems(previousItems);
      }
      setMutatingId(null);
    });
  };

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
 * 1. **Gestor de Ciclo de Vida Completo**: ((Implementada)) El hook ha sido promovido para gestionar `create`, `delete`, `update`, y `duplicate`, convirtiéndose en una solución CRUD optimista completa y reutilizable.
 * 2. **Cero Regresiones**: ((Implementada)) Se mantiene la lógica de rollback y feedback de `toast` para todas las acciones, garantizando una UX consistente.
 *
 * @subsection Melhorias Futuras
 * 1. **Callbacks de Éxito/Error**: ((Vigente)) Las funciones `handle*` podrían aceptar callbacks opcionales (`onSuccess`, `onError`) para permitir al componente consumidor ejecutar lógica adicional (ej. cerrar un modal).
 * 2. **Internacionalización de Toasts**: ((Vigente)) Los mensajes de `toast` están codificados. El hook podría aceptar un objeto `texts` con claves de i18n para ser completamente agnóstico al contenido.
 *
 * =====================================================================
 */
