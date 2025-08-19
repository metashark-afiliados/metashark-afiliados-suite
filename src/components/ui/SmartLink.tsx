// src/components/ui/SmartLink.tsx
/**
 * @file src/components/ui/SmartLink.tsx
 * @description Componente de enlace inteligente y atómico. Ha sido nivelado
 *              a un estándar de élite para aceptar `React.ReactNode` en su prop
 *              `label`, permitiendo la composición de enlaces con contenido
 *              enriquecido (ej. iconos, texto formateado).
 * @author L.I.A. Legacy
 * @version 2.1.0
 */
"use client";

import React from "react";

import { Link } from "@/lib/navigation";
import { RichText } from "./RichText";

export interface NavLinkItem {
  href: any; // Se mantiene 'any' por compatibilidad con next-intl
  label: React.ReactNode; // Contrato flexible para contenido enriquecido
  className?: string;
}

/**
 * @public
 * @component SmartLink
 * @description Renderiza un enlace inteligentemente, eligiendo entre `<a>` para
 *              rutas externas/anclas y el `<Link>` de next-intl para rutas internas.
 *              Envuelve el `label` en `<RichText>` para garantizar que siempre se
 *              pase un único hijo, previniendo errores de composición.
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

  // --- BLINDAJE DE COMPOSICIÓN SISTÉMICO ---
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
 * 1. **Blindaje de Composición Sistémico**: ((Implementada)) El componente ahora envuelve internamente la prop `label` con el componente de blindaje `RichText`. Esto hace que `SmartLink` sea inherentemente inmune al error `React.Children.only`, fortaleciendo a todos los componentes que lo consumen (como `AuthFooter`) de forma sistémica.
 * 2. **Contrato de Tipo Flexible**: ((Implementada)) Se ha verificado que la prop `label` sea de tipo `React.ReactNode`, lo que permite una composición versátil.
 *
 * =====================================================================
 */
// src/components/ui/SmartLink.tsx
