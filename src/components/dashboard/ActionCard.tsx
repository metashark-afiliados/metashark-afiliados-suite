// src/components/dashboard/ActionCard.tsx
/**
 * @file src/components/dashboard/ActionCard.tsx
 * @description Aparato de UI atómico que representa una tarjeta de acción.
 *              Enriquecido para ensamblar el `ModuleStatusIndicator` y aceptar
 *              props de `Tooltip` para una flexibilidad de élite.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

import { Card, CardHeader } from "@/components/ui/card";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  type TooltipContentProps,
} from "@/components/ui/tooltip";
import { type FeatureModule } from "@/lib/data/modules";
import { clientLogger } from "@/lib/logger";
import { useRouter } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { ModuleStatusIndicator } from "./ModuleStatusIndicator";

interface ActionCardProps {
  module: FeatureModule;
  isPrimary?: boolean;
  tooltipSide?: TooltipContentProps["side"];
  tooltipAlign?: TooltipContentProps["align"];
}

export function ActionCard({
  module,
  isPrimary = false,
  tooltipSide,
  tooltipAlign,
}: ActionCardProps): React.ReactElement {
  const router = useRouter();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.7 : 1,
  };

  const handleCardClick = () => {
    if (module.status === "active" && module.href) {
      clientLogger.trace(
        `[ActionCard] Navegando para el módulo '${module.title}'`,
        {
          href: module.href,
        }
      );
      router.push(module.href as any);
    }
  };

  const isClickable = module.status === "active" && module.href;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      role="button"
      tabIndex={isClickable ? 0 : -1}
      aria-label={`Acceder a ${module.title}`}
      aria-disabled={!isClickable}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card
              className={cn(
                "group h-full transition-all duration-300 relative",
                isClickable &&
                  "cursor-grab active:cursor-grabbing hover:-translate-y-1 hover:shadow-2xl",
                isPrimary
                  ? "bg-primary/10 border-primary/40 hover:border-primary/80 hover:shadow-primary/20"
                  : "bg-card hover:border-primary/40 hover:shadow-primary/10",
                !isClickable && "opacity-60 cursor-not-allowed"
              )}
            >
              <ModuleStatusIndicator status={module.status} />
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      isPrimary ? "bg-primary/20" : "bg-muted"
                    )}
                  >
                    <DynamicIcon
                      name={module.icon}
                      className={cn(
                        "h-5 w-5",
                        isPrimary ? "text-primary" : "text-foreground"
                      )}
                    />
                  </div>
                  <h3 className="text-md font-semibold">{module.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground pt-2">
                  {module.description}
                </p>
              </CardHeader>
            </Card>
          </TooltipTrigger>
          {module.tooltip && (
            <TooltipContent side={tooltipSide} align={tooltipAlign}>
              <p>{module.tooltip}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
// src/components/dashboard/ActionCard.tsx
