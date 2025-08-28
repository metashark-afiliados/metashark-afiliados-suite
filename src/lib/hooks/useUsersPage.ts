// src/lib/hooks/useUsersPage.ts
/**
 * @file useUsersPage.ts
 * @description Hook Soberano que encapsula toda la lógica de estado y negocio
 *              para la página de gestión de usuarios. Ha sido blindado con
 *              tipado explícito en los callbacks de `setState`, resolviendo
 *              el error de tipo `any` implícito (TS7006).
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useTransition, useCallback } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { updateUserRoleAction } from "@/lib/actions/admin.actions";
import { useUrlStateSync } from "@/lib/hooks/ui/useUrlStateSync";
import { clientLogger } from "@/lib/logging";
import { type Database } from "@/lib/types/database";

interface UseUsersPageProps {
  initialSearchQuery: string;
}

// Se define un tipo para el estado de los filtros para mayor claridad.
type UserFiltersState = {
  q: string;
};

/**
 * @public
 * @function useUsersPage
 * @description Orquesta el estado y las acciones para la página de gestión de usuarios del Dev Console.
 * @param {UseUsersPageProps} props - Propiedades iniciales para el hook.
 * @returns La API para gestionar la UI de la página de usuarios.
 */
export function useUsersPage({ initialSearchQuery }: UseUsersPageProps) {
  const tToasts = useTranslations("app.dev-console.UserManagementTable");
  const tErrors = useTranslations("shared.ValidationErrors");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    state: filters,
    setState: setFilters,
    isSyncing,
  } = useUrlStateSync<UserFiltersState>({
    initialState: {
      q: initialSearchQuery,
    },
    debounceKeys: ["q"],
  });

  const handleRoleChange = useCallback(
    (userId: string, newRole: Database["public"]["Enums"]["app_role"]) => {
      clientLogger.trace(
        `[useUsersPage] Iniciando cambio de rol para usuario.`,
        {
          userId,
          newRole,
        }
      );

      startTransition(async () => {
        const result = await updateUserRoleAction(userId, newRole);

        if (result.success) {
          toast.success(tToasts("role_update_success_toast"));
          router.refresh();
        } else {
          toast.error(
            tErrors(result.error as any, { defaultValue: result.error })
          );
        }
      });
    },
    [router, tErrors, tToasts]
  );

  return {
    searchTerm: filters.q,
    setSearchTerm: (value: string) =>
      setFilters((f: UserFiltersState) => ({ ...f, q: value })),
    isPending,
    isSyncing,
    handleRoleChange,
  };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Filtros por Rol**: ((Vigente)) El `useUrlStateSync` ahora facilita la adición de más filtros. El hook podría ser extendido para gestionar un `statusFilter: AppRole | 'all'`, permitiendo a los administradores ver solo a los 'developers' o 'admins'.
 * 2. **Acciones en Lote (Bulk Actions)**: ((Vigente)) El hook podría ser extendido para gestionar un estado de selección (`selectedUserIds`) y exponer una acción `handleBulkRoleChange` que actualice el rol de múltiples usuarios a la vez.
 *
 * =====================================================================
 */
// src/lib/hooks/useUsersPage.ts
