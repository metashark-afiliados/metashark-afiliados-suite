/**
 * @file StatusBar.tsx
 * @description Componente de UI atómico para la barra de estado del builder.
 *              Ha sido refactorizado a un estándar de élite para consumir el estado
 *              del builder y su historial (`zundo`) a través de los hooks SSoT
 *              canónicos, resolviendo errores de importación y de tipo.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useEffect, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { Check, Cloud, Wifi, WifiOff } from "lucide-react";
import { shallow } from "zustand/shallow";
import { useStore } from "zustand";

import {
  useBuilderStore,
  useBuilderStoreApi,
} from "@/lib/hooks/use-builder-store";
import { clientLogger } from "@/lib/logging";
import { cn } from "@/lib/utils";

/**
 * @public
 * @component StatusBar
 * @description Renderiza una barra de estado que proporciona feedback visual
 *              en tiempo real sobre el estado de guardado de la campaña y la
 *              conectividad de red del usuario.
 * @returns {React.ReactElement} El componente de la barra de estado.
 */
export function StatusBar(): React.ReactElement {
  const t = useTranslations("components.builder.StatusBar");
  const format = useFormatter();

  // Se obtiene la API del store para acceder a los middlewares.
  const storeApi = useBuilderStoreApi();

  // Se suscribe reactivamente a los estados relevantes del slice principal.
  const { lastSaved, isOnline } = useBuilderStore(
    (state) => ({
      lastSaved: state.lastSaved,
      isOnline: state.isOnline,
    }),
    shallow
  );

  // Se suscribe reactivamente al estado del historial de 'zundo'.
  const { pastStates } = useStore(storeApi.temporal);
  const isDirty = pastStates.length > 0;

  clientLogger.trace("[StatusBar] Renderizando barra de estado.", {
    isDirty,
    isOnline,
    lastSaved,
  });

  const getStatusText = (): string => {
    if (isDirty) {
      return t("unsavedChanges");
    }
    if (lastSaved) {
      return t("lastSaved", {
        time: format.relativeTime(new Date(lastSaved)),
      });
    }
    return t("saved");
  };

  return (
    <div className="flex h-8 items-center justify-between border-t bg-card px-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        {isDirty ? (
          <Cloud className="h-4 w-4 text-yellow-500" />
        ) : (
          <Check className="h-4 w-4 text-green-500" />
        )}
        <span>{getStatusText()}</span>
      </div>
      <div className="flex items-center gap-2">
        {isOnline ? (
          <>
            <Wifi className="h-4 w-4 text-green-500" />
            <span>{t("online")}</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4 text-destructive" />
            <span className="text-destructive">{t("offline")}</span>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Módulo (TS2307)**: ((Implementada)) Se ha corregido la ruta de importación a la SSoT canónica (`@/lib/hooks/use-builder-store`), resolviendo el error de compilación.
 * 2. **Consumo de Estado de Élite**: ((Implementada)) El componente ahora utiliza el patrón correcto para consumir el estado del historial de `zundo` (`useBuilderStoreApi` + `useStore`), garantizando la robustez y el rendimiento.
 * 3. **Full Observabilidad**: ((Implementada)) Se ha añadido un `clientLogger.trace` que registra el estado completo en cada renderizado, mejorando la capacidad de depuración.
 *
 * @subsection Melhorias Futuras
 * 1. **Acción de Guardado Rápido**: ((Vigente)) El texto "Cambios sin guardar" podría convertirse en un botón sutil que, al ser clickeado, invoque la acción de guardado, proporcionando un atajo de UX.
 *
 * =====================================================================
 */
