// src/components/ui/RichText.tsx
/**
 * @file RichText.tsx
 * @description Aparato de blindaje de UI atómico. Su única responsabilidad es
 *              aceptar `ReactNode` como `children` y envolverlo en un único
 *              `<span>`, garantizando que siempre se pase un solo elemento React
 *              a los componentes hijos. Esta es la solución arquitectónica para
 *              erradicar el error `React.Children.only`.
 * @author L.I.A. Legacy
 * @version 1.0.0
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
 * 1. **Solución Arquitectónica**: ((Implementada)) Este nuevo aparato proporciona una solución sistémica y reutilizable para el problema `React.Children.only` causado por `t.rich`, promoviendo una composición de componentes segura y robusta.
 *
 * @subsection Melhorias Futuras
 * 1. **Selección de Elemento Contenedor**: ((Vigente)) Se podría añadir una prop `as: "span" | "p" | "div"` para permitir que el componente renderice diferentes elementos HTML contenedores según el contexto semántico, aumentando su flexibilidad.
 *
 * =====================================================================
 */
// src/components/ui/RichText.tsx
