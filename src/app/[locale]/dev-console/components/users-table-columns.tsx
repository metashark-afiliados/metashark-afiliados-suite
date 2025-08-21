// src/app/[locale]/dev-console/components/users-table-columns.tsx
/**
 * @file users-table-columns.tsx
 * @description Aparato de configuración de UI atómico y puro. Su única
 *              responsabilidad es actuar como una factoría que construye y
 *              devuelve la definición de columnas para la tabla de usuarios.
 * @author Raz Podestá
 * @version 1.0.0
 */
import React from "react";
import { type useTranslations } from "next-intl";
import { type ColumnDef } from "@tanstack/react-table";

import { type Database } from "@/lib/types/database";
import { type UserProfilesWithEmail } from "@/lib/types/database/views";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImpersonationDialog } from "./ImpersonationDialog";

type ProfileRow = UserProfilesWithEmail["Row"];
type TFunction = ReturnType<typeof useTranslations>;

export interface GetUsersColumnsParams {
  t: TFunction;
  isPending: boolean;
  handleRoleChange: (
    userId: string,
    newRole: Database["public"]["Enums"]["app_role"]
  ) => void;
}

/**
 * @public
 * @function getUsersColumns
 * @description Factoría que construye el array de definiciones de columna para
 *              la tabla de gestión de usuarios.
 * @param {GetUsersColumnsParams} params - Dependencias necesarias para renderizar las celdas.
 * @returns {ColumnDef<ProfileRow>[]} El array de configuración de columnas.
 */
export const getUsersColumns = ({
  t,
  isPending,
  handleRoleChange,
}: GetUsersColumnsParams): ColumnDef<ProfileRow>[] => [
  {
    header: t("table_header.email"),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.email}</div>
        <div className="text-xs text-muted-foreground font-mono">
          {row.original.id}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "full_name",
    header: t("table_header.full_name"),
    cell: ({ row }) => row.original.full_name || "N/A",
  },
  {
    accessorKey: "app_role",
    header: t("table_header.role"),
    cell: ({ row }) => (
      <Select
        defaultValue={row.original.app_role || "user"}
        onValueChange={(value) =>
          handleRoleChange(
            row.original.id!,
            value as Database["public"]["Enums"]["app_role"]
          )
        }
        disabled={isPending}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="user">User</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="developer">Developer</SelectItem>
        </SelectContent>
      </Select>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">{t("table_header.actions")}</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <ImpersonationDialog profile={row.original} />
      </div>
    ),
  },
];
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Hiper-Atomicidad (SRP)**: ((Implementada)) Este nuevo aparato aísla la lógica de configuración de la tabla, cumpliendo el Principio de Responsabilidad Única al más alto nivel.
 * 2. **Consistencia Arquitectónica**: ((Implementada)) Replica el patrón de élite de `CampaignsTableColumns`, mejorando la predictibilidad y consistencia de la base de código.
 * 3. **Componente Puro y Testeable**: ((Implementada)) Al ser una función pura, su lógica es extremadamente fácil de validar con pruebas unitarias.
 *
 * @subsection Melhorias Futuras
 * 1. **Cabeceras Ordenables**: ((Vigente)) La definición de las cabeceras (`header`) podría ser mejorada para renderizar un componente de botón que, al ser clickeado, invoque un callback `onSort` pasado a través de `GetUsersColumnsParams` para controlar el ordenamiento.
 *
 * =====================================================================
 */
// src/app/[locale]/dev-console/components/users-table-columns.tsx
