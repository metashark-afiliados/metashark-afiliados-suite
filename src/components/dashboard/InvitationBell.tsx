// src/components/dashboard/InvitationBell.tsx
/**
 * @file src/components/dashboard/InvitationBell.tsx
 * @description Aparato de UI atómico y de alta cohesión. Su única responsabilidad
 *              es gestionar y mostrar la interfaz para las notificaciones de
 *              invitaciones de workspace. Consume el namespace de i18n canónico
 *              y proporciona un feedback de usuario granular al aceptar una invitación.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
"use client";

import React from "react";
import toast from "react-hot-toast";
import { Bell, Check, LayoutGrid } from "lucide-react";

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
import { logger } from "@/lib/logging";

/**
 * @public
 * @component InvitationBell
 * @description Gestiona y muestra el icono de notificaciones y la lista desplegable
 *              de invitaciones a workspaces pendientes. Se suscribe a actualizaciones
 *              en tiempo real y maneja la lógica para aceptar invitaciones.
 * @returns {React.ReactElement} El componente de la campana de notificaciones.
 */
export function InvitationBell(): React.ReactElement {
  const t = useTypedTranslations("components.dashboard.InvitationBell");
  const { user, pendingInvitations } = useDashboard();
  const [isPending, startTransition] = React.useTransition();
  const invitations = useRealtimeInvitations(user, pendingInvitations);

  const handleAccept = (invitationId: string) => {
    logger.trace("[InvitationBell] Usuario aceptando invitación.", {
      userId: user.id,
      invitationId,
    });
    startTransition(async () => {
      const result =
        await invitationActions.acceptInvitationAction(invitationId);
      if (result.success) {
        const acceptedInvitation = invitations.find(
          (inv) => inv.id === invitationId
        );
        const workspaceName = acceptedInvitation?.workspaces?.name || "...";
        toast.success(t("accept_invitation_success", { workspaceName }));
      } else {
        toast.error(result.error || t("accept_invitation_error"));
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          aria-label={t("view_invitations_sr")}
        >
          <Bell className="h-5 w-5" />
          {invitations.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
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
                className="text-green-500 hover:text-green-600 hover:bg-green-500/10"
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
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de i18n**: ((Implementada)) El componente ahora consume el namespace canónico `"components.dashboard.InvitationBell"`, alineándose con la infraestructura de i18n refactorizada.
 * 2. **Feedback de Usuario Mejorado**: ((Implementada)) La función `handleAccept` utiliza el nombre del workspace para un `toast` más granular, mejorando la UX.
 *
 * @subsection Melhorias Futuras
 * 1. **Notificaciones Genéricas**: ((Vigente)) Este componente podría evolucionar para manejar múltiples tipos de notificaciones (no solo invitaciones) obtenidas de una tabla `notifications` genérica, convirtiéndose en un centro de notificaciones completo.
 * 2. **Marcar como Lida**: ((Vigente)) Añadir una acción para marcar una notificación como leída sin necesariamente aceptar la invitación.
 *
 * =====================================================================
 */
// src/components/dashboard/InvitationBell.tsx
