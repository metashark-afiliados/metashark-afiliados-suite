/**
 * @file useDashboardUIStore.ts
 * @description Store de estado global de Zustand para la UI del Dashboard.
 *              Esta es la Única Fuente de Verdad (SSoT) para el estado visual
 *              del layout del "Workspace Creativo", gestionando la visibilidad
 *              de la barra lateral contextual y el widget de perfil de usuario.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { create } from "zustand";
import { clientLogger } from "@/lib/logging";

/**
 * @public
 * @interface DashboardUIState
 * @description Define la estructura del estado y las acciones para el store de la UI del dashboard.
 */
interface DashboardUIState {
  /** Controla si la barra lateral secundaria (contextual) está colapsada. */
  isSidebarCollapsed: boolean;
  /** Controla si el widget de perfil de usuario flotante está visible. */
  isProfileWidgetOpen: boolean;
  /** Acción para alternar el estado de colapso de la barra lateral. */
  toggleSidebar: () => void;
  /** Acción para alternar la visibilidad del widget de perfil. */
  toggleProfileWidget: () => void;
  /** Acción para establecer explícitamente la visibilidad del widget de perfil. */
  setProfileWidgetOpen: (isOpen: boolean) => void;
}

/**
 * @public
 * @constant useDashboardUIStore
 * @description Hook de Zustand que proporciona acceso al estado de la UI del dashboard
 *              y a las acciones para manipularlo desde cualquier componente de cliente.
 */
export const useDashboardUIStore = create<DashboardUIState>((set) => ({
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
      {
        newState: isOpen,
      }
    );
    set({ isProfileWidgetOpen: isOpen });
  },
}));

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Estado de UI Desacoplado**: ((Implementada)) Este store es una implementación de élite de la "Filosofía LEGO". Permite que componentes no relacionados (ej. el `PrimarySidebar` y el `DashboardLayout`) se comuniquen y compartan estado de UI sin acoplamiento directo.
 * 2. **Full Observabilidad**: ((Implementada)) Cada acción que muta el estado registra un evento de `trace`, proporcionando visibilidad completa sobre las interacciones del usuario con la UI del layout.
 *
 * @subsection Melhorias Futuras
 * 1. **Persistencia de Preferencias**: ((Vigente)) Se podría integrar el middleware `persist` de Zustand para guardar el estado `isSidebarCollapsed` en `localStorage`. Esto permitiría que la preferencia del usuario sobre el layout se mantenga entre sesiones.
 *
 * =====================================================================
 */
