/**
 * @file InviteMemberDialog.tsx
 * @description Aparato de UI atómico que encapsula el modal para invitar
 *              nuevos miembros a un workspace. Ha sido refactorizado a un estándar
 *              de élite para consumir el namespace de i18n canónico, resolviendo
 *              un error crítico de `MISSING_MESSAGE` en Vercel.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useWorkspaceDialogStore } from "@/lib/hooks/useWorkspaceDialogStore";
import { InviteMemberForm } from "../InviteMemberForm";

/**
 * @public
 * @component InviteMemberDialog
 * @description Renderiza el diálogo modal para invitar a nuevos miembros.
 *              Gestiona su propia visibilidad consumiendo el `useWorkspaceDialogStore`.
 * @returns {React.ReactElement | null} El componente de diálogo, o null si no hay workspace activo.
 */
export function InviteMemberDialog(): React.ReactElement | null {
  // --- INICIO DE CORRECCIÓN ARQUITECTÓNICA (I18N Namespace) ---
  const t = useTranslations("components.workspaces.WorkspaceSwitcher");
  // --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---
  const { activeDialog, close } = useWorkspaceDialogStore();
  const { activeWorkspace } = useDashboard();

  if (!activeWorkspace) return null;

  const isOpen = activeDialog === "invite";

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("inviteMember_button")}</DialogTitle>
          <DialogDescription>
            {t.rich("inviteMember_description", {
              workspaceName: activeWorkspace.name,
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </DialogDescription>
        </DialogHeader>
        <InviteMemberForm workspaceId={activeWorkspace.id} onSuccess={close} />
      </DialogContent>
    </Dialog>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Blocker de Build**: ((Implementada)) Se ha corregido la llamada a `useTranslations` con el namespace canónico, resolviendo otra instancia del error `MISSING_MESSAGE` que impedía el despliegue en Vercel.
 *
 * @subsection Melhorias Futuras
 * 1. **Invitaciones Múltiples**: ((Vigente)) El `InviteMemberForm` podría ser mejorado para aceptar múltiples correos electrónicos a la vez, y este diálogo podría adaptarse para mostrar un resumen de las invitaciones a enviar.
 *
 * =====================================================================
 */
