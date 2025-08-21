// src/components/ui/button/ButtonGroup.tsx
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * @public
 * @interface ButtonGroupProps
 * @description Contrato de props para el componente de grupo de botones.
 */
export interface ButtonGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * @public
 * @component ButtonGroup
 * @description Componente de layout que agrupa una serie de botones, utilizando
 *              selectores CSS avanzados para aplicar estilos a los elementos hijos
 *              (ej. remover bordes redondeados intermedios).
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "inline-flex items-center [&>button:not(:first-child):not(:last-child)]:rounded-none [&>button:first-child]:rounded-r-none [&>button:last-child]:rounded-l-none [&>button:not(:first-child)]:-ml-px",
      className
    )}
    role="group"
    {...props}
  />
);

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Composición de UI Avanzada**: ((Implementada)) Proporciona una capacidad de layout de alto nivel que antes no existía.
 * 2. **CSS Moderno**: ((Implementada)) Utiliza los selectores `[&>...]` de Tailwind CSS para una estilización contextual y sin necesidad de props adicionales en los hijos.
 *
 * @subsection Melhorias Futuras
 * 1. **Variantes de Orientación**: ((Vigente)) Añadir una prop `orientation: 'horizontal' | 'vertical'` que aplique clases diferentes para grupos de botones verticales.
 *
 * =====================================================================
 */
// src/components/ui/button/ButtonGroup.tsx
