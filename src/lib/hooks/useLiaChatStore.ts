// src/lib/hooks/useLiaChatStore.ts
/**
 * @file src/lib/hooks/useLiaChatStore.ts
 * @description Store de estado global de Zustand para gestionar la visibilidad
 *              y el comportamiento del widget de chat de L.I.A. en toda la aplicación.
 *              Este enfoque desacopla el estado del widget de los componentes
 *              que lo controlan.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { create } from "zustand";

/**
 * @public
 * @interface LiaChatState
 * @description Define la estructura del estado y las acciones para el store del chat.
 */
interface LiaChatState {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
}

/**
 * @public
 * @constant useLiaChatStore
 * @description Hook de Zustand que proporciona acceso al estado del widget de chat
 *              y a las acciones para manipularlo desde cualquier componente de cliente.
 */
export const useLiaChatStore = create<LiaChatState>((set) => ({
  isOpen: false,
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
}));

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Estado Global Desacoplado**: ((Implementada)) Este store de Zustand proporciona una solución de élite para gestionar el estado global de una UI transversal como el widget de chat, evitando el "prop drilling".
 *
 * @subsection Melhorias Futuras
 * 1. **Gestión de Contexto de Chat**: ((Vigente)) El store podría expandirse para mantener el contexto de la conversación actual (ej. `setContext('pricing_question')`) para que L.I.A. pueda iniciar la conversación con un mensaje relevante.
 *
 * =====================================================================
 */
// src/lib/hooks/useLiaChatStore.ts
