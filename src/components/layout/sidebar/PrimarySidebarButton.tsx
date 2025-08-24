// src/components/layout/sidebar/PrimarySidebarButton.tsx
/**
 * @file PrimarySidebarButton.tsx
 * @description Aparato de UI atómico y puro para los botones de la barra de
 *              navegación primaria.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import { cva, type VariantProps } from "class-variance-authority";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "flex flex-col items-center justify-center h-16 w-full gap-1 rounded-lg text-muted-foreground transition-colors hover:text-foreground",
  {
    variants: {
      variant: {
        default: "hover:bg-muted",
        active: "bg-primary/10 text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface PrimarySidebarButtonProps
  extends VariantProps<typeof buttonVariants> {
  href: any;
  label: string;
  icon: React.ElementType;
}

export function PrimarySidebarButton({
  href,
  label,
  icon: Icon,
  variant,
}: PrimarySidebarButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={href} className={cn(buttonVariants({ variant }))}>
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
