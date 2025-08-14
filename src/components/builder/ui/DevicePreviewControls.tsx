// src/components/builder/ui/DevicePreviewControls.tsx
/**
 * @file DevicePreviewControls.tsx
 * @description Componente de UI atómico y puro para seleccionar la vista previa del dispositivo.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import { useTranslations } from "next-intl";
import { Laptop, Smartphone, Tablet } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type DevicePreview } from "@/lib/builder/core/uiSlice";
import { cn } from "@/lib/utils";

export interface DevicePreviewControlsProps {
  currentDevice: DevicePreview;
  setDevice: (device: DevicePreview) => void;
}

const deviceOptions: {
  name: DevicePreview;
  icon: React.ElementType;
  tooltipKey: "desktop_tooltip" | "tablet_tooltip" | "mobile_tooltip";
}[] = [
  { name: "desktop", icon: Laptop, tooltipKey: "desktop_tooltip" },
  { name: "tablet", icon: Tablet, tooltipKey: "tablet_tooltip" },
  { name: "mobile", icon: Smartphone, tooltipKey: "mobile_tooltip" },
];

/**
 * @public
 * @component DevicePreviewControls
 * @description Renderiza un grupo de botones para cambiar la vista previa del dispositivo.
 * @param {DevicePreviewControlsProps} props - Las propiedades del componente.
 * @returns {React.ReactElement}
 */
export function DevicePreviewControls({
  currentDevice,
  setDevice,
}: DevicePreviewControlsProps): React.ReactElement {
  const t = useTranslations("components.builder.BuilderHeader.DevicePreview");

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 rounded-md bg-muted p-1">
        {deviceOptions.map(({ name, icon: Icon, tooltipKey }) => (
          <Tooltip key={name}>
            <TooltipTrigger asChild>
              <Button
                variant={currentDevice === name ? "background" : "ghost"}
                size="icon"
                onClick={() => setDevice(name)}
                className="h-7 w-7"
                aria-pressed={currentDevice === name}
                aria-label={t(tooltipKey)}
              >
                <Icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t(tooltipKey)}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Nuevo componente puro, controlado y reutilizable.
 * 2. **Full Internacionalización y Accesibilidad**: ((Implementada)) Todos los textos y `aria-labels` se consumen desde la capa de i18n. El estado `aria-pressed` mejora la accesibilidad.
 *
 * @subsection Melhorias Futuras
 * 1. **Transiciones Animadas**: ((Vigente)) Usar `framer-motion` para animar el indicador de estado activo al cambiar de dispositivo, proporcionando una transición más fluida.
 *
 * =====================================================================
 */
// src/components/builder/ui/DevicePreviewControls.tsx
