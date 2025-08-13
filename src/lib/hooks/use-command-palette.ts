// src/lib/hooks/use-command-palette.ts
/**
 * @file src/lib/hooks/use-command-palette.ts
 * @description Store de estado global de Zustand para gestionar la visibilidad
 *              y el comportamiento de la paleta de comandos en toda la aplicación.
 *              Este enfoque desacopla el estado de la paleta de los componentes que
 *              la abren o la utilizan, adhiriéndose a la "Filosofía LEGO".
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { create } from "zustand";

/**
 * @public
 * @interface CommandPaletteState
 * @description Define la estructura del estado y las acciones para el store de la paleta de comandos.
 */
interface CommandPaletteState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * @public
 * @constant useCommandPaletteStore
 * @description Hook de Zustand que proporciona acceso al estado de la paleta de comandos
 *              y a las acciones para manipularlo desde cualquier componente de cliente.
 */
export const useCommandPaletteStore = create<CommandPaletteState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Gestión de Contexto**: ((Vigente)) El store podría expandirse para gestionar el "contexto" de la paleta (ej. si se abrió desde un campo de texto específico) para mostrar comandos diferentes.
 * 2. **Persistencia en `sessionStorage`**: ((Vigente)) El estado `isOpen` podría persistirse en `sessionStorage` para mantener la paleta abierta al recargar la página durante el desarrollo.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Estado Global Desacoplado**: ((Implementada)) Este store de Zustand proporciona una solución de élite para gestionar el estado global de la UI sin acoplar los componentes entre sí.
 * 2. **Resolución de Dependencia**: ((Implementada)) La reconstrucción de este aparato resuelve la dependencia `TS2307` en `DashboardHeader`.
 *
 * =====================================================================
 */
// src/lib/hooks/use-command-palette.ts
