// src/lib/hooks/useUsersPage.ts
/**
 * @file useUsersPage.ts
 * @description Hook Soberano que encapsula toda la lógica de estado y de negocio
 *              para la página de Gestión de Usuarios del Dev Console. Orquesta
 *              hooks atómicos y gestiona las mutaciones de datos.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import { useTransition, useCallback } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { admin as adminActions } from "@/lib/actions";
import { useSearchSync } from "@/lib/hooks/ui/useSearchSync";
import { clientLogger } from "@/lib/logging";
import { useRouter } from "@/lib/navigation";
import { type Database } from "@/lib/types/database";

interface UseUsersPageProps {
  initialSearchQuery: string;
}

/**
 * @public
 * @function useUsersPage
 * @description Orquesta la lógica de estado y las acciones para la página de gestión de usuarios.
 * @param {UseUsersPageProps} props - Las propiedades de inicialización del hook.
 * @returns Un objeto con el estado y los manejadores para ser consumidos por la UI.
 */
export function useUsersPage({ initialSearchQuery }: UseUsersPageProps) {
  const tToasts = useTranslations(
    "app.dev-console.AdminDashboard.admin_toasts"
  );
  const tErrors = useTranslations(
    "app.dev-console.AdminDashboard.admin_errors"
  );
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { searchTerm, setSearchTerm } = useSearchSync({
    initialQuery: initialSearchQuery,
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
        const result = await adminActions.updateUserRoleAction(userId, newRole);

        if (result.success) {
          toast.success(tToasts("user_role_updated_success"));
          router.refresh(); // SSoT es el servidor, refrescamos para obtener el estado real.
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
    searchTerm,
    setSearchTerm,
    isPending,
    handleRoleChange,
  };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (Lógica)**: ((Implementada)) Este hook aísla completamente la lógica de la página de gestión de usuarios, convirtiendo al componente `users-client.tsx` en un presentador puro.
 * 2. **Composición de Hooks**: ((Implementada)) Demuestra la "Filosofía LEGO" al componer y orquestar el hook atómico `useSearchSync`.
 * 3. **Gestión de Estado Moderna**: ((Implementada)) Utiliza `useTransition` para gestionar el estado de carga de las Server Actions, previniendo que la UI se bloquee.
 *
 * @subsection Melhorias Futuras
 * 1. **UI Optimista**: ((Vigente)) Para una UX instantánea, se podría integrar `useOptimistic` para reflejar el cambio de rol en la UI inmediatamente, antes de que la Server Action complete.
 * 2. **Gestión de Filtros Avanzados**: ((Vigente)) El hook podría ser extendido para gestionar filtros adicionales (ej. filtrar por rol) y sincronizarlos con la URL, similar a `useCampaignsPage`.
 *
 * =====================================================================
 */
// src/lib/hooks/useUsersPage.ts
