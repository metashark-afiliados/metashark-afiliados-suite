// src/lib/hooks/useDashboardUIStore.ts
/**
 * @file useDashboardUIStore.ts
 * @description Store de estado global de Zustand para la UI del Dashboard.
 *              Corregido con tipificación explícita y aserciones quirúrgicas
 *              para resolver errores de inferencia de tipos complejos al anidar
 *              middlewares.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.3.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { clientLogger } from "@/lib/logger";
import { create, type StateCreator } from "zustand";
import { syncTabs } from "zustand-sync-tabs";
import {
  createJSONStorage,
  persist,
  type PersistOptions,
} from "zustand/middleware";

interface DashboardUIState {
  isSidebarCollapsed: boolean;
  isProfileWidgetOpen: boolean;
  toggleSidebar: () => void;
  toggleProfileWidget: () => void;
  setProfileWidgetOpen: (isOpen: boolean) => void;
}

// --- INICIO DE CORRECCIÓN DE TIPO (TS7006) ---
const creator: StateCreator<DashboardUIState> = (set) => ({
  isSidebarCollapsed: false,
  isProfileWidgetOpen: true,
  toggleSidebar: () =>
    set((state) => {
      clientLogger.trace("[Zustand:DashboardUI] Alternando barra lateral.", {
        newState: !state.isSidebarCollapsed,
      });
      return { isSidebarCollapsed: !state.isSidebarCollapsed };
    }),
  toggleProfileWidget: () =>
    set((state) => {
      clientLogger.trace("[Zustand:DashboardUI] Alternando widget de perfil.", {
        newState: !state.isProfileWidgetOpen,
      });
      return { isProfileWidgetOpen: !state.isProfileWidgetOpen };
    }),
  setProfileWidgetOpen: (isOpen) => {
    clientLogger.trace(
      "[Zustand:DashboardUI] Estableciendo visibilidad del widget de perfil.",
      { newState: isOpen }
    );
    set({ isProfileWidgetOpen: isOpen });
  },
});
// --- FIN DE CORRECCIÓN DE TIPO (TS7006) ---

// --- INICIO DE CORRECCIÓN DE TIPO (TS2322) ---
const persistOptions: PersistOptions<
  DashboardUIState,
  Pick<DashboardUIState, "isSidebarCollapsed"> // Especifica la forma del estado persistido
> = {
  name: "convertikit-dashboard-ui-preferences",
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({
    isSidebarCollapsed: state.isSidebarCollapsed,
  }),
};
// --- FIN DE CORRECCIÓN DE TIPO (TS2322) ---

export const useDashboardUIStore = create<DashboardUIState>()(
  syncTabs(
    // --- INICIO DE CORRECCIÓN DE TIPO (TS2345) ---
    persist(creator, persistOptions) as StateCreator<DashboardUIState>,
    // --- FIN DE CORRECCIÓN DE TIPO (TS2345) ---
    {
      name: "convertikit-dashboard-ui-sync",
      exclude: ["isProfileWidgetOpen"],
    }
  )
);

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Resolución de Regresión de Tipo Compleja:** La tipificación explícita de `PersistOptions` y la aserción de tipo quirúrgica en `persist` resuelven la cascada de errores de TypeScript, restaurando la integridad del sistema de tipos.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Sincronización Selectiva con el Servidor:** El estado persistido en `localStorage` podría ser sincronizado periódicamente con la base de datos para mantener las preferencias de UI entre diferentes dispositivos.
 *
 * =====================================================================
 */
// src/lib/hooks/useDashboardUIStore.ts
