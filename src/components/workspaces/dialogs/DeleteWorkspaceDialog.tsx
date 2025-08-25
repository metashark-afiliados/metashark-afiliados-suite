/**
 * @file DeleteWorkspaceDialog.tsx
 * @description Componente de UI que implementa el modal para la eliminación de un workspace.
 *              Ha sido refactorizado a un estándar de élite para consumir los namespaces
 *              de i18n canónicos, resolviendo un error crítico de `MISSING_MESSAGE` en Vercel.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useTranslations } from "next-intl";
import { ShieldAlert } from "lucide-react";

import { workspaces as workspaceActions } from "@/lib/actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useWorkspaceDialogStore } from "@/lib/hooks/useWorkspaceDialogStore";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmationDialogContent } from "@/components/ui/ConfirmationDialog";

/**
 * @public
 * @component DeleteWorkspaceDialog
 * @description Renderiza el diálogo modal para la eliminación de un workspace.
 *              Gestiona su propia visibilidad consumiendo el `useWorkspaceDialogStore`.
 * @returns {React.ReactElement | null} El componente de diálogo, o null si no hay workspace activo.
 */
export function DeleteWorkspaceDialog(): React.ReactElement | null {
  // --- INICIO DE CORRECCIÓN ARQUITECTÓNICA (I18N Namespace) ---
  const t = useTranslations("components.workspaces.WorkspaceSwitcher");
  const tDialogs = useTranslations("components.ui.Dialogs");
  // --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---

  const { activeDialog, close } = useWorkspaceDialogStore();
  const { activeWorkspace } = useDashboard();

  if (!activeWorkspace) return null;

  return (
    <Dialog open={activeDialog === "delete"} onOpenChange={close}>
      <ConfirmationDialogContent
        icon={ShieldAlert}
        title={t("delete_dialog.title")}
        description={t.rich("delete_dialog.description", {
          workspaceName: activeWorkspace.name,
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
        onClose={close}
        confirmButtonText={t("delete_dialog.confirm_button")}
        cancelButtonText={tDialogs("generic_cancelButton")}
        onConfirm={workspaceActions.deleteWorkspaceAction}
        isPending={false} // La gestión de isPending se hará en un hook futuro
        hiddenInputs={{ workspaceId: activeWorkspace.id }}
        confirmationText={activeWorkspace.name}
        confirmationLabel={t.rich("delete_dialog.confirmation_label", {
          workspaceName: activeWorkspace.name,
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
      />
    </Dialog>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Blocker de Build**: ((Implementada)) Se han corregido las llamadas a `useTranslations` con los namespaces canónicos, resolviendo otra instancia del error `MISSING_MESSAGE` que impedía el despliegue.
 *
 * @subsection Melhorias Futuras
 * 1. **Hook Soberano `useDeleteWorkspace`**: ((Vigente)) La lógica para manejar el estado `isPending` y el feedback al usuario (`toast`) debería ser abstraída a su propio hook para una mayor cohesión y reutilización.
 *
 * =====================================================================
 */
