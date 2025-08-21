// src/lib/hooks/useUsersPage.ts
/**
 * @file useUsersPage.ts
 * @description Hook Soberano que encapsula toda la lógica de estado y negocio
 *              para la página de gestión de usuarios en el Dev Console.
 * @author Raz Podestá
 * @version 3.0.0
 */
"use client";

import { useTransition, useCallback } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { updateUserRoleAction } from "@/lib/actions/admin.actions";
import { useSearchSync } from "@/lib/hooks/ui/useSearchSync";
import { clientLogger } from "@/lib/logging";
import { type Database } from "@/lib/types/database";

interface UseUsersPageProps {
  initialSearchQuery: string;
}

/**
 * @public
 * @function useUsersPage
 * @description Orquesta la lógica de estado y las acciones para la página de gestión de usuarios.
 *              Consume el hook `useSearchSync` para la búsqueda y encapsula la llamada a la
 *              Server Action `updateUserRoleAction`, proporcionando feedback al usuario.
 * @param {UseUsersPageProps} props - Las propiedades de inicialización del hook.
 * @returns {{
 *   searchTerm: string;
 *   setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
 *   isPending: boolean;
 *   handleRoleChange: (userId: string, newRole: Database["public"]["Enums"]["app_role"]) => void;
 * }} Un objeto con el estado y los manejadores para ser consumidos por la UI.
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
 * 1. **Resolución de Error de Build**: ((Implementada)) Se ha reemplazado la importación masiva (`admin as adminActions`) por una importación atómica y directa de `updateUserRoleAction`. Esto resuelve la vulnerabilidad al error de build "server-only".
 * 2. **Documentación TSDoc de Élite**: ((Implementada)) Se ha añadido documentación TSDoc verbosa, detallando el propósito y el contrato de API del hook.
 *
 * @subsection Melhorias Futuras
 * 1. **Actualización Optimista de UI**: ((Vigente)) Para una UX instantánea, el hook podría gestionar un estado local de los usuarios y aplicar el cambio de rol de forma optimista, revirtiendo solo si la Server Action falla.
 *
 * =====================================================================
 */
