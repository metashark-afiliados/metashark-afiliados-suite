// src/app/[locale]/dev-console/users/users-client.tsx
/**
 * @file users-client.tsx
 * @description Orquestador de UI de élite. Ha sido refactorizado holísticamente
 *              para consumir el nuevo componente abstracto `PaginatedDataTable`,
 *              delegar toda su lógica al hook soberano `useUsersPage`, y consumir
 *              el contrato de datos corregido `UserProfilesWithEmail`, resolviendo
 *              así la cascada de errores de tipo.
 * @author Raz Podestá - MetaShark Tech
 * @version 8.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
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

type ProfileRow = UserProfilesWithEmail;

interface UsersClientProps {
  profiles: ProfileRow[];
  totalCount: number;
  page: number;
  limit: number;
  searchQuery: string;
}

/**
 * @public
 * @component UsersClient
 * @description Orquesta la UI para la página de gestión de usuarios en el Dev Console.
 * @param {UsersClientProps} props - Propiedades iniciales pasadas desde el cargador del servidor.
 * @returns {React.ReactElement}
 */
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
      />
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Acciones en Lote (Bulk Actions)**: ((Vigente)) El `PaginatedDataTable` podría ser mejorado para soportar la selección de filas (checkboxes). Este componente padre (`UsersClient`) podría entonces pasar un componente de "Barra de Acciones en Lote" que se mostraría cuando se seleccionan múltiples usuarios, permitiendo operaciones como "Cambiar Rol a Seleccionados" o "Eliminar Seleccionados".
 * 2. **Feedback de Sincronización de Búsqueda**: ((Vigente)) Al igual que en `campaigns-client`, el `SearchInput` en `UsersPageHeader` debería recibir el estado `isLoading={isSyncing}` desde el hook `useUsersPage` para proporcionar feedback visual al usuario mientras la URL se actualiza.
 *
 * =====================================================================
 */
// src/app/[locale]/dev-console/users/users-client.tsx
