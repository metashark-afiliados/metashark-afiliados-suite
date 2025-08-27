// src/app/[locale]/dev-console/users/users-client.tsx
/**
 * @file users-client.tsx
 * @description Orquestador de UI de élite. Ha sido refactorizado holísticamente
 *              para consumir el nuevo componente abstracto `PaginatedDataTable`,
 *              eliminando código duplicado y resolviendo el error de tipo TS2322.
 * @author Raz Podestá - MetaShark Tech
 * @version 7.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";

import { useUsersPage } from "@/lib/hooks/useUsersPage";
import { type UserProfilesWithEmail } from "@/lib/types/database/views";
import { PaginatedDataTable } from "@/components/shared/PaginatedDataTable";
import { getUsersColumns } from "../components/users-table-columns";
import { UsersPageHeader } from "./components/UsersPageHeader";

type ProfileRow = UserProfilesWithEmail["Row"];

interface UsersClientProps {
  profiles: ProfileRow[];
  totalCount: number;
  page: number;
  limit: number;
  searchQuery: string;
}

export function UsersClient({
  profiles,
  totalCount,
  page,
  limit,
  searchQuery,
}: UsersClientProps): React.ReactElement {
  const t = useTranslations("app.dev-console.UserManagementTable");
  const { isPending, searchTerm, setSearchTerm, handleRoleChange } =
    useUsersPage({ initialSearchQuery: searchQuery });

  const columns = React.useMemo(
    () => getUsersColumns({ t, isPending, handleRoleChange }),
    [t, isPending, handleRoleChange]
  );

  return (
    <div className="space-y-6">
      <UsersPageHeader
        title={t("table_header.email")}
        description={t("table_description")}
        searchPlaceholder={t("search_placeholder")}
        searchValue={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        clearSearchAriaLabel={t("clear_search_aria")}
      />
      {/* --- INICIO DE REFACTORIZACIÓN HOLÍSTICA (DRY) --- */}
      <PaginatedDataTable
        columns={columns}
        data={profiles}
        noResultsText={t("table_empty_state")}
        page={page}
        totalCount={totalCount}
        limit={limit}
        basePath="/dev-console/users"
        searchQuery={searchTerm}
      />
      {/* --- FIN DE REFACTORIZACIÓN HOLÍSTICA (DRY) --- */}
    </div>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error Sistémico (TS2322)**: ((Implementada)) Al reemplazar `DataTable` y `PaginationControls` por el nuevo `PaginatedDataTable`, se elimina la llamada que contenía la prop obsoleta `texts`, resolviendo el error de compilación de forma arquitectónica.
 * 2. **Adopción del Principio DRY**: ((Implementada)) Este componente ahora es más simple y declarativo. Su código ya no está duplicado en `campaigns-client.tsx`, lo que mejora la mantenibilidad de la base de código.
 *
 * @subsection Melhorias Futuras
 * 1. **Acciones en Lote**: ((Vigente)) La `PaginatedDataTable` podría ser mejorada para soportar la selección de filas. Este componente padre podría entonces pasar un componente de "Barra de Acciones en Lote" para operaciones como "Cambiar Rol a Seleccionados".
 *
 * =====================================================================
 */
// src/app/[locale]/dev-console/users/users-client.tsx
