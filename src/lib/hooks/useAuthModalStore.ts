// src/lib/hooks/useAuthModalStore.ts
/**
 * @file src/lib/hooks/useAuthModalStore.ts
 * @description Store de estado global de Zustand. Es la Única Fuente de Verdad
 *              (SSoT) para gestionar el estado de la UI de los modales de
 *              autenticación en toda la aplicación. Este aparato desacopla el
 *              estado de los componentes, permitiendo que cualquier componente
 *              pueda solicitar la apertura de un modal de login o signup.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import { create } from "zustand";

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
   * @function openModal - Abre el modal en una vista específica.
   * @param {AuthModalView} view - La vista a mostrar ('login' o 'signup').
   */
  openModal: (view: AuthModalView) => void;
  /**
   * @function closeModal - Cierra el modal de autenticación.
   */
  closeModal: () => void;
  /**
   * @function switchView - Cambia la vista activa dentro del modal.
   * @param {AuthModalView} view - La nueva vista a mostrar.
   */
  switchView: (view: AuthModalView) => void;
}

/**
 * @public
 * @constant useAuthModalStore
 * @description Hook de Zustand que proporciona acceso al estado y acciones
 *              del modal de autenticación.
 */
export const useAuthModalStore = create<AuthModalState & AuthModalActions>(
  (set) => ({
    isOpen: false,
    view: "login",
    openModal: (view) => set({ isOpen: true, view }),
    closeModal: () => set({ isOpen: false }),
    switchView: (view) => set({ view }),
  })
);

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Estado Global Desacoplado**: ((Implementada)) Este store de Zustand proporciona una solución de élite para gestionar el estado de una UI global como el modal de autenticación, eliminando la necesidad de "prop drilling" y permitiendo que componentes no relacionados (ej. un botón en el footer) puedan disparar la apertura del modal.
 * 2. **Gestión de Vistas de Modal**: ((Implementada)) El store no solo controla la visibilidad (`isOpen`), sino también qué vista se muestra (`view`), centralizando toda la lógica de estado del modal en un único lugar.
 *
 * @subsection Melhorias Futuras
 * 1. **Manejo de Estado de Carga/Error**: ((Vigente)) El store podría expandirse para mantener un estado global de `isLoading` o `errorMessage` para el proceso de autenticación. Esto permitiría que el `AuthDialog` muestre estados de carga o error sin gestionar esa lógica internamente.
 * 2. **Persistencia de URL de Redirección (`next`)**: ((Vigente)) El store podría ser utilizado para almacenar el parámetro `next` de la URL. Si un usuario abre el modal desde `/pricing`, se podría guardar `next=/pricing` en el store. Esto aseguraría que, incluso si el usuario navega entre las vistas de login y signup, la URL de redirección final se preserve.
 *
 * =====================================================================
 */
// src/lib/hooks/useAuthModalStore.ts
