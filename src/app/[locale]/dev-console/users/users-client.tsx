// src/app/[locale]/dev-console/users/users-client.tsx
/**
 * @file users-client.tsx
 * @description Orquestador de UI de élite. Ha sido refactorizado holísticamente
 *              para consumir el nuevo componente abstracto `PaginatedDataTable`,
 *              delegar toda su lógica al hook soberano `useUsersPage`, y para
 *              inyectar los textos de paginación requeridos, resolviendo el
 *              error de tipo TS2322.
 * @author Raz Podestá - MetaShark Tech
 * @version 9.0.0
 * @date 2025-08-31
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";

import { PaginatedDataTable } from "@/components/shared/PaginatedDataTable";
import { useUsersPage } from "@/lib/hooks/useUsersPage";
import { type UserProfilesWithEmail } from "@/lib/data/admin";
import { clientLogger } from "@/lib/logging";
import { getUsersColumns } from "../components/users-table-columns";
import { UsersPageHeader } from "./components/UsersPageHeader";
import { type PaginationTexts } from "@/components/shared/pagination-controls";

type ProfileRow = UserProfilesWithEmail;

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
  clientLogger.trace(
    "[UsersClient] Renderizando orquestador de UI puro y refactorizado."
  );

  const t = useTranslations("app.dev-console.UserManagementTable");
  const { isPending, searchTerm, setSearchTerm, handleRoleChange } =
    useUsersPage({ initialSearchQuery: searchQuery });

  const columns = React.useMemo(
    () => getUsersColumns({ t, isPending, handleRoleChange }),
    [t, isPending, handleRoleChange]
  );

  // --- INICIO DE REFACTORIZACIÓN (PROPAGACIÓN DE PROPS I18N) ---
  const paginationTexts: PaginationTexts = {
    previous: t("pagination.previousPageLabel"),
    next: t("pagination.nextPageLabel"),
    page: t("pagination.pageLabelTemplate"),
  };
  // --- FIN DE REFACTORIZACIÓN ---

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
      <PaginatedDataTable
        columns={columns}
        data={profiles}
        noResultsText={t("table_empty_state")}
        page={page}
        totalCount={totalCount}
        limit={limit}
        basePath="/dev-console/users"
        searchQuery={searchTerm}
        paginationTexts={paginationTexts} // <-- PROP INYECTADA
      />
    </div>
  );
}
// src/app/[locale]/dev-console/users/users-client.tsx
