// src/components/dashboard/landing/components/dashboard-team-members-card.tsx
/**
 * @file dashboard-team-members-card.tsx
 * @description Componente de UI que renderiza una tarjeta mostrando los miembros
 *              del equipo del workspace activo.
 * @author Raz Podestá (adaptado de paddle-nextjs-starter-kit)
 * @version 1.0.0
 */
"use client";

import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Usaremos nuestro Avatar

// Datos de placeholder, análogos al proyecto de referencia
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

export function DashboardTeamMembersCard() {
  return (
    <Card className={"bg-background/50 backdrop-blur-[24px] border-border p-6"}>
      <CardHeader className="p-0 space-y-0">
        <CardTitle className="flex justify-between gap-2 items-center pb-6 border-border border-b">
          <div className={"flex flex-col gap-2"}>
            <span className={"text-xl font-medium"}>Team members</span>
            <span className={"text-base leading-4 text-muted-foreground"}>
              Invite your team members to collaborate
            </span>
          </div>
          <Button
            asChild={true}
            size={"sm"}
            variant={"outline"}
            className={"text-sm rounded-sm border-border"}
          >
            {/* Este enlace debería abrir el modal de invitar miembro */}
            <Link href={"#"}>
              <Plus size={16} className={"text-muted-foreground"} />
            </Link>
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
 * 1. **Componente de Colaboración**: ((Implementada)) Introduce la visualización de miembros del equipo en el dashboard, reforzando las capacidades multi-tenant de la aplicación.
 * 2. **Adaptación a Nuestro Ecosistema**: ((Implementada)) El componente utiliza nuestro `Avatar` de Shadcn/UI y datos adaptados a nuestro proyecto.
 *
 * @subsection Melhorias Futuras
 * 1. **Datos Dinámicos**: ((Vigente)) Este componente debe ser refactorizado para obtener la lista de `teamMembers` desde el `useDashboard` hook, consultando la propiedad `workspace_members` del contexto.
 * 2. **Integración con Modal de Invitación**: ((Vigente)) El botón `+` debe ser conectado para invocar `useWorkspaceDialogStore.getState().open('invite')` y abrir el modal de invitación.
 *
 * =====================================================================
 */
