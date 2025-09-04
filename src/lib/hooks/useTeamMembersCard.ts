// src/lib/hooks/useTeamMembersCard.ts
/**
 * @file useTeamMembersCard.ts
 * @description Hook Soberano que encapsula la lógica de negocio y de estado
 *              para el componente `DashboardTeamMembersCard`. Orquesta el
 *              consumo de datos de sesión, el estado del diálogo de invitación
 *              y la internacionalización.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 1.1.0
 */
"use client";

import { useDashboard } from "@/lib/context/DashboardContext";
import { useWorkspaceDialogStore } from "@/lib/hooks/useWorkspaceDialogStore";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logger";

/**
 * @public
 * @function useTeamMembersCard
 * @description Hook que provee toda la lógica y estado necesarios para el `DashboardTeamMembersCard`.
 * @returns Un objeto con los datos, manejadores y funciones de i18n para ser
 *          consumidos por el componente de presentación.
 */
export function useTeamMembersCard() {
  const t = useTypedTranslations(
    "components.dashboard.DashboardTeamMembersCard"
  );
  const openInviteDialog = useWorkspaceDialogStore((state) => state.open);
  const { workspaceMembers } = useDashboard();

  clientLogger.trace("[useTeamMembersCard] Hook soberano inicializado.", {
    memberCount: workspaceMembers?.length ?? 0,
  });

  const handleInviteClick = () => {
    clientLogger.info(
      "[useTeamMembersCard] El usuario inició el flujo para invitar a un miembro."
    );
    openInviteDialog("invite");
  };

  return {
    t,
    workspaceMembers,
    handleInviteClick,
  };
}
// src/lib/hooks/useTeamMembersCard.ts
