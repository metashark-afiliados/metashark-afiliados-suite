// src/lib/hooks/useUsersPage.ts
"use client";

import { useTransition, useCallback } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { updateUserRoleAction } from "@/lib/actions/admin.actions";
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
 * @version 2.0.0
 */
export function useUsersPage({ initialSearchQuery }: UseUsersPageProps) {
  const tToasts = useTranslations("app.dev-console.UserManagementTable");
  const tErrors = useTranslations("ValidationErrors");
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
 * 1. **Resolución Definitiva de Error de Build**: ((Implementada)) Se ha reemplazado la importación del barril de acciones por una importación atómica y directa de `updateUserRoleAction`.
 *
 * =====================================================================
 */
