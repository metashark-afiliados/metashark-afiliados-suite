// src/lib/hooks/use-builder-store.ts
/**
 * @file use-builder-store.ts
 * @description Hook de consumo de élite para el `BuilderStore`. Refactorizado para
 *              consumir el `BuilderStoreContext` y exportar dos hooks distintos:
 *              `useBuilderStore` para la selección de estado reactivo, y
 *              `useBuilderStoreApi` para el acceso no reactivo a la instancia
 *              completa del store (necesario para middlewares como `temporal`).
 * @author L.I.A. Legacy
 * @version 2.0.0
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 * @date 2025-08-24
 */
"use client";

import { useStore } from "zustand";

import { useBuilderStoreContext } from "@/components/builder/BuilderStoreProvider";
import { type BuilderState, type BuilderStore } from "@/lib/builder/core";

/**
 * @public
 * @function useBuilderStore
 * @description Hook que se suscribe a los cambios en el `BuilderStore`.
 *              Es la forma canónica para que los componentes de UI accedan
 *              reactivamente a porciones del estado.
 * @template T - El tipo de la porción del estado seleccionada.
 * @param {(state: BuilderState) => T} selector - Una función que selecciona una parte del estado.
 * @param {(left: T, right: T) => boolean} [equalityFn] - Una función de comparación opcional (ej. `shallow`) para optimizar re-renderizados.
 * @returns {T} La porción del estado seleccionada.
 */
export function useBuilderStore<T>(
  selector: (state: BuilderState) => T,
  equalityFn?: (left: T, right: T) => boolean
): T {
  const storeApi = useBuilderStoreContext();
  if (!storeApi) {
    throw new Error(
      "Error de Arquitectura: useBuilderStore debe ser usado dentro de un BuilderStoreProvider."
    );
  }
  return useStore(storeApi, selector, equalityFn as any);
}

/**
 * @public
 * @function useBuilderStoreApi
 * @description Hook que devuelve la instancia completa de la Store API.
 *              Es útil para acceder a funciones añadidas por middlewares
 *              (ej. `store.temporal.undo()`) de forma no reactiva.
 * @returns {BuilderStore} La instancia completa de la Store API.
 */
export function useBuilderStoreApi(): BuilderStore {
  const storeApi = useBuilderStoreContext();
  if (!storeApi) {
    throw new Error(
      "Error de Arquitectura: useBuilderStoreApi debe ser usado dentro de un BuilderStoreProvider."
    );
  }
  return storeApi;
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización Arquitectónica**: ((Implementada)) El hook ahora importa los tipos `BuilderState` y `BuilderStore` desde la nueva API pública (`@/lib/builder/core`), resolviendo los errores de tipo y de módulo no encontrado.
 * 2. **API de Consumo Dual**: ((Implementada)) La división en dos hooks (`useBuilderStore` y `useBuilderStoreApi`) es un patrón de élite que proporciona una API clara y optimizada para diferentes casos de uso (reactivo vs. no reactivo).
 * 3. **Documentación TSDoc Granular**: ((Implementada)) Se ha documentado el propósito y uso de cada hook, mejorando la DX.
 *
 * @subsection Melhorias Futuras
 * 1. **Tipado de `equalityFn`**: ((Vigente)) El `as any` en `equalityFn` es un compromiso pragmático. Se podría investigar una solución de tipado más estricta si las versiones futuras de Zustand lo permiten.
 *
 * =====================================================================
 */
// src/lib/hooks/use-builder-store.ts
