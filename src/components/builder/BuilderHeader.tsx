// src/components/builder/BuilderHeader.tsx
/**
 * @file BuilderHeader.tsx
 * @description Orquestador de UI para la cabecera del constructor. Ensambla
 *              los componentes atómicos (`HistoryControls`, `DevicePreviewControls`,
 *              `SaveStatusButton`), gestiona la lógica de "dirty state" y
 *              orquesta la acción de guardado.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import React, { useCallback, useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { shallow } from "zustand/shallow";

import { builder as builderActions } from "@/lib/actions";
import { useBuilderStore } from "@/lib/builder/core/store";
import { logger } from "@/lib/logging";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DevicePreviewControls } from "./ui/DevicePreviewControls";
import { HistoryControls } from "./ui/HistoryControls";
import { SaveStatusButton } from "./ui/SaveStatusButton";

/**
 * @public
 * @component BuilderHeader
 * @description Orquesta la barra de herramientas superior del constructor.
 * @returns {React.ReactElement}
 */
export function BuilderHeader(): React.ReactElement {
  const t = useTranslations("components.builder.BuilderHeader");
  const [isPending, startTransition] = useTransition();
  const [isDirty, setIsDirty] = useState(false);
  const [initialState, setInitialState] = useState<string | null>(null);

  const {
    campaignConfig,
    isSaving,
    setIsSaving,
    devicePreview,
    setDevicePreview,
    pastStates,
    futureStates,
    undo,
    redo,
  } = useBuilderStore(
    (state) => ({
      campaignConfig: state.campaignConfig,
      isSaving: state.isSaving,
      setIsSaving: state.setIsSaving,
      devicePreview: state.devicePreview,
      setDevicePreview: state.setDevicePreview,
      pastStates: state.pastStates,
      futureStates: state.futureStates,
      undo: state.undo,
      redo: state.redo,
    }),
    shallow
  );

  useEffect(() => {
    if (campaignConfig && initialState === null) {
      logger.trace(
        "[BuilderHeader] Inicializando estado de la campaña para detección de cambios."
      );
      setInitialState(JSON.stringify(campaignConfig));
    }
  }, [campaignConfig, initialState]);

  useEffect(() => {
    if (campaignConfig && initialState !== null) {
      const currentState = JSON.stringify(campaignConfig);
      setIsDirty(currentState !== initialState);
    }
  }, [campaignConfig, initialState]);

  const handleSave = useCallback(() => {
    if (!campaignConfig) {
      logger.warn(
        "[BuilderHeader] Intento de guardado sin configuración de campaña cargada."
      );
      toast.error(t("SaveButton.save_error_no_config"));
      return;
    }

    setIsSaving(true);
    logger.info("[BuilderHeader] Guardando cambios de la campaña.", {
      campaignId: campaignConfig.id,
    });

    startTransition(async () => {
      const result = await builderActions.updateCampaignContentAction(
        campaignConfig.id,
        campaignConfig
      );

      if (result.success) {
        toast.success(t("SaveButton.save_success"));
        logger.info("[BuilderHeader] Campaña guardada con éxito.");
        setInitialState(JSON.stringify(campaignConfig)); // Actualiza el estado base
      } else {
        toast.error(result.error || t("SaveButton.save_error_default"));
        logger.error("[BuilderHeader] Fallo al guardar la campaña.", {
          error: result.error,
        });
      }
      setIsSaving(false);
    });
  }, [campaignConfig, setIsSaving, t, initialState]);

  const isLoading = isSaving || isPending;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-6 relative">
      <div className="w-1/3">
        <Button variant="outline" asChild>
          <Link href="/dashboard" aria-label={t("back_to_dashboard_aria")}>
            {t("back_to_dashboard")}
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2">
        <HistoryControls
          undo={undo}
          redo={redo}
          isUndoDisabled={pastStates.length === 0}
          isRedoDisabled={futureStates.length === 0}
        />
        <Separator orientation="vertical" className="h-6 mx-2" />
        <DevicePreviewControls
          currentDevice={devicePreview}
          setDevice={setDevicePreview}
        />
      </div>

      <div className="flex w-1/3 items-center justify-end gap-2">
        <Button variant="ghost" aria-label={t("preview_aria")}>
          {t("preview_button")}
        </Button>
        <SaveStatusButton
          isDirty={isDirty}
          isLoading={isLoading}
          onSave={handleSave}
        />
      </div>
    </header>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Arquitectura de Orquestación Pura**: ((Implementada)) El componente ahora delega toda la renderización de la UI a sus aparatos atómicos hijos, actuando como un orquestador puro.
 * 2. **Gestión de Estado "Dirty"**: ((Implementada)) Se ha introducido una lógica robusta para detectar cambios (`isDirty`) comparando el estado actual con su estado inicial, proporcionando un feedback preciso al `SaveStatusButton`.
 * 3. **Full Observabilidad**: ((Implementada)) El proceso de guardado está completamente instrumentado con `logger`, proporcionando una visibilidad clara de las acciones del usuario.
 *
 * @subsection Melhorias Futuras
 * 1. **Atajos de Teclado**: ((Vigente)) Implementar listeners de eventos de teclado globales en este componente para capturar `Ctrl+S` (guardar), `Ctrl+Z` (deshacer), y `Ctrl+Y` (rehacer), invocando las acciones correspondientes.
 * 2. **Prevenir Cierre sin Guardar**: ((Vigente)) Utilizar el evento `beforeunload` para detectar si `isDirty` es `true` y mostrar un diálogo nativo al usuario para prevenir la pérdida de trabajo.
 *
 * =====================================================================
 */
// src/components/builder/BuilderHeader.tsx
