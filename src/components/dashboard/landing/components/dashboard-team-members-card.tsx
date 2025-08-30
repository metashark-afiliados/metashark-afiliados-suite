// src/components/dashboard/landing/components/dashboard-team-members-card.tsx
/**
 * @file dashboard-team-members-card.tsx
 * @description Componente de UI de presentación puro. Ha sido refactorizado
 *              a un estándar de élite para ser un ensamblador 100% agnóstico a la
 *              lógica de negocio, consumiendo el hook soberano `useTeamMembersCard`
 *              para obtener todo su estado y contenido.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { Plus, User as UserIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeamMembersCard } from "@/lib/hooks/useTeamMembersCard";
import { clientLogger } from "@/lib/logging";

/**
 * @public
 * @component DashboardTeamMembersCard
 * @description Ensambla la tarjeta de miembros del equipo en el Hub Creativo.
 *              Es un componente de presentación puro que delega toda su lógica
 *              al hook `useTeamMembersCard`.
 * @returns {React.ReactElement}
 */
export function DashboardTeamMembersCard(): React.ReactElement {
  clientLogger.trace(
    "[DashboardTeamMembersCard] Renderizando componente de presentación puro."
  );

  const { t, workspaceMembers, handleInviteClick } = useTeamMembersCard();

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
                      t("unknown_member", {
                        defaultValue: member.profiles?.email,
                      })}
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
 * @subsection Melhorias Futuras
 * 1. **Componente `TeamMemberRow` Atómico**: La `div` que renderiza cada miembro dentro del `.map()` podría ser extraída a su propio componente `TeamMemberRow.tsx` para una máxima atomicidad y limpieza del JSX en este orquestador.
 * 2. **Esqueleto de Carga (Skeleton)**: Si `useTeamMembersCard` implementa un estado `isLoading`, este componente debería renderizar una lista de `Skeleton` `div`s para mejorar la UX de carga.
 * 3. **Internacionalización de Roles**: El rol del miembro (`member.role`) se capitaliza directamente. Para una internacionalización completa, se debería usar `t('role_' + member.role)`, lo cual requeriría añadir estas claves al `DashboardTeamMembersCard.json`.
 * 4. **Accesibilidad de la Lista**: La lista de miembros podría ser envuelta en una `<ul>` y cada miembro en un `<li>` para una mejor semántica HTML y accesibilidad.
 * 5. **Acciones por Miembro**: Integrar un `DropdownMenu` con acciones contextuales (Cambiar Rol, Eliminar) para cada miembro, consumiendo nuevas funciones que serían expuestas por el hook `useTeamMembersCard`.
 * =====================================================================
 */
// src/components/dashboard/landing/components/dashboard-team-members-card.tsx
