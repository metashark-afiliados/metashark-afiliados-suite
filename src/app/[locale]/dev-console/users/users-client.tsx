// src/app/[locale]/dev-console/users/users-client.tsx
/**
 * @file users-client.tsx
 * @description Orquestador de UI de élite. Ha sido refactorizado para componer
 *              el nuevo aparato atómico `UsersPageHeader`, mejorando el SRP.
 * @author Raz Podestá
 * @version 6.0.0
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";

import { useUsersPage } from "@/lib/hooks/useUsersPage";
import { type UserProfilesWithEmail } from "@/lib/types/database/views";
import { DataTable } from "@/components/shared/data-table";
import { PaginationControls } from "@/components/shared/pagination-controls";
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
      <DataTable
        columns={columns}
        data={profiles}
        noResultsText={t("table_empty_state")}
      />
      <PaginationControls
        page={page}
        totalCount={totalCount}
        limit={limit}
        basePath="/dev-console/users"
        searchQuery={searchTerm}
        texts={{
          previousPageLabel: t("pagination.previousPageLabel"),
          nextPageLabel: t("pagination.nextPageLabel"),
          pageLabelTemplate: t("pagination.pageLabelTemplate"),
        }}
      />
    </div>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Hiper-Atomicidad (SRP)**: ((Implementada)) La lógica de presentación del encabezado ha sido abstraída, haciendo que este componente sea un orquestador de UI aún más puro.
 * 2. **Internacionalización Corregida**: ((Implementada)) El texto de descripción ahora se consume desde la capa de i18n, eliminando un texto codificado.
 *
 * @subsection Melhorias Futuras
 * 1. **Abstracción de `DataTable`**: ((Vigente)) La composición de `DataTable` y `PaginationControls` es un patrón repetido. Podría abstraerse a un componente `PaginatedDataTable` para una mayor reutilización.
 *
 * =====================================================================
 */
// src/app/[locale]/dev-console/users/users-client.tsx
