// src/lib/hooks/ui/useSearchSync.ts
/**
 * @file useSearchSync.ts
 * @description Hook de UI atómico y reutilizable que encapsula la lógica de
 *              sincronizar un término de búsqueda con los `searchParams` de la URL,
 *              aplicando `debounce` para optimizar el rendimiento.
 * @author Raz Podestá
 * @version 2.0.0
 * @see .docs-espejo/lib/hooks/ui/useSearchSync.ts.md
 */
"use client";

import { useEffect, useState, useTransition } from "react";

import { useDebounce } from "@/lib/hooks/use-debounce";
import { clientLogger } from "@/lib/logger";
import { usePathname, useRouter } from "@/lib/navigation";

interface UseSearchSyncProps {
  initialQuery?: string;
  paramName?: string;
  debounceMs?: number;
  replace?: boolean;
}

/**
 * @public
 * @function useSearchSync
 * @description Gestiona el estado de un término de búsqueda y lo sincroniza con la URL.
 * @param {UseSearchSyncProps} [options] - Opciones de configuración.
 * @returns {{
 *   searchTerm: string;
 *   setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
 *   isSyncing: boolean;
 * }} El estado del término de búsqueda y un indicador de transición.
 */
export const useSearchSync = ({
  initialQuery = "",
  paramName = "q",
  debounceMs = 500,
  replace = true,
}: UseSearchSyncProps = {}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);
  const [isSyncing, startTransition] = useTransition();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currentQuery = params.get(paramName) || "";

    if (debouncedSearchTerm === currentQuery) {
      return;
    }

    if (debouncedSearchTerm) {
      params.set(paramName, debouncedSearchTerm);
    } else {
      params.delete(paramName);
    }

    if (params.has("page")) {
      params.set("page", "1");
    }

    const newUrl = `${pathname}?${params.toString()}`;
    clientLogger.trace({ newUrl }, `[useSearchSync] Sincronizando URL.`);

    startTransition(() => {
      if (replace) {
        router.replace(newUrl as any, { scroll: false });
      } else {
        router.push(newUrl as any, { scroll: false });
      }
    });
  }, [debouncedSearchTerm, paramName, pathname, router, replace]);

  return { searchTerm, setSearchTerm, isSyncing };
};
// src/lib/hooks/ui/useSearchSync.ts
