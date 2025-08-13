// src/lib/context/BreadcrumbsContext.tsx
/**
 * @file src/lib/context/BreadcrumbsContext.tsx
 * @description Proveedor de contexto de React para pasar datos de resolución de
 *              nombres (ej. nombre de sitio por ID) desde Server Components
 *              (como layouts de página) a Client Components (como el futuro
 *              componente de breadcrumbs). Este patrón desacopla la obtención
 *              de datos del renderizado de la UI de navegación.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import { createContext, type ReactNode, useContext } from "react";

/**
 * @public
 * @typedef {Record<string, string>} NameMap
 * @description Un mapa simple para asociar un ID (string) con un nombre legible (string).
 */
export type NameMap = Record<string, string>;

/**
 * @public
 * @interface BreadcrumbsContextProps
 * @description Define la forma de los datos almacenados en el contexto.
 */
interface BreadcrumbsContextProps {
  nameMap: NameMap;
}

const BreadcrumbsContext = createContext<BreadcrumbsContextProps | undefined>(
  undefined
);

/**
 * @public
 * @component BreadcrumbsProvider
 * @description Proveedor que hace que el mapa de nombres esté disponible para
 *              sus componentes hijos.
 * @param {object} props
 * @param {ReactNode} props.children - Los componentes hijos que consumirán el contexto.
 * @param {NameMap} props.nameMap - El mapa de IDs a nombres.
 * @returns {React.ReactElement}
 */
export const BreadcrumbsProvider = ({
  children,
  nameMap,
}: {
  children: ReactNode;
  nameMap: NameMap;
}) => {
  return (
    <BreadcrumbsContext.Provider value={{ nameMap }}>
      {children}
    </BreadcrumbsContext.Provider>
  );
};

/**
 * @public
 * @exports useBreadcrumbs
 * @description Hook personalizado para acceder de forma segura al `BreadcrumbsContext`.
 * @throws {Error} Si se usa fuera de un `BreadcrumbsProvider`.
 * @returns {BreadcrumbsContextProps} Los datos compartidos del contexto.
 */
export const useBreadcrumbs = (): BreadcrumbsContextProps => {
  const context = useContext(BreadcrumbsContext);
  if (context === undefined) {
    throw new Error(
      "Error de Arquitectura: useBreadcrumbs debe ser utilizado dentro de un BreadcrumbsProvider."
    );
  }
  return context;
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Composición de Contextos**: ((Vigente)) Este proveedor puede ser compuesto con otros. Si un `nameMap` ya existe en un contexto padre, este proveedor podría fusionar su `nameMap` con el del padre en lugar de sobrescribirlo.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Patrón de Paso de Datos Servidor-Cliente**: ((Implementada)) Este aparato implementa un patrón de élite para pasar datos obtenidos en el servidor (como nombres de entidades) a componentes de cliente de layout de forma desacoplada y eficiente.
 * 2. **Seguridad de Consumo**: ((Implementada)) El hook `useBreadcrumbs` incluye una verificación de error en tiempo de desarrollo, asegurando que se utilice correctamente dentro de su proveedor.
 *
 * =====================================================================
 */
// src/lib/context/BreadcrumbsContext.tsx
