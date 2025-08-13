// src/components/ui/SmartLink.tsx
/**
 * @file src/components/ui/SmartLink.tsx
 * @description Componente de enlace inteligente y atómico. Ha sido nivelado
 *              a un estándar de élite para aceptar `React.ReactNode` en su prop
 *              `label`, permitiendo la composición de enlaces con contenido
 *              enriquecido (ej. iconos, texto formateado).
 * @author Raz Podestá
 * @version 2.1.0
 */
"use client";

import React from "react";

import { Link } from "@/lib/navigation";

export interface NavLinkItem {
  href: any; // Se mantiene 'any' por compatibilidad con next-intl
  label: React.ReactNode; // <-- MEJORA DE TIPO
  className?: string;
}

export const SmartLink: React.FC<NavLinkItem> = ({
  href,
  label,
  className,
  ...props
}) => {
  const finalClassName =
    className || "text-muted-foreground transition-colors hover:text-primary";

  const hrefString = typeof href === "string" ? href : "";
  const isExternalOrAnchor =
    hrefString.startsWith("#") ||
    hrefString.startsWith("http") ||
    hrefString.startsWith("mailto:") ||
    hrefString.startsWith("tel:");

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
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={finalClassName} {...props}>
      {label}
    </Link>
  );
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contrato de Tipo Flexible**: ((Implementada)) La prop `label` ahora es de tipo `React.ReactNode`, lo que permite al `SmartLink` renderizar no solo texto, sino también componentes de React. Esto resuelve el error `TS2322` y lo convierte en un componente de UI más versátil.
 *
 * @subsection Melhorias Futuras
 * 1. **Íconos Automáticos**: ((Vigente)) El componente podría renderizar automáticamente un icono de "enlace externo" si detecta un `href` externo.
 *
 * =====================================================================
 */
// src/components/ui/SmartLink.tsx
