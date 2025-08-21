// src/components/ui/SlottableLink.tsx
import * as React from "react";

// --- INICIO DE CORRECCIÓN ARQUITECTÓNICA ---
// Se importa el Link de nuestra SSoT de navegación, no directamente de la librería.
import { Link, type Route } from "@/lib/navigation";
// --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---

/**
 * @public
 * @interface SlottableLinkProps
 * @description Contrato de props que expone la API del Link de nuestra aplicación.
 */
export interface SlottableLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: Route;
  children: React.ReactNode;
}

/**
 * @public
 * @component SlottableLink
 * @description Componente adaptador de élite. Reenvía `ref` y props al `Link`
 *              de nuestra SSoT de navegación, permitiendo una composición segura.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
export const SlottableLink = React.forwardRef<
  HTMLAnchorElement,
  SlottableLinkProps
>((props, ref) => {
  return <Link ref={ref} {...(props as any)} />;
});
SlottableLink.displayName = "SlottableLink";

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de TS2305**: ((Implementada)) La importación ahora apunta a `@/lib/navigation`, la SSoT correcta según el snapshot, resolviendo el error de módulo no encontrado.
 *
 * =====================================================================
 */
// src/components/ui/SlottableLink.tsx
