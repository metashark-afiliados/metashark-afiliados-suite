// src/lib/hooks/use-sync-dashboard-prefs.ts
/**
 * @file use-sync-dashboard-prefs.ts
 * @description Hook soberano de efecto secundario. Ha sido refactorizado
 *              holísticamente para leer el estado de preferencias completo del
 *              perfil del usuario, fusionar los cambios, y enviar el payload
 *              completo a la Server Action, resolviendo el error de tipo TS2345.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useEffect, useRef } from "react";
import { type z } from "zod";

import { updateProfilePreferencesAction } from "@/lib/actions/profiles.actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useDashboardUIStore } from "@/lib/hooks/useDashboardUIStore";
import { clientLogger } from "@/lib/logging";
import { type DashboardLayoutPreferencesSchema } from "@/lib/validators";

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
        "[SyncPrefs] El estado de la UI ha cambiado. Sincronizando con la base de datos...",
        { isSidebarCollapsed: debouncedIsSidebarCollapsed }
      );

      // Lee las preferencias actuales para no sobrescribir otros valores.
      const currentPrefs = (profile?.dashboard_layout || {
        isSidebarCollapsed: false,
        activeIconLibraryId: "lucide",
      }) as z.infer<typeof DashboardLayoutPreferencesSchema>;

      await updateProfilePreferencesAction({
        ...currentPrefs,
        isSidebarCollapsed: debouncedIsSidebarCollapsed,
      });
    };

    syncPreferences();
  }, [debouncedIsSidebarCollapsed, profile?.dashboard_layout]);
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Sincronización de Múltiples Preferencias**: A medida que se añadan más preferencias al `useDashboardUIStore` (ej. `viewMode`), este hook debería ser extendido para sincronizarlas todas, posiblemente "debounceando" el objeto de estado completo en lugar de valores individuales.
 * 2. **Manejo de Errores de Sincronización**: La llamada a `updateProfilePreferencesAction` no maneja el caso de error. Se podría añadir un `try/catch` y mostrar un `toast.error` sutil si la sincronización en segundo plano falla.
 * 3. **Estado de Sincronización Global**: El hook podría exponer un estado `isSyncing: boolean` a través de un store global para mostrar un indicador en la UI (ej. en la `StatusBar`) mientras se guardan las preferencias.
 * =====================================================================
 */
