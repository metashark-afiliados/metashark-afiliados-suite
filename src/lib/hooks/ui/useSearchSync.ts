// src/lib/hooks/ui/useSearchSync.ts
/**
 * @file src/lib/hooks/ui/useSearchSync.ts
 * @description Hook de UI atómico y reutilizable que encapsula la lógica de
 *              sincronizar un término de búsqueda con los `searchParams` de la URL,
 *              aplicando `debounce` para optimizar el rendimiento.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import { useState, useEffect, useTransition } from "react";

import { useDebounce } from "@/lib/hooks/use-debounce";
import { logger } from "@/lib/logging";
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

    // Siempre resetear a la primera página al buscar
    if (params.has("page")) {
      params.set("page", "1");
    }

    const newUrl = `${pathname}?${params.toString()}`;
    logger.trace(`[useSearchSync] Sincronizando URL de búsqueda.`, { newUrl });

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
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (Lógica de UI)**: ((Implementada)) Este nuevo aparato aísla completamente la lógica de sincronización de búsqueda, haciéndola reutilizable en cualquier página con funcionalidad de filtrado.
 * 2. **Rendimiento Optimizado**: ((Implementada)) El uso de `useDebounce` y `useTransition` asegura que las actualizaciones de la URL sean eficientes y no bloqueen la UI, proporcionando una experiencia de usuario fluida.
 * 3. **Reseteo de Paginación**: ((Implementada)) Incluye la lógica crítica de resetear la paginación a la página 1 cada vez que se realiza una nueva búsqueda, previniendo estados de UI inconsistentes donde el usuario podría quedar en una página que ya no existe para los nuevos resultados.
 *
 * @subsection Melhorias Futuras
 * 1. **Sincronización de Múltiples Parámetros**: ((Vigente)) El hook podría ser extendido para gestionar un objeto de `searchParams` en lugar de un único `paramName`, permitiendo sincronizar filtros complejos (ej. búsqueda, estado, ordenamiento) de una sola vez.
 *
 * =====================================================================
 */
// src/lib/hooks/ui/useSearchSync.ts
