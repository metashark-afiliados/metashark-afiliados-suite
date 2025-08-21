// src/components/ui/button/ButtonContent.tsx
import * as React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * @public
 * @interface ButtonContentProps
 * @description Contrato de props para el renderizador de contenido del botón.
 *              Define todas las piezas visuales que pueden componer el interior de un botón.
 */
export interface ButtonContentProps {
  /** Si es `true`, muestra el spinner y oculta los iconos. */
  isLoading?: boolean;
  /** Texto opcional a mostrar durante el estado de carga. */
  loadingText?: React.ReactNode;
  /** Un elemento de icono a mostrar a la izquierda del texto. */
  leftIcon?: React.ReactElement;
  /** Un elemento de icono a mostrar a la derecha del texto. */
  rightIcon?: React.ReactElement;
  /** El contenido principal del botón (generalmente texto). */
  children: React.ReactNode;
}

/**
 * @public
 * @component ButtonContent
 * @description Componente de presentación atómico y puro. Su única responsabilidad es
 *              orquestar el layout del contenido interno de un botón basado en su estado.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
export const ButtonContent: React.FC<ButtonContentProps> = ({
  isLoading,
  loadingText,
  leftIcon,
  rightIcon,
  children,
}) => (
  <>
    {isLoading ? (
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    ) : (
      leftIcon && React.cloneElement(leftIcon, { className: "mr-2 h-4 w-4" })
    )}
    <span className={cn(isLoading && !loadingText && "opacity-0")}>
      {isLoading && loadingText ? loadingText : children}
    </span>
    {!isLoading &&
      rightIcon &&
      React.cloneElement(rightIcon, { className: "ml-2 h-4 w-4" })}
  </>
);

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad de Lógica Visual**: ((Implementada)) Este aparato aísla la lógica de renderizado condicional del contenido, manteniendo el orquestador principal más limpio.
 * 2. **Consistencia de UX**: ((Implementada)) La lógica `isLoading` y de iconos está centralizada, garantizando que todos los botones de la aplicación tengan un comportamiento consistente.
 *
 * @subsection Melhorias Futuras
 * 1. **Personalización del Spinner**: ((Vigente)) La prop `isLoading` podría aceptar un `React.ReactElement` para permitir un spinner personalizado.
 *
 * =====================================================================
 */
// src/components/ui/button/ButtonContent.tsx
