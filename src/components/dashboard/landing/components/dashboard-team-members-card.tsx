// src/components/dashboard/landing/components/dashboard-team-members-card.tsx
/**
 * @file dashboard-team-members-card.tsx
 * @description Componente de UI que renderiza una tarjeta mostrando los miembros
 *              del equipo. Ha sido refactorizado holísticamente a un estándar
 *              de élite para consumir datos reales del `useDashboard` hook,
 *              eliminando por completo los datos mockeados.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { Plus, User as UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useWorkspaceDialogStore } from "@/lib/hooks/useWorkspaceDialogStore";
import { clientLogger } from "@/lib/logging";

/**
 * @public
 * @component DashboardTeamMembersCard
 * @description Renderiza la tarjeta de miembros del equipo en el Hub Creativo.
 *              Consume datos reales de los miembros del workspace activo.
 * @returns {React.ReactElement}
 */
export function DashboardTeamMembersCard(): React.ReactElement {
  const t = useTranslations("components.dashboard.DashboardTeamMembersCard");
  const openInviteDialog = useWorkspaceDialogStore((state) => state.open);
  const { workspaceMembers } = useDashboard();

  clientLogger.trace(
    "[DashboardTeamMembersCard] Renderizando con datos reales.",
    { memberCount: workspaceMembers?.length ?? 0 }
  );

  const handleInviteClick = () => {
    clientLogger.info(
      "[DashboardTeamMembersCard] El usuario inició el flujo para invitar a un miembro."
    );
    openInviteDialog("invite");
  };

  return (
    <Card className={"bg-background/50 backdrop-blur-[24px] border-border p-6"}>
      <CardHeader className="p-0 space-y-0">
        <CardTitle className="flex justify-between gap-2 items-center pb-6 border-border border-b">
          <div className={"flex flex-col gap-2"}>
            <span className={"text-xl font-medium"}>{t("title")}</span>
            <span className={"text-base leading-4 text-muted-foreground"}>
              {t("description")}
            </span>
          </div>
          <Button
            size={"sm"}
            variant={"outline"}
            className={"text-sm rounded-sm border-border"}
            onClick={handleInviteClick}
            aria-label={t("invite_button_aria")}
          >
            <Plus size={16} className={"text-muted-foreground"} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className={"p-0 pt-6 flex gap-6 flex-col"}>
        {workspaceMembers && workspaceMembers.length > 0 ? (
          workspaceMembers.map((member) => (
            <div
              key={member.id}
              className={"flex justify-between items-center gap-2"}
            >
              <div className={"flex gap-4 items-center"}>
                <Avatar>
                  <AvatarImage
                    src={member.profiles?.avatar_url || undefined}
                    alt={
                      member.profiles?.full_name ||
                      member.profiles?.email ||
                      "Miembro"
                    }
                  />
                  <AvatarFallback>
                    {member.profiles?.full_name?.charAt(0).toUpperCase() ||
                      member.profiles?.email?.charAt(0).toUpperCase() || (
                        <UserIcon className="h-4 w-4" />
                      )}
                  </AvatarFallback>
                </Avatar>
                <div className={"flex flex-col gap-1"}>
                  <span className={"text-base leading-4 font-medium"}>
                    {member.profiles?.full_name ||
                      member.profiles?.email ||
                      t("unknown_member")}
                  </span>
                  <span className={"text-sm leading-5 text-muted-foreground"}>
                    {member.profiles?.email}
                  </span>
                  <span
                    className={"text-xs leading-4 text-primary font-semibold"}
                  >
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-muted-foreground pt-4">
            {t("no_members_yet")}
          </p>
        )}
      </CardContent>
    </Card>
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
 * 1. ((Vigente)) **Acciones por Miembro:** Añadir un `DropdownMenu` ("...") junto a cada miembro para permitir acciones contextuales como "Cambiar Rol" o "Eliminar Miembro". Esto requeriría nuevas Server Actions y diálogos de confirmación.
 * 2. ((Vigente)) **Internacionalización de Roles:** Los nombres de roles (ej. "Owner") se muestran capitalizados directamente desde la base de datos. Para una internacionalización completa, se debería usar `t(member.role as any)` si los roles estuvieran definidos en el JSON de i18n, o un mapeo dedicado.
 * 3. ((Vigente)) **Paginación/Virtualización:** Para workspaces con un gran número de miembros, la lista podría ser paginada o virtualizada para garantizar un rendimiento óptimo a escala.
 *
 * =====================================================================
 */
// src/components/dashboard/landing/components/dashboard-team-members-card.tsx
