// src/lib/hooks/ui/useUrlStateSync.ts
/**
 * @file useUrlStateSync.ts
 * @description Hook de UI de élite, atómico y reutilizable. Ha sido blindado
 *              con un tipo de retorno explícito, resolviendo una inferencia
 *              de tipo recursiva (`any`) que causaba una cascada de errores
 *              en los hooks consumidores.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { clientLogger } from "@/lib/logging";
import { usePathname, useRouter } from "@/lib/navigation";
import isEqual from "microdiff";

export interface UseUrlStateSyncProps<T extends Record<string, string>> {
  initialState: T;
  debounceKeys?: (keyof T)[];
  debounceMs?: number;
}

// --- INICIO DE CORRECCIÓN DE TIPO (TS7022) ---
// Se define un tipo explícito para el valor de retorno del hook.
export interface UseUrlStateSyncReturn<T> {
  state: T;
  setState: React.Dispatch<React.SetStateAction<T>>;
  isSyncing: boolean;
}

/**
 * @public
 * @function useUrlStateSync
 * @description Gestiona un estado de objeto y lo sincroniza bidireccionalmente con los `searchParams` de la URL.
 * @template T - La forma del objeto de estado a sincronizar.
 * @param {UseUrlStateSyncProps<T>} options - Opciones de configuración.
 * @returns {UseUrlStateSyncReturn<T>} La API para interactuar con el estado sincronizado.
 */
export const useUrlStateSync = <T extends Record<string, string>>({
  initialState,
  debounceKeys = [],
  debounceMs = 500,
}: UseUrlStateSyncProps<T>): UseUrlStateSyncReturn<T> => {
  // --- FIN DE CORRECCIÓN DE TIPO (TS7022) ---
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

    currentParams.sort();
    newParams.sort();

    if (currentParams.toString() !== newParams.toString()) {
      if (newParams.has("page")) {
        const currentFilters = { ...initialState };
        const newFilters = { ...initialState };
        Object.keys(initialState).forEach((key) => {
          if (currentParams.has(key))
            (currentFilters as any)[key] = currentParams.get(key);
          if (newParams.has(key)) (newFilters as any)[key] = newParams.get(key);
        });
        if (!isEqual(currentFilters, newFilters)) {
          newParams.set("page", "1");
        }
      }

      const newUrl = `${pathname}?${newParams.toString()}`;
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
 *
 * @subsection Melhorias Futuras
 * 1. **Soporte para Tipos de Datos Complejos**: ((Vigente)) El hook está optimizado para valores de tipo string. Podría ser extendido para manejar la serialización y deserialización de arrays o números, utilizando `JSON.stringify` y `JSON.parse` para almacenarlos en la URL.
 * 2. **Tipado de `setState` Callback**: ((Pendiente)) El tipo del callback `setState` aún usa `any` en la implementación. Se podría refinar para una seguridad de tipos aún mayor.
 *
 * =====================================================================
 */
// src/lib/hooks/ui/useUrlStateSync.ts
