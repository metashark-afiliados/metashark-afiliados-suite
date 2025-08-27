// src/lib/hooks/ui/useUrlStateSync.ts
/**
 * @file useUrlStateSync.ts
 * @description Hook de UI de élite, atómico y reutilizable. Ha sido corregido
 *              para consumir las SSoT de importación canónicas para los hooks
 *              de enrutamiento y la librería `microdiff`, resolviendo errores
 *              críticos de resolución de módulos.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.1.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { useSearchParams } from "next/navigation"; // <-- CORRECCIÓN: SSoT para searchParams
import { useDebounce } from "@/lib/hooks/use-debounce";
import { clientLogger } from "@/lib/logging";
import { usePathname, useRouter } from "@/lib/navigation";
import isEqual from "microdiff"; // <-- CORRECCIÓN: SSoT para importación por defecto

export interface UseUrlStateSyncProps<T extends Record<string, string>> {
  initialState: T;
  debounceKeys?: (keyof T)[];
  debounceMs?: number;
}

/**
 * @public
 * @function useUrlStateSync
 * @description Gestiona un estado de objeto y lo sincroniza bidireccionalmente con los `searchParams` de la URL.
 * @template T - La forma del objeto de estado a sincronizar.
 * @param {UseUrlStateSyncProps<T>} options - Opciones de configuración.
 * @returns {{
 *   state: T;
 *   setState: React.Dispatch<React.SetStateAction<T>>;
 *   isSyncing: boolean;
 * }} La API para interactuar con el estado sincronizado.
 */
export const useUrlStateSync = <T extends Record<string, string>>({
  initialState,
  debounceKeys = [],
  debounceMs = 500,
}: UseUrlStateSyncProps<T>) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [state, setState] = useState<T>(() => {
    const stateFromUrl: Partial<T> = {};
    for (const key in initialState) {
      if (searchParams.has(key)) {
        stateFromUrl[key] = searchParams.get(key) as T[Extract<
          keyof T,
          string
        >];
      }
    }
    return { ...initialState, ...stateFromUrl };
  });

  const [isSyncing, startTransition] = useTransition();
  const debouncedState = useDebounce(state, debounceMs);

  const updateUrl = useCallback(() => {
    const currentParams = new URLSearchParams(window.location.search);
    const newParams = new URLSearchParams();

    currentParams.forEach((value, key) => {
      if (!(key in initialState)) {
        newParams.append(key, value);
      }
    });

    Object.entries(state).forEach(([key, value]) => {
      const isDebounced = debounceKeys.includes(key);
      const valueToSync = isDebounced ? debouncedState[key] : value;
      if (valueToSync && valueToSync !== initialState[key]) {
        newParams.set(key, String(valueToSync));
      }
    });

    const currentFilters = Object.fromEntries(currentParams.entries());
    const newFilters = Object.fromEntries(newParams.entries());

    // Solo resetea la página si los filtros realmente cambian
    if (!isEqual(currentFilters, newFilters) && newParams.has("page")) {
      newParams.set("page", "1");
    }

    const newUrl = `${pathname}?${newParams.toString()}`;

    // Solo actualiza la URL si ha cambiado para evitar bucles de renderizado
    if (`${pathname}?${currentParams.toString()}` !== newUrl) {
      clientLogger.trace(`[useUrlStateSync] Sincronizando URL de búsqueda.`, {
        newUrl,
      });
      startTransition(() => {
        router.replace(newUrl as any, { scroll: false });
      });
    }
  }, [state, debouncedState, debounceKeys, initialState, pathname, router]);

  useEffect(() => {
    updateUrl();
  }, [debouncedState, state, updateUrl]);

  return { state, setState, isSyncing };
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Errores de Módulo (`TS2305`, `TS2614`)**: ((Implementada)) Se han corregido las rutas de importación para `useSearchParams` (ahora desde `next/navigation`) y `isEqual` (ahora como importación por defecto), resolviendo los errores de compilación y alineando el hook con las APIs canónicas.
 * 2. **Prevención de Bucles de Renderizado**: ((Implementada)) Se ha añadido una comprobación para actualizar la URL solo si los parámetros han cambiado realmente, mejorando la robustez y el rendimiento.
 *
 * @subsection Melhorias Futuras
 * 1. **Soporte para Tipos de Datos Complejos**: ((Vigente)) El hook está optimizado para valores de tipo string. Podría ser extendido para manejar la serialización y deserialización de arrays o números.
 *
 * =====================================================================
 */
// src/lib/hooks/ui/useUrlStateSync.ts
