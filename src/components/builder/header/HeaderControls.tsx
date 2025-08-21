// src/components/builder/header/HeaderControls.tsx
/**
 * @file HeaderControls.tsx
 * @description Aparato de UI atómico y puro. Renderiza la sección de
 *              controles central del `BuilderHeader`.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import { type DevicePreview } from "@/lib/builder/core/uiSlice";
import { DevicePreviewControls } from "../ui/DevicePreviewControls";
import { HistoryControls } from "../ui/HistoryControls";
import { Separator } from "@/components/ui/separator";

interface HeaderControlsProps {
  undo: () => void;
  redo: () => void;
  isUndoDisabled: boolean;
  isRedoDisabled: boolean;
  currentDevice: DevicePreview;
  setDevice: (device: DevicePreview) => void;
}

export function HeaderControls(props: HeaderControlsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <HistoryControls
        undo={props.undo}
        redo={props.redo}
        isUndoDisabled={props.isUndoDisabled}
        isRedoDisabled={props.isRedoDisabled}
      />
      <Separator orientation="vertical" className="h-6 mx-2" />
      <DevicePreviewControls
        currentDevice={props.currentDevice}
        setDevice={props.setDevice}
      />
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Hiper-Atomicidad (SRP)**: ((Implementada)) Componente de ensamblaje puro que agrupa otros átomos de UI.
 *
 * =====================================================================
 */
// src/components/builder/header/HeaderControls.tsx
