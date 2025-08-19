// src/components/ui/RichText.tsx
/**
 * @file RichText.tsx
 * @description Aparato de blindaje de UI atómico. Su única responsabilidad es
 *              aceptar `ReactNode` como `children` y envolverlo en un único
 *              `<span>`, garantizando que siempre se pase un solo elemento React
 *              a los componentes hijos. Esta es la solución arquitectónica para
 *              erradicar el error `React.Children.only`.
 * @author Raz Podestá
 * @version 1.1.0
 */
import React from "react";

import { cn } from "@/lib/utils";

export interface RichTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

/**
 * @public
 * @component RichText
 * @description Renderiza contenido enriquecido (`children`) dentro de un
 *              único `<span>` contenedor para asegurar una composición segura.
 * @param {RichTextProps} props - Propiedades del componente.
 * @returns {React.ReactElement}
 */
export function RichText({
  children,
  className,
  ...props
}: RichTextProps): React.ReactElement {
  return (
    <span className={cn(className)} {...props}>
      {children}
    </span>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Conflicto de Tipos (TS2430)**: ((Implementada)) Se ha renombrado la prop `content` a `children`, resolviendo el conflicto con la interfaz `HTMLAttributes` y alineando el componente con las convenciones de React.
 * 2. **Solución Arquitectónica**: ((Implementada)) Este nuevo aparato proporciona una solución sistémica y reutilizable para el problema de `t.rich`, promoviendo una composición segura de componentes.
 *
 * @subsection Melhorias Futuras
 * 1. **Selección de Elemento Contenedor**: ((Vigente)) Se podría añadir una prop `as: "span" | "p" | "div"` para permitir que el componente renderice diferentes elementos HTML contenedores según el contexto semántico.
 *
 * =====================================================================
 */
// src/components/ui/RichText.tsx
