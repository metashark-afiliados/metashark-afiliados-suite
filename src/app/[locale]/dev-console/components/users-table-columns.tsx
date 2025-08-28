// src/app/[locale]/dev-console/components/users-table-columns.tsx
/**
 * @file users-table-columns.tsx
 * @description Aparato de configuración de UI atómico y puro. Su única
 *              responsabilidad es actuar como una factoría que construye y
 *              devuelve la definición de columnas para la tabla de usuarios.
 *              Ha sido refactorizado para consumir la SSoT de tipos canónica.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import React from "react";
import { type useTranslations } from "next-intl";
import { type ColumnDef } from "@tanstack/react-table";

// --- INICIO DE CORRECCIÓN ARQUITECTÓNICA (TS2322) ---
// Se importa el tipo desde la SSoT del módulo de datos de admin.
import { type UserProfilesWithEmail } from "@/lib/data/admin";
// --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---
import { type Database } from "@/lib/types/database";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImpersonationDialog } from "./ImpersonationDialog";

// --- INICIO DE CORRECCIÓN ARQUITECTÓNICA (TS2322) ---
// El tipo `UserProfilesWithEmail` importado ahora es el tipo `Row` directamente.
type ProfileRow = UserProfilesWithEmail;
// --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---
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
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de SSoT de Tipos**: ((Implementada)) Se ha corregido la importación de `UserProfilesWithEmail` para que apunte al manifiesto de tipos del módulo de datos de administración (`@/lib/data/admin`). Esto alinea el componente con la arquitectura de datos atomizada.
 * 2. **Resolución de Causa Raíz de Error de Tipo**: ((Implementada)) Al consumir el tipo correcto, la definición de `ProfileRow` se simplifica y se resuelve la inconsistencia que causaba el error de compilación `TS2322` en el componente `users-client.tsx`.
 *
 * @subsection Melhorias Futuras
 * 1. **Cabeceras Ordenables**: ((Vigente)) La definición de las cabeceras (`header`) podría ser mejorada para renderizar un componente de botón que, al ser clickeado, invoque un callback `onSort` pasado a través de `GetUsersColumnsParams` para controlar el ordenamiento.
 *
 * =====================================================================
 */
