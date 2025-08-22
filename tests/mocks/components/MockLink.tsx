// tests/mocks/components/MockLink.tsx
/**
 * @file MockLink.tsx
 * @description Componente de UI atómico y puro. Su única responsabilidad es
 *              simular el componente `<Link>` de la aplicación para el entorno
 *              de pruebas.
 * @author Raz Podestá
 * @version 1.0.0
 */
import React from "react";

type LinkProps = {
  href: string | object;
  children: React.ReactNode;
  [key: string]: any; // Acepta otras props para compatibilidad
};

export const MockLink: React.FC<LinkProps> = ({ href, children, ...props }) => {
  const path = typeof href === "string" ? href : (href as any).pathname;
  return (
    <a href={path} {...props}>
      {children}
    </a>
  );
};
