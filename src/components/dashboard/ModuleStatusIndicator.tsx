// src/components/dashboard/ModuleStatusIndicator.tsx
/**
 * @file ModuleStatusIndicator.tsx
 * @description Aparato de UI atómico y soberano. Renderiza un indicador visual
 *              y un tooltip contextual para el estado de un módulo.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import { Check, Lock, Sparkles } from "lucide-react";
import React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type FeatureModule } from "@/lib/data/modules";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { cn } from "@/lib/utils";

interface ModuleStatusIndicatorProps {
  status: FeatureModule["status"];
}

const statusConfig = {
  active: {
    icon: Check,
    className: "bg-green-500",
    tooltipKey: "status_active_tooltip",
  },
  soon: {
    icon: Sparkles,
    className: "bg-yellow-500",
    tooltipKey: "status_soon_tooltip",
  },
  locked: {
    icon: Lock,
    className: "bg-muted-foreground",
    tooltipKey: "status_locked_tooltip",
  },
};

export function ModuleStatusIndicator({
  status,
}: ModuleStatusIndicatorProps): React.ReactElement {
  const t = useTypedTranslations("components.dashboard.ActionDock"); // Namespace a definir
  const config = statusConfig[status] || statusConfig.locked;
  const Icon = config.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          asChild
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div
            className={cn(
              "absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full",
              config.className
            )}
          >
            <Icon className="h-2.5 w-2.5 text-white" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t(config.tooltipKey as any)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
// src/components/dashboard/ModuleStatusIndicator.tsx
