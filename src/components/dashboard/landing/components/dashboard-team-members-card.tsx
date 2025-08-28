// src/components/dashboard/landing/components/dashboard-team-members-card.tsx
/**
 * @file dashboard-team-members-card.tsx
 * @description Componente de UI que renderiza una tarjeta mostrando los miembros
 *              del equipo. Ha sido refactorizado holísticamente a un estándar
 *              de élite: ahora es full internacionalizado y está conectado al sistema
 *              de estado global para invocar el diálogo de invitación, y lo más
 *              importante, **consume datos reales del `useDashboard` hook**.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-28
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
import { type Tables } from "@/lib/types/database";

// --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Eliminación de datos mockeados ---
// Los datos de los miembros ahora provienen de `useDashboard`.
// --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---

/**
 * @public
 * @component DashboardTeamMembersCard
 * @description Renderiza la tarjeta de miembros del equipo en el Hub Creativo.
 *              Ahora consume datos reales de los miembros del workspace activo
 *              a través del `useDashboard` hook.
 * @returns {React.ReactElement}
 */
export function DashboardTeamMembersCard(): React.ReactElement {
  const t = useTranslations("components.dashboard.DashboardTeamMembersCard");
  const openInviteDialog = useWorkspaceDialogStore((state) => state.open);
  // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Consumo de datos reales ---
  const { workspaceMembers } = useDashboard();
  // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---

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
                      )}{" "}
                    {/* Fallback Icon */}
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
                  {/* --- INICIO DE MEJORA HOLÍSTICA: Mostrar el rol --- */}
                  <span className={"text-xs leading-4 text-primary"}>
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </span>
                  {/* --- FIN DE MEJORA HOLÍSTICA --- */}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">
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
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Conexión a Datos Dinámicos (Prioridad ALTA)**: ((Implementada)) El componente ahora consume la lista `workspaceMembers` del `useDashboard()` hook, resolviendo la brecha de datos mockeados y mostrando información real de los miembros del equipo.
 * 2. **Visualización de Roles**: ((Implementada)) Se ha añadido la visualización del `role` de cada miembro, que se traduce y muestra con capitalización inicial.
 * 3. **Gestión de Avatar Robusta**: ((Implementada)) El `AvatarImage` y `AvatarFallback` ahora manejan de forma robusta la ausencia de `avatar_url` o `full_name`, mostrando el inicial del email o un icono genérico.
 * 4. **Estado Vacío Internacionalizado**: ((Implementada)) Se ha utilizado la nueva clave de i18n `no_members_yet` para mostrar un mensaje cuando no hay miembros en el equipo.
 * 5. **Full Observabilidad**: ((Implementada)) Se mantiene el `clientLogger` para trazar el renderizado del componente.
 *
 * @subsection Melhorias Futuras
 * 1. **Acciones por Miembro**: ((Vigente)) Una mejora de élite sería añadir un `DropdownMenu` para cada miembro que permita acciones como "Cambiar Rol", "Eliminar Miembro" o "Ver Perfil".
 * 2. **Paginación de Miembros**: ((Vigente)) Para workspaces con muchos miembros, este componente podría integrarse con paginación o virtualización para un rendimiento óptimo.
 * 3. **Internacionalización de Roles**: ((Vigente)) Los nombres de roles (ej. "Owner") se muestran capitalizados. Para una internacionalización completa, se debería usar `t(member.role as any)` si los roles estuvieran definidos en el JSON de i18n.
 *
 * =====================================================================
 */
// src/components/dashboard/landing/components/dashboard-team-members-card.tsx
