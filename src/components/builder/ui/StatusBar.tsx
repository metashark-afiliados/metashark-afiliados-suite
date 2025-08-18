// src/components/builder/ui/StatusBar.tsx
/**
 * @file StatusBar.tsx
 * @description Componente de UI atómico para la barra de estado del constructor.
 *              Comunica el estado de guardado y la conectividad en tiempo real.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import { useEffect, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { Check, Cloud, CloudOff, Wifi, WifiOff } from "lucide-react";
import { shallow } from "zustand/shallow";

import { useBuilderStore } from "@/lib/builder/core/store";
import { cn } from "@/lib/utils";

export function StatusBar() {
  const t = useTranslations("StatusBar");
  const format = useFormatter();
  const [isOnline, setIsOnline] = useState(true);

  const { isDirty, lastSaved } = useBuilderStore(
    (state) => ({
      isDirty: state.isDirty,
      lastSaved: state.lastSaved,
    }),
    shallow
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Sincronizar estado inicial
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const getStatusText = () => {
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
 * 1. **Comunicación de Estado Clara**: ((Implementada)) Proporciona feedback visual instantáneo sobre el estado de guardado y la conectividad.
 * 2. **Reactividad en Tiempo Real**: ((Implementada)) Se suscribe a los eventos `online`/`offline` del navegador para una detección de conectividad en tiempo real.
 *
 * @subsection Melhorias Futuras
 * 1. **Cola de Sincronización Offline**: ((Vigente)) Cuando se detecta el estado `offline`, se podría deshabilitar el botón de guardado y encolar las acciones. Al volver a estar `online`, se podrían sincronizar automáticamente.
 *
 * =====================================================================
 */
// src/components/builder/ui/StatusBar.tsx
