// src/lib/hooks/useWorkspaceDialogStore.ts
/**
 * @file useWorkspaceDialogStore.ts
 * @description Store de estado global de Zustand. Es la Única Fuente de Verdad
 *              para gestionar el estado de la UI de los modales de workspace.
 *              Sincronizado para incluir el diálogo 'rename'.
 * @author Raz Podestá
 * @version 1.1.0
 */
import { create } from "zustand";
import { clientLogger } from "@/lib/logging";

// --- INICIO DE CORRECCIÓN ---
export type WorkspaceDialogType =
  | "create"
  | "invite"
  | "settings"
  | "delete"
  | "rename";
// --- FIN DE CORRECCIÓN ---

interface WorkspaceDialogState {
  activeDialog: WorkspaceDialogType | null;
  open: (dialog: WorkspaceDialogType) => void;
  close: () => void;
}

export const useWorkspaceDialogStore = create<WorkspaceDialogState>((set) => ({
  activeDialog: null,
  open: (dialog) => {
    clientLogger.trace(`[Zustand:WorkspaceDialog] Abriendo diálogo: ${dialog}`);
    set({ activeDialog: dialog });
  },
  close: () => {
    clientLogger.trace(
      "[Zustand:WorkspaceDialog] Cerrando todos los diálogos."
    );
    set({ activeDialog: null });
  },
}));
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Contrato**: ((Implementada)) El tipo `WorkspaceDialogType` ahora incluye `"rename"`, eliminando la deuda técnica y el `any` cast en `useWorkspaceManager`.
 *
 * =====================================================================
 */
// src/lib/hooks/useWorkspaceDialogStore.ts
