// src/components/ui/SmartLink.tsx
/**
 * @file src/components/ui/SmartLink.tsx
 * @description Componente de enlace inteligente y atómico. Ha sido nivelado a un
 *              estándar de élite para aceptar un `onClick` opcional y propagarlo
 *              al elemento subyacente, resolviendo un error de tipo `TS2322`.
 * @author L.I.A. Legacy
 * @version 2.2.0
 */
"use client";

import React from "react";

import { Link } from "@/lib/navigation";
import { RichText } from "./RichText";

export interface NavLinkItem {
  href: any;
  label: React.ReactNode;
  className?: string;
  onClick?: () => void; // <-- CONTRATO DE API ACTUALIZADO
}

/**
 * @public
 * @component SmartLink
 * @description Renderiza un enlace inteligente que elige entre `<a>` y `<Link>`.
 *              Ahora acepta y propaga un callback `onClick`.
 * @param {NavLinkItem} props - Propiedades del componente.
 * @returns {React.ReactElement}
 */
export const SmartLink: React.FC<NavLinkItem> = ({
  href,
  label,
  className,
  onClick, 
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
        onClick={onClick} // <-- ONCLICK PROPAGADO
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={finalClassName} onClick={onClick} {...props}>
      {" "}
      {/* <-- ONCLICK PROPAGADO */}
      {content}
    </Link>
  );
};
// src/components/ui/SmartLink.tsx
