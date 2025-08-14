// src/app/[locale]/dev-console/users/users-client.tsx
/**
 * @file users-client.tsx
 * @description Orquestador de Cliente de élite para la página de Gestión de Usuarios.
 *              Compone la UI, gestiona la interactividad (búsqueda, cambio de rol)
 *              y proporciona feedback al usuario a través de notificaciones.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import React, { useTransition } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { type ColumnDef } from "@tanstack/react-table";

import { admin as adminActions } from "@/lib/actions";
import { usePathname, useRouter } from "@/lib/navigation";
import { type Database } from "@/lib/types/database";
import { type UserProfilesWithEmail } from "@/lib/types/database/views";
import { DataTable } from "@/components/shared/data-table";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { SearchInput } from "@/components/ui/SearchInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImpersonationDialog } from "../components/ImpersonationDialog";

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
  const t = useTranslations("app.dev-console.UserManagementTable");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  const handleRoleChange = (
    userId: string,
    newRole: Database["public"]["Enums"]["app_role"]
  ) => {
    startTransition(async () => {
      const result = await adminActions.updateUserRoleAction(userId, newRole);
      if (result.success) {
        toast.success(t("role_update_success_toast"));
      } else {
        toast.error(result.error || t("role_update_error_toast"));
      }
    });
  };

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(window.location.search);
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}` as any);
  };

  const columns: ColumnDef<ProfileRow>[] = React.useMemo(
    () => [
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
        header: () => (
          <div className="text-right">{t("table_header.actions")}</div>
        ),
        cell: ({ row }) => (
          <div className="text-right">
            <ImpersonationDialog profile={row.original} />
          </div>
        ),
      },
    ],
    [isPending, t]
  );

  return (
    <div className="space-y-6">
      <SearchInput
        placeholder={t("search_placeholder")}
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        clearAriaLabel={t("clear_search_aria")}
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
        basePath={pathname}
        searchQuery={searchQuery}
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
 * 1. **Composición Atómica**: ((Implementada)) El orquestador ensambla los componentes de UI compartidos `DataTable`, `SearchInput` y `PaginationControls`.
 * 2. **Lógica de Mutación**: ((Implementada)) Maneja la acción de cambio de rol con feedback visual (`toast`) y estado de carga (`isPending`).
 * 3. **Gestión de Navegación**: ((Implementada)) Controla la paginación y la búsqueda actualizando los `searchParams` de la URL.
 *
 * @subsection Melhorias Futuras
 * 1. **Debounce en Búsqueda**: ((Vigente)) La función `handleSearch` es una candidata ideal para ser envuelta en un hook `useDebounce` para optimizar las peticiones de red.
 *
 * =====================================================================
 */
// src/app/[locale]/dev-console/users/users-client.tsx
