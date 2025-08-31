// src/lib/hooks/use-sync-dashboard-prefs.ts
/**
 * @file use-sync-dashboard-prefs.ts
 * @description Hook soberano de efecto secundario. Persiste de forma asíncrona
 *              las preferencias de UI del usuario, ahora alineado con la SSoT de
 *              tipos literal, garantizando la seguridad de tipos.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 3.1.0
 */
"use client";

import { useEffect, useRef } from "react";
import { type z } from "zod";

import { updateProfilePreferencesAction } from "@/lib/actions/profiles.actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useDashboardUIStore } from "@/lib/hooks/useDashboardUIStore";
import { clientLogger } from "@/lib/logging";
import { DashboardLayoutPreferencesSchema } from "@/lib/validators/schemas";
import { type DashboardLayoutPreferences } from "@/lib/types/database/tables/profiles";

export function useSyncDashboardPrefs() {
  const { profile } = useDashboard();
  const isSidebarCollapsed = useDashboardUIStore(
    (state) => state.isSidebarCollapsed
  );
  const debouncedIsSidebarCollapsed = useDebounce(isSidebarCollapsed, 2000);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const syncPreferences = async () => {
      clientLogger.trace(
        "[SyncPrefs] Estado de UI debounced cambió. Sincronizando con la base de datos...",
        { isSidebarCollapsed: debouncedIsSidebarCollapsed }
      );

      const currentPrefs = (profile?.dashboard_layout ||
        {}) as Partial<DashboardLayoutPreferences>;

      const newPrefsPayload: Partial<DashboardLayoutPreferences> = {
        ...currentPrefs,
        isSidebarCollapsed: debouncedIsSidebarCollapsed,
      };

      // La validación ahora funciona correctamente porque los tipos de origen son correctos.
      await updateProfilePreferencesAction(newPrefsPayload);
    };

    syncPreferences();
  }, [debouncedIsSidebarCollapsed, profile?.dashboard_layout]);
}
// src/lib/hooks/use-sync-dashboard-prefs.ts
