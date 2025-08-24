// src/lib/hooks/useDashboardUIStore.ts
/**
 * @file useDashboardUIStore.ts
 * @description Store de estado global de Zustand para la UI del Dashboard.
 *              Gestiona el estado de colapso de la barra lateral y la visibilidad
 *              del widget de perfil de usuario.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import { create } from "zustand";

interface DashboardUIState {
  isSidebarCollapsed: boolean;
  isProfileWidgetOpen: boolean;
  toggleSidebar: () => void;
  toggleProfileWidget: () => void;
  setProfileWidgetOpen: (isOpen: boolean) => void;
}

export const useDashboardUIStore = create<DashboardUIState>((set) => ({
  isSidebarCollapsed: false,
  isProfileWidgetOpen: true,
  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  toggleProfileWidget: () =>
    set((state) => ({ isProfileWidgetOpen: !state.isProfileWidgetOpen })),
  setProfileWidgetOpen: (isOpen) => set({ isProfileWidgetOpen: isOpen }),
}));
