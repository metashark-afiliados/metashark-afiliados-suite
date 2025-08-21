// src/app/[locale]/dev-console/users/users-client.tsx
/**
 * @file users-client.tsx
 * @description Orquestador de UI de élite y de presentación puro. Consume el
 *              hook soberano `useUsersPage` y ensambla los componentes atómicos
 *              para construir la página de Gestión de Usuarios.
 * @author Raz Podestá
 * @version 5.0.0
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";

import { useUsersPage } from "@/lib/hooks/useUsersPage";
import { type UserProfilesWithEmail } from "@/lib/types/database/views";
import { DataTable } from "@/components/shared/data-table";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { SearchInput } from "@/components/ui/SearchInput";
import { getUsersColumns } from "./../components/users-table-columns";

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

  // La definición de columnas se obtiene de la factoría atómica.
  const columns = React.useMemo(
    () => getUsersColumns({ t, isPending, handleRoleChange }),
    [t, isPending, handleRoleChange]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("table_header.email")}</h1>
          <p className="text-muted-foreground">
            Manage all users on the platform.
          </p>
        </div>
        <SearchInput
          placeholder={t("search_placeholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          clearAriaLabel={t("clear_search_aria")}
          className="w-full sm:max-w-xs"
        />
      </div>
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
 * 1. **Hiper-Atomicidad (SRP)**: ((Implementada)) La lógica de definición de columnas ha sido abstraída a la factoría `getUsersColumns`, haciendo que este componente sea un orquestador de UI aún más puro y simple.
 * 2. **Consistencia Arquitectónica**: ((Implementada)) Al adoptar el patrón de factoría de columnas, este módulo ahora es arquitectónicamente consistente con el módulo de `Campaigns`, mejorando la predictibilidad de la base de código.
 *
 * @subsection Melhorias Futuras
 * 1. **Abstracción del Header**: ((Vigente)) El JSX para el header de la página (título, descripción y `SearchInput`) podría ser extraído a su propio componente atómico `UsersPageHeader.tsx` para una atomicidad máxima.
 *
 * =====================================================================
 */
// src/app/[locale]/dev-console/users/users-client.tsx
