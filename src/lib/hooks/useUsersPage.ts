// src/lib/hooks/useUsersPage.ts
/**
 * @file useUsersPage.ts
 * @description Hook Soberano que encapsula toda la lógica de estado y negocio
 *              para la página de gestión de usuarios. Ha sido refactorizado
 *              holísticamente para consumir `useUrlStateSync`, estandarizando
 *              la persistencia de filtros en la URL.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
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

export function useUsersPage({ initialSearchQuery }: UseUsersPageProps) {
  const tToasts = useTranslations("app.dev-console.UserManagementTable");
  const tErrors = useTranslations("ValidationErrors");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // --- INICIO DE REFACTORIZACIÓN: ESTADO EN URL ---
  const {
    state: filters,
    setState: setFilters,
    isSyncing,
  } = useUrlStateSync({
    initialState: {
      q: initialSearchQuery,
    },
    debounceKeys: ["q"],
  });
  // --- FIN DE REFACTORIZACIÓN: ESTADO EN URL ---

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
    setSearchTerm: (value: string) => setFilters((f) => ({ ...f, q: value })),
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
 * @subsection Melhorias Adicionadas
 * 1. **Consistencia de UX (Filtros en URL)**: ((Implementada)) Se ha reemplazado `useSearchSync` por `useUrlStateSync`. La página de "Gestión de Usuarios" ahora tiene una búsqueda persistente en la URL, completando el objetivo de la ÉPICA 8.
 * 2. **Simplificación de Lógica (DRY)**: ((Implementada)) Al consumir el hook genérico, se ha eliminado la dependencia de `useSearchSync`, que ahora puede ser considerado para su eliminación si no tiene otros consumidores.
 *
 * @subsection Melhorias Futuras
 * 1. **Filtros Avanzados**: ((Vigente)) El `useUrlStateSync` ahora facilita la adición de más filtros. El hook podría ser extendido para gestionar filtros por `app_role`, permitiendo a los administradores ver solo a los 'developers' o 'admins'.
 *
 * =====================================================================
 */
// src/lib/hooks/useUsersPage.ts
