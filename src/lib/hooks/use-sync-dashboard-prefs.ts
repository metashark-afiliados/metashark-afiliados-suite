// src/lib/hooks/use-sync-dashboard-prefs.ts
/**
 * @file use-sync-dashboard-prefs.ts
 * @description Hook soberano de efecto secundario. Sincroniza de forma
 *              "debounced" el estado de la UI del dashboard con la base de
 *              datos para una persistencia entre dispositivos.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useEffect, useRef } from "react";

import { updateProfilePreferencesAction } from "@/lib/actions/profiles.actions";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useDashboardUIStore } from "@/lib/hooks/useDashboardUIStore";
import { clientLogger } from "@/lib/logging";

export function useSyncDashboardPrefs() {
  const isSidebarCollapsed = useDashboardUIStore(
    (state) => state.isSidebarCollapsed
  );
  const debouncedIsSidebarCollapsed = useDebounce(isSidebarCollapsed, 2000); // Debounce de 2 segundos
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Evitar la sincronización en el montaje inicial del componente.
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const syncPreferences = async () => {
      clientLogger.trace(
        "[SyncPrefs] El estado de la UI ha cambiado. Sincronizando con la base de datos...",
        { isSidebarCollapsed: debouncedIsSidebarCollapsed }
      );
      await updateProfilePreferencesAction({
        isSidebarCollapsed: debouncedIsSidebarCollapsed,
      });
    };

    syncPreferences();
  }, [debouncedIsSidebarCollapsed]);
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Sincronización Eficiente:** Utiliza `useDebounce` para asegurar que las llamadas a la base de datos solo se realicen después de que el usuario haya dejado de interactuar, optimizando el rendimiento.
 * =====================================================================
 */
// src/lib/hooks/use-sync-dashboard-prefs.ts