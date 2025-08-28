// src/lib/hooks/useIconLibrary.ts
/**
 * @file useIconLibrary.ts
 * @description Hook Soberano que encapsula la lógica para gestionar la librería
 *              de iconos preferida del usuario. Este aparato lee y persiste la
 *              preferencia `activeIconLibraryId` en la base de datos a través
 *              de `updateProfilePreferencesAction`, permitiendo a los usuarios
 *              personalizar su experiencia de UI.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */

"use client";

import { useCallback, useMemo, useTransition } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import {
  ICON_LIBRARIES_MANIFEST,
  type IconLibraryDefinition,
} from "@/config/icon-libraries.config";
import { updateProfilePreferencesAction } from "@/lib/actions/profiles.actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { clientLogger } from "@/lib/logging";
import { isActionError } from "@/lib/validators";

/**
 * @public
 * @interface UseUserIconLibraryPreferencesReturn
 * @description Define el contrato de los valores retornados por el hook `useUserIconLibraryPreferences`.
 */
export interface UseUserIconLibraryPreferencesReturn {
  /**
   * El ID de la librería de iconos activa actualmente.
   */
  activeIconLibraryId: IconLibraryDefinition["id"];
  /**
   * Función para actualizar la librería de iconos activa del usuario.
   * Dispara una `Server Action` para persistir la preferencia.
   */
  setActiveIconLibraryId: (libraryId: IconLibraryDefinition["id"]) => void;
  /**
   * Indica si hay una operación de guardado de preferencias en curso.
   */
  isPending: boolean;
}

/**
 * @public
 * @function useUserIconLibraryPreferences
 * @description Hook soberano para gestionar la preferencia de librería de iconos del usuario.
 *              Lee el `activeIconLibraryId` del perfil del usuario y proporciona una
 *              función para actualizarlo y persistirlo en la base de datos.
 * @returns {UseUserIconLibraryPreferencesReturn} Un objeto con la librería de iconos activa y el manejador para actualizarla.
 */
export function useUserIconLibraryPreferences(): UseUserIconLibraryPreferencesReturn {
  const t = useTranslations("DashboardSidebar"); // Usar un namespace general del dashboard para toasts
  const tErrors = useTranslations("shared.ValidationErrors");
  const { profile } = useDashboard();
  const [isPending, startTransition] = useTransition();

  // Extraer la preferencia actual del perfil o usar un valor por defecto
  const currentActiveLibraryId: IconLibraryDefinition["id"] = useMemo(() => {
    const defaultLibrary = "lucide";
    const storedId = profile?.dashboard_layout?.activeIconLibraryId;
    if (
      storedId &&
      ICON_LIBRARIES_MANIFEST.some((lib) => lib.id === storedId)
    ) {
      clientLogger.trace(
        `[useUserIconLibraryPreferences] Librería de iconos cargada desde el perfil: ${storedId}`
      );
      return storedId;
    }
    clientLogger.info(
      `[useUserIconLibraryPreferences] Usando librería de iconos por defecto: ${defaultLibrary}`
    );
    return defaultLibrary;
  }, [profile?.dashboard_layout?.activeIconLibraryId]);

  const setActiveIconLibraryId = useCallback(
    (libraryId: IconLibraryDefinition["id"]) => {
      clientLogger.info(
        `[useUserIconLibraryPreferences] Iniciando actualización de librería de iconos a: ${libraryId}`
      );
      startTransition(async () => {
        const result = await updateProfilePreferencesAction({
          isSidebarCollapsed:
            profile?.dashboard_layout?.isSidebarCollapsed ?? false, // Mantener otras preferencias
          activeIconLibraryId: libraryId,
        });

        if (result.success) {
          toast.success(t("toasts.icon_library_update_success"));
          clientLogger.info(
            `[useUserIconLibraryPreferences] Librería de iconos actualizada con éxito en DB: ${libraryId}`
          );
        } else {
          const errorMessage = isActionError(result)
            ? tErrors(result.error as any, { defaultValue: result.error })
            : tErrors("error_update_failed");
          toast.error(errorMessage);
          clientLogger.error(
            `[useUserIconLibraryPreferences] Fallo al actualizar librería de iconos en DB: ${libraryId}`,
            { error: result.error }
          );
        }
      });
    },
    [profile?.dashboard_layout?.isSidebarCollapsed, t, tErrors]
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
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Creación de Hook Soberano de Preferencias**: ((Implementada)) Este nuevo aparato encapsula la lógica para leer y escribir la preferencia de librería de iconos del usuario, cumpliendo con el SRP y la "Filosofía LEGO".
 * 2. **Persistencia en la Base de Datos**: ((Implementada)) El hook se integra con `updateProfilePreferencesAction` para guardar la preferencia en `profiles.dashboard_layout`, asegurando que la elección del usuario persista entre sesiones y dispositivos.
 * 3. **Valores por Defecto Robustos**: ((Implementada)) Si no se encuentra una preferencia en el perfil o si la ID almacenada no es válida, el hook utiliza `"lucide"` como fallback, garantizando un estado inicial consistente.
 * 4. **Feedback de Usuario Completo**: ((Implementada)) Proporciona `toast` de éxito y error con mensajes internacionalizados (utilizando `isActionError` para errores de `Server Action`).
 * 5. **Tipado Estricto y Seguro**: ((Implementada)) Utiliza `IconLibraryDefinition["id"]` para el tipo de la librería activa, garantizando la seguridad de tipos en todo el flujo.
 * 6. **Full Observabilidad**: ((Implementada)) Incluye `clientLogger` para rastrear la carga de preferencias y las operaciones de guardado/error, mejorando la depuración y la visibilidad.
 * 7. **Gestión de `isPending`**: ((Implementada)) Devuelve el estado `isPending` de `useTransition` para que la UI pueda deshabilitar los controles durante el guardado.
 *
 * @subsection Melhorias Futuras
 * 1. **Optimización con `React.memo` para `setActiveIconLibraryId`**: ((Vigente)) Aunque `useCallback` ya memoiza la función, si se pasa a muchos hijos, se podría envolver el retorno en un `React.memo` para garantizar que la referencia a `setActiveIconLibraryId` no cambie innecesariamente.
 * 2. **Sincronización Inmediata con UI Store**: ((Vigente)) Si se introduce un store global para las preferencias de UI del usuario (ej. `useUserPreferencesStore`), `setActiveIconLibraryId` debería también actualizar este store para una reactividad instantánea en la UI sin esperar el `router.refresh()`.
 * 3. **Contexto Específico para Preferencias**: ((Vigente)) Si se van a gestionar muchas más preferencias de usuario, se podría crear un `UserPreferencesContext` que este hook proveería, encapsulando aún más el ámbito.
 *
 * =====================================================================
 */
// src/lib/hooks/useIconLibrary.ts
