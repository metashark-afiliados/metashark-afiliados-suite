// src/lib/hooks/use-sync-dashboard-prefs.ts
/**
 * @file use-sync-dashboard-prefs.ts
 * @description Hook soberano de efecto secundario. Persiste de forma asíncrona
 *              las preferencias de UI del usuario, validando el payload contra
 *              la SSoT de schemas para máxima seguridad.
 * @author L.I.A. Legacy
 * @version 5.0.0
 * @see .docs-espejo/lib/hooks/use-sync-dashboard-prefs.ts.md
 */
"use client";

import { useEffect, useRef } from "react";
import { type z } from "zod";

import {
  ICON_LIBRARIES_MANIFEST,
  type IconLibraryDefinition,
} from "@/config/icon-libraries.config";
import { updateProfilePreferencesAction } from "@/lib/actions/profiles.actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useDashboardUIStore } from "@/lib/hooks/useDashboardUIStore";
import { clientLogger } from "@/lib/logger";
import { type DashboardLayoutPreferencesSchema } from "@/lib/validators/schemas";

type DashboardLayoutPreferences = z.infer<
  typeof DashboardLayoutPreferencesSchema
>;

/**
 * @private
 * @function isValidIconLibraryId
 * @description Guardián de tipo que verifica si un string es un ID de librería válido.
 * @param {any} id - El ID a validar.
 * @returns {id is IconLibraryDefinition['id']}
 */
const isValidIconLibraryId = (id: any): id is IconLibraryDefinition["id"] => {
  return ICON_LIBRARIES_MANIFEST.some((lib) => lib.id === id);
};

export function useSyncDashboardPrefs() {
  const { profile } = useDashboard();
  const { isSidebarCollapsed, activeIconLibraryId } = useDashboardUIStore(
    (state) => ({
      isSidebarCollapsed: state.isSidebarCollapsed,
      activeIconLibraryId: state.activeIconLibraryId,
    })
  );

  const debouncedIsSidebarCollapsed = useDebounce(isSidebarCollapsed, 2000);
  const debouncedActiveIconLibraryId = useDebounce(activeIconLibraryId, 2000);

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const syncPreferences = async () => {
      const context = {
        isSidebarCollapsed: debouncedIsSidebarCollapsed,
        activeIconLibraryId: debouncedActiveIconLibraryId,
      };
      clientLogger.trace(
        context,
        "[SyncPrefs] Sincronizando preferencias con la base de datos."
      );

      const currentPrefs =
        (profile?.dashboard_layout as Partial<DashboardLayoutPreferences>) ||
        {};

      if (!isValidIconLibraryId(debouncedActiveIconLibraryId)) {
        clientLogger.error(
          context,
          "[SyncPrefs] ID de librería de iconos inválido. Abortando sincronización."
        );
        return;
      }

      const newPrefsPayload: Partial<DashboardLayoutPreferences> = {
        ...currentPrefs,
        isSidebarCollapsed: debouncedIsSidebarCollapsed,
        activeIconLibraryId: debouncedActiveIconLibraryId,
      };

      await updateProfilePreferencesAction(newPrefsPayload);
    };

    syncPreferences();
  }, [
    debouncedIsSidebarCollapsed,
    debouncedActiveIconLibraryId,
    profile?.dashboard_layout,
  ]);
}
// src/lib/hooks/use-sync-dashboard-prefs.ts
