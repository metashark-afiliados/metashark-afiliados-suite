// src/lib/hooks/use-sync-dashboard-prefs.ts
/**
 * @file use-sync-dashboard-prefs.ts
 * @description Hook soberano de efecto secundario. Persiste de forma asíncrona
 *              las preferencias de UI del usuario, validando el payload contra
 *              la SSoT de schemas para máxima seguridad.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 4.0.0
 * @see .docs-espejo/lib/hooks/use-sync-dashboard-prefs.ts.md
 */
"use client";

import { useEffect, useRef } from "react";
import { type z } from "zod";

import { updateProfilePreferencesAction } from "@/lib/actions/profiles.actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useDashboardUIStore } from "@/lib/hooks/useDashboardUIStore";
import { clientLogger } from "@/lib/logger";
import { DashboardLayoutPreferencesSchema } from "@/lib/validators";

type DashboardLayoutPreferences = z.infer<
  typeof DashboardLayoutPreferencesSchema
>;

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
      const context = { isSidebarCollapsed: debouncedIsSidebarCollapsed };
      clientLogger.trace(
        context,
        "[SyncPrefs] Sincronizando preferencias con la base de datos."
      );

      const currentPrefs =
        (profile?.dashboard_layout as Partial<DashboardLayoutPreferences>) ||
        {};

      const newPrefsPayload: Partial<DashboardLayoutPreferences> = {
        ...currentPrefs,
        isSidebarCollapsed: debouncedIsSidebarCollapsed,
      };

      const validation =
        DashboardLayoutPreferencesSchema.partial().safeParse(newPrefsPayload);

      if (!validation.success) {
        clientLogger.error(
          { errors: validation.error.flatten(), payload: newPrefsPayload },
          "[SyncPrefs] Payload de preferencias inválido. Abortando sincronización."
        );
        return;
      }

      await updateProfilePreferencesAction(validation.data);
    };

    syncPreferences();
  }, [debouncedIsSidebarCollapsed, profile?.dashboard_layout]);
}
// src/lib/hooks/use-sync-dashboard-prefs.ts
