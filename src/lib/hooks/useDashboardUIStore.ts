// src/lib/hooks/useDashboardUIStore.ts
/**
 * @file useDashboardUIStore.ts
 * @description Store de estado global de Zustand para la UI del Dashboard.
 *              Refactorizado para incluir la gestión de la librería de iconos activa,
 *              completando el contrato de datos para la personalización de la UI y
 *              utilizando tipos estrictos derivados de la SSoT de configuración.
 * @author L.I.A. Legacy
 * @version 4.0.0
 * @see .docs-espejo/lib/hooks/useDashboardUIStore.ts.md
 */
"use client";

import { create, type StateCreator } from "zustand";
import { syncTabs } from "zustand-sync-tabs";
import {
  createJSONStorage,
  persist,
  type PersistOptions,
} from "zustand/middleware";

import { type IconLibraryDefinition } from "@/config/icon-libraries.config";
import { clientLogger } from "@/lib/logger";

interface DashboardUIState {
  isSidebarCollapsed: boolean;
  isProfileWidgetOpen: boolean;
  activeIconLibraryId: IconLibraryDefinition["id"];
  toggleSidebar: () => void;
  toggleProfileWidget: () => void;
  setProfileWidgetOpen: (isOpen: boolean) => void;
  setActiveIconLibraryId: (id: IconLibraryDefinition["id"]) => void;
}

const creator: StateCreator<DashboardUIState> = (set) => ({
  isSidebarCollapsed: false,
  isProfileWidgetOpen: true,
  activeIconLibraryId: "lucide", // SSoT Default
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
  setActiveIconLibraryId: (id) => {
    clientLogger.trace(
      `[Zustand:DashboardUI] Estableciendo librería de iconos activa.`,
      { newLibraryId: id }
    );
    set({ activeIconLibraryId: id });
  },
});

const persistOptions: PersistOptions<
  DashboardUIState,
  Pick<DashboardUIState, "isSidebarCollapsed" | "activeIconLibraryId">
> = {
  name: "convertikit-dashboard-ui-preferences",
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({
    isSidebarCollapsed: state.isSidebarCollapsed,
    activeIconLibraryId: state.activeIconLibraryId,
  }),
};

export const useDashboardUIStore = create<DashboardUIState>()(
  syncTabs(persist(creator, persistOptions) as StateCreator<DashboardUIState>, {
    name: "convertikit-dashboard-ui-sync",
    exclude: ["isProfileWidgetOpen"],
  })
);
// src/lib/hooks/useDashboardUIStore.ts
