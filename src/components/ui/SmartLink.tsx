// src/components/ui/SmartLink.tsx
/**
 * @file src/components/ui/SmartLink.tsx
 * @description Componente de enlace inteligente y atómico. Ha sido nivelado a un
 *              estándar de élite al blindar su contenido con `RichText` internamente,
 *              haciéndolo inherentemente inmune al error `React.Children.only`.
 * @author L.I.A. Legacy
 * @version 2.1.0
 */
"use client";

import React from "react";

import { Link } from "@/lib/navigation";
import { RichText } from "./RichText";

export interface NavLinkItem {
  href: any;
  label: React.ReactNode;
  className?: string;
}

/**
 * @public
 * @component SmartLink
 * @description Renderiza un enlace inteligente que elige entre `<a>` para rutas
 *              externas y `<Link>` para internas. Envuelve el `label` en `<RichText>`
 *              para garantizar que siempre se pase un único hijo, previniendo
 *              errores de composición de forma sistémica.
 * @param {NavLinkItem} props - Propiedades del componente.
 * @returns {React.ReactElement}
 */
export const SmartLink: React.FC<NavLinkItem> = ({
  href,
  label,
  className,
  ...props
}) => {
  const finalClassName =
    className || "text-muted-foreground transition-colors hover:text-primary";

  const hrefString = typeof href === "string" ? href : href?.pathname || "";
  const isExternalOrAnchor =
    hrefString.startsWith("#") ||
    hrefString.startsWith("http") ||
    hrefString.startsWith("mailto:") ||
    hrefString.startsWith("tel:");

  const content = <RichText>{label}</RichText>;

  if (isExternalOrAnchor) {
    const isExternal = hrefString.startsWith("http");
    return (
      <a
        href={hrefString}
        className={finalClassName}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={finalClassName} {...props}>
      {content}
    </Link>
  );
};
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Blindaje Sistémico**: ((Implementada)) El componente ahora envuelve `label` con `RichText` internamente. Esto resuelve el error `React.Children.only` en su origen, fortaleciendo todos los componentes que consumen `SmartLink`.
 *
 * =====================================================================
 */
// src/components/ui/SmartLink.tsx
