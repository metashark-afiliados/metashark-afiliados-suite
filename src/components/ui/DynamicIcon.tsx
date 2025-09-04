// src/components/ui/DynamicIcon.tsx
/**
 * @file src/components/ui/DynamicIcon.tsx
 * @description Componente de UI atómico y de alto rendimiento para renderizado
 *              isomorfo de iconos. Utiliza `next/dynamic` para la carga diferida
 *              (lazy loading), garantizando un rendimiento óptimo tanto en el
 *              servidor como en el cliente.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-30
 */
"use client";

import { HelpCircle, icons, Loader2, type LucideProps } from "lucide-react";
import dynamic from "next/dynamic";
import React, { memo } from "react";

import { type LucideIconName } from "@/config/lucide-icon-names";
import { clientLogger } from "@/lib/logger";
import { cn } from "@/lib/utils";

interface DynamicIconProps extends LucideProps {
  name: string;
}

const fallbackIcon = (className?: string) => (
  <HelpCircle
    className={cn("h-4 w-4 text-muted-foreground", className)}
    aria-label="Icono no disponible"
  />
);

/**
 * @public
 * @component DynamicIcon
 * @description Renderiza un icono de forma dinámica basándose en el nombre.
 * @param {DynamicIconProps} props - Las propiedades para configurar el icono.
 * @returns {React.ReactElement | null}
 */
export const DynamicIcon = memo(
  ({ name, className, ...props }: DynamicIconProps) => {
    if (!name || !(name in icons)) {
      clientLogger.warn(
        `[DynamicIcon] Ícono '${name}' no encontrado en la librería 'lucide-react'.`
      );
      return fallbackIcon(className);
    }

    const LucideIcon = dynamic(
      async () => {
        const { [name as LucideIconName]: IconComponent } = await import(
          "lucide-react"
        );
        if (!IconComponent) {
          clientLogger.warn(
            `[DynamicIcon] Componente de ícono para '${name}' no se pudo cargar.`
          );
          return () => fallbackIcon(className);
        }
        return IconComponent;
      },
      {
        loading: () => (
          <Loader2 className={cn("h-4 w-4 animate-spin", className)} />
        ),
        ssr: false, // El icono real solo se renderiza en el cliente
      }
    );

    return <LucideIcon className={className} {...props} />;
  }
);

DynamicIcon.displayName = "DynamicIcon";

// src/components/ui/DynamicIcon.tsx
