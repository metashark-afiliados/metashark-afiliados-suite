// src/lib/hooks/useTeamMembersCard.ts
/**
 * @file src/lib/hooks/useTeamMembersCard.ts
 * @description Hook Soberano que encapsula la lógica de negocio y de estado
 *              para el componente `DashboardTeamMembersCard`. Orquesta el
 *              consumo de datos de sesión, el estado del diálogo de invitación
 *              y la internacionalización.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useDashboard } from "@/lib/context/DashboardContext";
import { useWorkspaceDialogStore } from "@/lib/hooks/useWorkspaceDialogStore";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logging";

/**
 * @public
 * @function useTeamMembersCard
 * @description Hook que provee toda la lógica y estado necesarios para el `DashboardTeamMembersCard`.
 * @returns Un objeto con los datos, manejadores y funciones de i18n para ser
 *          consumidos por el componente de presentación.
 */
export function useTeamMembersCard() {
  clientLogger.trace("[useTeamMembersCard] Hook soberano inicializado.");

  const t = useTypedTranslations(
    "components.dashboard.DashboardTeamMembersCard"
  );
  const openInviteDialog = useWorkspaceDialogStore((state) => state.open);
  const { workspaceMembers } = useDashboard();

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
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Manejo de Estado de Carga**: Si los `workspaceMembers` pudieran estar en un estado de carga, el hook debería devolver un flag `isLoading` para que la UI muestre un esqueleto de carga.
 * 2. **Lógica de Paginación/Virtualización**: Para workspaces con un gran número de miembros, este hook podría encapsular la lógica de paginación o virtualización, exponiendo solo los miembros a renderizar en la página actual.
 * 3. **Acciones por Miembro**: El hook podría exponer funciones como `handleRemoveMember(memberId)` o `handleChangeRole(memberId, newRole)` que invocarían las Server Actions correspondientes y manejarían el feedback al usuario, si la UI se extiende con estas capacidades.
 * 4. **Internacionalización de Roles**: Añadir lógica para traducir los nombres de los roles (`owner`, `admin`, `member`) utilizando `t(member.role)`, requiriendo que estas claves se añadan al namespace de i18n.
 * 5. **Filtrado de Miembros**: Implementar lógica de estado para filtrar la lista de miembros por nombre o rol, si la UI añade un campo de búsqueda.
 * =====================================================================
 */
// src/lib/hooks/useTeamMembersCard.ts
