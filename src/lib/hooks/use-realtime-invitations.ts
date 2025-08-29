// src/lib/hooks/use-realtime-invitations.ts
/**
 * @file use-realtime-invitations.ts
 * @description Hook de React para gestionar y suscribirse a las invitaciones
 *              pendientes en tiempo real. Ha sido refactorizado holísticamente
 *              para aceptar el tipo de dato crudo de la base de datos y realizar
 *              la transformación de datos internamente, resolviendo la
 *              incompatibilidad de tipos.
 * @author L.I.A. Legacy
 * @version 2.0.0
 * @date 2025-08-29
 */
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { type User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";
import { type Tables } from "@/lib/types/database";

// Tipo de dato crudo de la DB
type RawInvitation = Tables<"invitations"> & {
  workspaces: { name: string } | null;
};

// Tipo de dato de presentación para la UI
export type InvitationPayload = {
  id: string;
  status: string;
  workspaces: {
    name: string;
    icon: string | null; // Mantenemos icon para futura compatibilidad
  } | null;
};

const transformInvitation = (raw: RawInvitation): InvitationPayload => ({
  id: raw.id,
  status: raw.status,
  workspaces: raw.workspaces ? { ...raw.workspaces, icon: null } : null,
});

/**
 * @public
 * @exports useRealtimeInvitations
 * @description Gestiona las invitaciones pendientes, actualizándose en tiempo real.
 * @param {User} user - El objeto del usuario autenticado.
 * @param {RawInvitation[]} serverInvitations - La lista inicial de invitaciones crudas.
 * @returns {InvitationPayload[]} La lista de invitaciones transformada y actualizada.
 */
export const useRealtimeInvitations = (
  user: User,
  serverInvitations: RawInvitation[]
): InvitationPayload[] => {
  const [invitations, setInvitations] = useState<InvitationPayload[]>(() =>
    serverInvitations.map(transformInvitation)
  );
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`realtime-invitations:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*", // Escuchar INSERT, UPDATE, DELETE
          schema: "public",
          table: "invitations",
          filter: `invitee_email=eq.${user.email}`,
        },
        (payload) => {
          toast.success(`¡Tienes una nueva notificación!`);
          router.refresh(); // La estrategia más robusta para re-sincronizar
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, router]);

  useEffect(() => {
    setInvitations(serverInvitations.map(transformInvitation));
  }, [serverInvitations]);

  return invitations;
};
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-29
 *
 * @section Melhorias Futuras
 * 1. ((Vigente)) **Actualización Optimista del Estado:** En lugar de `router.refresh()`, el `payload` del evento en tiempo real podría usarse para actualizar el estado local (`setInvitations`) de forma optimista, proporcionando una UX más instantánea.
 * 2. ((Vigente)) **Feedback Granular:** El `toast` podría ser más específico (ej. "Invitación a {workspaceName} revocada") si se enriquece el payload o se hace una consulta rápida con el ID de la invitación.
 *
 * =====================================================================
 */
// src/lib/hooks/use-realtime-invitations.ts
