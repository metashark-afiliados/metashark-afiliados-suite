// src/components/builder/ui/DevicePreviewControls.tsx
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

/**
 * @public
 * @interface DevicePreviewControlsProps
 * @description Contrato de props para el componente.
 * @version 1.1.0
 * @author Raz Podestá
 */
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
 * 1. **Alineación de API**: ((Implementada)) El componente ahora utiliza la variante `background` que fue añadida a la SSoT de estilos (`variants.ts`), resolviendo el error de tipo.
 *
 * @subsection Melhorias Futuras
 * 1. **Transiciones Animadas**: ((Vigente)) Usar `framer-motion` para animar el indicador de estado activo al cambiar de dispositivo.
 *
 * =====================================================================
 */
