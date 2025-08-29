// src/lib/hooks/useIconLibrary.ts
/**
 * @file useIconLibrary.ts
 * @description Hook Soberano que encapsula la lógica para gestionar la librería
 *              de iconos preferida del usuario. Ha sido refactorizado holísticamente
 *              para leer las preferencias existentes del perfil y fusionarlas con
 *              la nueva selección antes de persistir, resolviendo un error de tipo TS2353.
 *              También consume el namespace de i18n correcto para el feedback de UI.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useCallback, useMemo, useTransition } from "react";
import toast from "react-hot-toast";
import { type z } from "zod";

import {
  ICON_LIBRARIES_MANIFEST,
  type IconLibraryDefinition,
} from "@/config/icon-libraries.config";
import { updateProfilePreferencesAction } from "@/lib/actions/profiles.actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logging";
import { isActionError } from "@/lib/validators";
import { type DashboardLayoutPreferencesSchema } from "@/lib/validators/schemas";

const isValidIconLibraryId = (id: any): id is IconLibraryDefinition["id"] => {
  return ICON_LIBRARIES_MANIFEST.some((lib) => lib.id === id);
};

export interface UseUserIconLibraryPreferencesReturn {
  activeIconLibraryId: IconLibraryDefinition["id"];
  setActiveIconLibraryId: (libraryId: IconLibraryDefinition["id"]) => void;
  isPending: boolean;
}

export function useUserIconLibraryPreferences(): UseUserIconLibraryPreferencesReturn {
  const tErrors = useTypedTranslations("shared.ValidationErrors");
  const { profile } = useDashboard();
  const [isPending, startTransition] = useTransition();

  const currentActiveLibraryId = useMemo(() => {
    const defaultLibrary: IconLibraryDefinition["id"] = "lucide";
    const prefs = profile?.dashboard_layout as
      | z.infer<typeof DashboardLayoutPreferencesSchema>
      | undefined;
    const storedId = prefs?.activeIconLibraryId;

    if (isValidIconLibraryId(storedId)) {
      return storedId;
    }
    return defaultLibrary;
  }, [profile?.dashboard_layout]);

  const setActiveIconLibraryId = useCallback(
    (libraryId: IconLibraryDefinition["id"]) => {
      clientLogger.info(
        `[useUserIconLibraryPreferences] Iniciando actualización de librería de iconos a: ${libraryId}`
      );
      startTransition(async () => {
        const currentPrefs = (profile?.dashboard_layout || {
          isSidebarCollapsed: false,
          activeIconLibraryId: "lucide",
        }) as z.infer<typeof DashboardLayoutPreferencesSchema>;

        const result = await updateProfilePreferencesAction({
          ...currentPrefs,
          activeIconLibraryId: libraryId,
        });

        if (result.success) {
          toast.success(tErrors("profile.icon_library_update_success" as any));
        } else if (isActionError(result)) {
          const errorMessage = tErrors(result.error as any, {
            defaultValue: result.error,
          });
          toast.error(errorMessage);
        }
      });
    },
    [profile?.dashboard_layout, tErrors]
  );

  return {
    activeIconLibraryId: currentActiveLibraryId,
    setActiveIconLibraryId,
    isPending,
  };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Sincronización con UI Store**: Para una reactividad instantánea, `setActiveIconLibraryId` podría actualizar un store de Zustand (`useDashboardUIStore`) además de invocar la Server Action, reflejando el cambio en la UI sin esperar la revalidación del servidor.
 * 2. **Contexto de Preferencias Dedicado**: Si se añaden más preferencias, la lógica de este hook podría ser elevada a un `UserPreferencesProvider` para centralizar la gestión de todas las personalizaciones del usuario.
 * 3. **Feedback de Carga Específico**: El estado `isPending` es global. Se podría refinar para que el componente de UI que invoca el cambio muestre un estado de carga localizado.
 * 4. **Creación de `ProfileErrors.schema.ts`**: Para una soberanía de i18n completa, la clave `profile.icon_library_update_success` debe ser formalizada en su propio schema atómico `ProfileErrors.schema.ts` y ensamblada en `ValidationErrors.schema.ts`.
 * =====================================================================
 */
