// src/components/dashboard/InvitationBell.tsx
/**
 * @file src/components/dashboard/InvitationBell.tsx
 * @description Aparato de UI atómico y de alta cohesión. Su única responsabilidad
 *              es gestionar y mostrar la interfaz para las notificaciones de
 *              invitaciones de workspace. Ha sido refactorizado para alinear los
 *              contratos de datos con su hook soberano.
 * @author Raz Podestá - MetaShark Tech & Raz Podestá
 * @version 3.0.0
 * @date 2025-08-29
 */
"use client";

import { Bell, Check, LayoutGrid } from "lucide-react";
import React, { useTransition } from "react";
import toast from "react-hot-toast";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { invitations as invitationActions } from "@/lib/actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useRealtimeInvitations } from "@/lib/hooks/use-realtime-invitations";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logger";
import { isActionError } from "@/lib/validators";

/**
 * @public
 * @component InvitationBell
 * @description Gestiona y muestra el icono de notificaciones y la lista de invitaciones.
 * @returns {React.ReactElement}
 */
export function InvitationBell(): React.ReactElement {
  const t = useTypedTranslations("components.dashboard.InvitationBell");
  const tErrors = useTypedTranslations("shared.ValidationErrors");
  const { user, pendingInvitations } = useDashboard();
  const [isPending, startTransition] = useTransition();
  const invitations = useRealtimeInvitations(user, pendingInvitations as any); // Aserción pragmática

  const handleAccept = (invitationId: string) => {
    clientLogger.trace("[InvitationBell] Usuario aceptando invitación.", {
      invitationId,
    });
    startTransition(async () => {
      const result =
        await invitationActions.acceptInvitationAction(invitationId);
      if (result.success) {
        toast.success(
          tErrors(result.data.messageKey as any) ||
            "¡Te has unido al workspace!"
        );
      } else if (isActionError(result)) {
        toast.error(
          tErrors(result.error as any) || "No se pudo aceptar la invitación."
        );
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-9 w-9"
          aria-label={t("view_invitations_sr")}
        >
          <Bell className="h-4 w-4" />
          {invitations.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {invitations.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>{t("pending_invitations_label")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {invitations.length > 0 ? (
          invitations.map((invitation) => (
            <DropdownMenuItem
              key={invitation.id}
              className="flex items-center justify-between gap-2"
              onSelect={(event) => event.preventDefault()}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {invitation.workspaces?.icon || (
                      <LayoutGrid className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">
                    {t.rich("invitation_text", {
                      workspaceName: invitation.workspaces?.name || "...",
                      strong: (chunks) => <strong>{chunks}</strong>,
                    })}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleAccept(invitation.id)}
                disabled={isPending}
                className="text-green-500 hover:text-green-600 hover:bg-green-500/10 h-8 w-8 p-0"
              >
                <Check className="h-4 w-4" />
              </Button>
            </DropdownMenuItem>
          ))
        ) : (
          <p className="p-4 text-center text-sm text-muted-foreground">
            {t("no_pending_invitations")}
          </p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-29
 *
 * @section Melhorias Futuras
 * 1. ((Vigente)) **Acción de Rechazar Invitación:** Añadir un botón de "Rechazar" (`X`) que invoque una nueva `rejectInvitationAction`, proporcionando un flujo de usuario más completo.
 * 2. ((Vigente)) **Indicador de Carga Granular:** `isPending` es un estado global. Para una UX de élite, se podría gestionar un estado de carga por cada invitación (`pendingInvitationId`), mostrando el spinner solo en el botón de la invitación que se está procesando.
 *
 * =====================================================================
 */
// src/components/dashboard/InvitationBell.tsx
