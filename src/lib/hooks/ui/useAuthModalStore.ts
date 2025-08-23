// src/lib/hooks/ui/useAuthModalStore.ts
"use client";

import { create } from "zustand";

import { clientLogger } from "@/lib/logging";

/**
 * @public
 * @typedef {'login' | 'signup'} AuthModalView
 * @description Define las vistas posibles dentro del modal de autenticación.
 */
type AuthModalView = "login" | "signup";

/**
 * @public
 * @interface AuthModalState
 * @description Define la estructura del estado del store.
 */
interface AuthModalState {
  isOpen: boolean;
  view: AuthModalView;
}

/**
 * @public
 * @interface AuthModalActions
 * @description Define las acciones que se pueden realizar sobre el estado del store.
 */
interface AuthModalActions {
  /**
   * @function openModal
   * @description Abre el modal en una vista específica.
   * @param {AuthModalView} view - La vista a mostrar ('login' o 'signup').
   */
  openModal: (view: AuthModalView) => void;
  /**
   * @function closeModal
   * @description Cierra el modal de autenticación.
   */
  closeModal: () => void;
  /**
   * @function switchView
   * @description Cambia la vista activa dentro del modal sin cerrarlo.
   * @param {AuthModalView} view - La nueva vista a mostrar.
   */
  switchView: (view: AuthModalView) => void;
}

/**
 * @public
 * @exports useAuthModalStore
 * @description Hook de Zustand que actúa como la Única Fuente de Verdad (SSoT) para
 *              el estado del modal de autenticación global.
 */
export const useAuthModalStore = create<AuthModalState & AuthModalActions>(
  (set) => ({
    isOpen: false,
    view: "login",
    openModal: (view) => {
      clientLogger.trace(`[AuthModalStore] Abriendo modal en vista: ${view}`);
      set({ isOpen: true, view });
    },
    closeModal: () => {
      clientLogger.trace("[AuthModalStore] Cerrando modal.");
      set({ isOpen: false });
    },
    switchView: (view) => {
      clientLogger.trace(`[AuthModalStore] Cambiando a vista: ${view}`);
      set({ view });
    },
  })
);

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Estado Global Desacoplado**: ((Implementada)) Este store proporciona una solución de élite para gestionar el estado de una UI global, permitiendo que cualquier componente invoque el modal sin acoplamiento directo.
 * 2. **Full Observabilidad**: ((Implementada)) Todas las acciones de mutación de estado son registradas con `clientLogger` para una depuración y trazabilidad completas.
 *
 * @subsection Melhorias Futuras
 * 1. **Manejo de Estado de Carga/Error**: ((Vigente)) El store podría expandirse para mantener un estado `isLoading` o `errorMessage` para el proceso de autenticación.
 * 2. **Persistencia de URL de Redirección (`next`)**: ((Vigente)) El store podría almacenar el parámetro `next` de la URL para redirigir al usuario a su destino original después de un inicio de sesión exitoso.
 *
 * =====================================================================
 */
