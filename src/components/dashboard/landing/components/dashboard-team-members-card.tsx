/**
 * @file dashboard-team-members-card.tsx
 * @description Componente de UI que renderiza una tarjeta mostrando los miembros
 *              del equipo. Ha sido refactorizado a un estándar de élite:
 *              ahora es full internacionalizado y está conectado al sistema
 *              de estado global para invocar el diálogo de invitación.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspaceDialogStore } from "@/lib/hooks/useWorkspaceDialogStore";
import { clientLogger } from "@/lib/logging";

// Datos de placeholder, a ser reemplazados por datos del `useDashboard` hook.
const teamMembers = [
  {
    name: "Raz Podestá",
    email: "dev@convertikit.com",
    avatarUrl: "https://avatars.githubusercontent.com/u/1024025?v=4",
    initials: "RP",
  },
  {
    name: "L.I.A. Legacy",
    email: "lia@convertikit.com",
    avatarUrl:
      "https://api.dicebear.com/7.x/bottts/svg?seed=lia-legacy&backgroundColor=transparent&baseColor=adff2f",
    initials: "LIA",
  },
];

/**
 * @public
 * @component DashboardTeamMembersCard
 * @description Renderiza la tarjeta de miembros del equipo en el Hub Creativo.
 * @returns {React.ReactElement}
 */
export function DashboardTeamMembersCard(): React.ReactElement {
  const t = useTranslations("components.dashboard.DashboardTeamMembersCard");
  const openInviteDialog = useWorkspaceDialogStore((state) => state.open);

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
        {teamMembers.map((teamMember) => (
          <div
            key={teamMember.email}
            className={"flex justify-between items-center gap-2"}
          >
            <div className={"flex gap-4 items-center"}>
              <Avatar>
                <AvatarImage src={teamMember.avatarUrl} alt={teamMember.name} />
                <AvatarFallback>{teamMember.initials}</AvatarFallback>
              </Avatar>
              <div className={"flex flex-col gap-1"}>
                <span className={"text-base leading-4 font-medium"}>
                  {teamMember.name}
                </span>
                <span className={"text-sm leading-4 text-muted-foreground"}>
                  {teamMember.email}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Full Internacionalización**: ((Implementada)) Todo el texto codificado ha sido extraído y ahora se consume desde la capa de i18n, cumpliendo con el protocolo.
 * 2. **Integración con Estado Global**: ((Implementada)) El botón de "Invitar" ahora está conectado al `useWorkspaceDialogStore` y abre correctamente el modal de invitación.
 * 3. **Full Observabilidad**: ((Implementada)) Se ha añadido `clientLogger` para registrar la interacción del usuario con el botón de invitar.
 *
 * @subsection Melhorias Futuras
 * 1. **Conexión a Datos Dinámicos**: ((Vigente)) ((PRIORIDAD ALTA)) Este componente debe ser refactorizado para consumir la lista de miembros del `useDashboard` hook. Esto requerirá una modificación en el `dashboard.loader.ts` para que obtenga los `workspace_members` del workspace activo y los inyecte en el contexto.
 * 2. **Gestión de Roles**: ((Vigente)) Una vez que los datos sean dinámicos, se debería mostrar el rol de cada miembro (`owner`, `admin`, `member`) junto a su nombre.
 *
 * =====================================================================
 */
