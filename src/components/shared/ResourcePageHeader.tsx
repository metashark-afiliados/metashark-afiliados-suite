// src/components/shared/ResourcePageHeader.tsx
/**
 * @file ResourcePageHeader.tsx
 * @description Aparato de UI de layout, genérico y de élite. Proporciona una
 *              estructura de encabezado de página consistente a través del patrón
 *              de "slots nombrados". Incluye lógica de alineación vertical fina
 *              para una composición visualmente perfecta en layouts complejos.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
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
  /**
   * Slot para el contenido principal del título (ej. `<h1>` y `<p>`).
   */
  titleSlot: React.ReactNode;
  /**
   * Slot para los controles de acción (ej. botones, búsqueda, filtros).
   */
  actionsSlot: React.ReactNode;
  /**
   * Slot opcional para las migas de pan (breadcrumbs) que se muestran sobre el título.
   */
  breadcrumbsSlot?: React.ReactNode;
}

/**
 * @public
 * @component ResourcePageHeader
 * @description Renderiza un layout de encabezado de página genérico y reutilizable.
 * @param {ResourcePageHeaderProps} props - Propiedades para configurar el encabezado.
 * @returns {React.ReactElement}
 */
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

  // Lógica de alineación fina: Si hay breadcrumbs, alinear las acciones con el
  // título principal (alineación inferior), de lo contrario, centrar verticalmente.
  const alignmentClass =
    hasBreadcrumbs && variant === "default"
      ? "md:items-end"
      : "md:items-center";

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
 * @subsection Melhorias Futuras
 * 1. **Slots Condicionales**: ((Vigente)) Para una DX de élite, los `div` contenedores de los slots podrían no renderizarse si el slot correspondiente no es proporcionado, resultando en un DOM ligeramente más limpio.
 * 2. **Variantes Adicionales**: ((Vigente)) Añadir nuevas variantes de layout, como `title-centered-actions-split`, para soportar diseños de encabezado más complejos de forma declarativa.
 * 3. **Propagación de Estado**: ((Vigente)) El componente podría aceptar props de estado (ej. `isHovering`) y pasarlas a los slots, permitiendo que el contenido de los slots reaccione a interacciones en el contenedor principal.
 * =====================================================================
 */
// src/components/shared/ResourcePageHeader.tsx
