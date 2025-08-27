// src/components/shared/ResourcePageHeader.tsx
/**
 * @file ResourcePageHeader.tsx
 * @description Aparato de UI de layout, genérico y de élite. Ha sido
 *              refactorizado para incluir lógica de alineación vertical fina,
 *              asegurando una composición visualmente perfecta en layouts complejos.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { clientLogger } from "@/lib/logging";
import { cn } from "@/lib/utils";

const headerVariants = cva("flex gap-4 relative", {
  variants: {
    variant: {
      default: "flex-col md:flex-row justify-between",
      centered: "flex-col items-center text-center",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface ResourcePageHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof headerVariants> {
  titleSlot: React.ReactNode;
  actionsSlot: React.ReactNode;
  breadcrumbsSlot?: React.ReactNode;
}

export function ResourcePageHeader({
  className,
  variant,
  titleSlot,
  actionsSlot,
  breadcrumbsSlot,
  ...props
}: ResourcePageHeaderProps): React.ReactElement {
  const hasBreadcrumbs = !!breadcrumbsSlot;
  clientLogger.trace(
    "[ResourcePageHeader] Renderizando layout de encabezado genérico.",
    { variant, hasBreadcrumbs }
  );

  // --- INICIO DE MEJORA: LÓGICA DE ALINEACIÓN FINA ---
  // Se determina dinámicamente la clase de alineación. Si hay breadcrumbs,
  // se alinea al final (bottom) para que las acciones coincidan con el título.
  // Si no, se centra verticalmente.
  const alignmentClass =
    hasBreadcrumbs && variant === "default"
      ? "md:items-end"
      : "md:items-center";
  // --- FIN DE MEJORA: LÓGICA DE ALINEACIÓN FINA ---

  return (
    <div
      className={cn(headerVariants({ variant }), alignmentClass, className)}
      {...props}
    >
      <div>
        {breadcrumbsSlot && <div className="mb-2">{breadcrumbsSlot}</div>}
        {titleSlot}
      </div>
      <div>{actionsSlot}</div>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Alineación Vertical Fina (Layout Inteligente)**: ((Implementada)) El componente ahora detecta la presencia del `breadcrumbsSlot` y ajusta dinámicamente su alineación vertical (`items-end` vs `items-center`). Esto asegura que el `actionsSlot` siempre se alinee perfectamente con el `titleSlot`, logrando una composición visual de élite sin necesidad de lógica en el componente padre.
 * 2. **Composición de Layout Avanzada (Slot de Breadcrumbs)**: ((Implementada)) El componente soporta un `breadcrumbsSlot` opcional, haciéndolo extremadamente versátil.
 *
 * @subsection Melhorias Futuras
 * 1. **Slots Condicionales**: ((Vigente)) Para una DX aún mayor, los `div` contenedores de los slots podrían no renderizarse si el slot correspondiente no es proporcionado, resultando en un DOM ligeramente más limpio.
 *
 * =====================================================================
 */
// src/components/shared/ResourcePageHeader.tsx
