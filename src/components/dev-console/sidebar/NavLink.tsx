// src/components/dev-console/sidebar/NavLink.tsx
/**
 * @file NavLink.tsx
 * @description Componente de enlace de navegación atómico. Refactorizado para
 *              usar Inyección de Dependencias, haciéndolo robusto y testeable.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
import React from "react";
import { usePathname as useNextPathname } from "next/navigation";

import { Link, type Route } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: Route;
  label: string;
  icon: React.ElementType;
  /** @internal Para inyección en pruebas */
  _usePathname?: () => string;
}

export const NavLink: React.FC<NavLinkProps> = ({
  href,
  label,
  icon: Icon,
  _usePathname,
}) => {
  // --- INICIO DE INYECCIÓN DE DEPENDENCIA ---
  const pathname = _usePathname ? _usePathname() : useNextPathname();
  // --- FIN DE INYECCIÓN DE DEPENDENCIA ---

  const hrefAsString = typeof href === "string" ? href : (href.pathname ?? "/");
  const isActive = pathname === hrefAsString;

  return (
    <Link
      href={href as any}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        isActive && "bg-primary/10 text-primary font-semibold"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
};
