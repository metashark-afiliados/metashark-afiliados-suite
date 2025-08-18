// src/components/dashboard/Breadcrumbs.tsx
/**
 * @file src/components/dashboard/Breadcrumbs.tsx
 * @description Componente de UI atómico y de presentación puro para renderizar
 *              migas de pan de navegación.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: any; // any por compatibilidad con next-intl
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
      <ol className="flex items-center gap-1.5">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-foreground">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad (SRP)**: ((Implementada)) Componente puro que solo renderiza breadcrumbs.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática**: ((Vigente)) Se podría crear un hook `useBreadcrumbs` que genere automáticamente los `items` a partir del `pathname` actual.
 *
 * =====================================================================
 */
// src/components/dashboard/Breadcrumbs.tsx
