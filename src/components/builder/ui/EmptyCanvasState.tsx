// src/components/builder/ui/EmptyCanvasState.tsx
/**
 * @file EmptyCanvasState.tsx
 * @description Componente de presentación puro para el estado de lienzo vacío.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import { MousePointerSquareDashed } from "lucide-react";
import React from "react";

/**
 * @public
 * @interface EmptyCanvasStateProps
 * @description Contrato de props para el componente.
 */
export interface EmptyCanvasStateProps {
  title: string;
  description: string;
}

/**
 * @public
 * @component EmptyCanvasState
 * @description Muestra una guía visual para el usuario cuando el lienzo está vacío.
 * @param {EmptyCanvasStateProps} props - Propiedades del componente.
 * @returns {React.ReactElement}
 */
export function EmptyCanvasState({
  title,
  description,
}: EmptyCanvasStateProps): React.ReactElement {
  return (
    <div
      className="flex flex-col items-center justify-center h-full text-center p-8 text-muted-foreground"
      style={{ fontFamily: "sans-serif" }}
    >
      <MousePointerSquareDashed className="h-12 w-12 mb-4" />
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="max-w-xs mt-1">{description}</p>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad (SRP)**: ((Implementada)) Componente puro que maneja un único estado de la UI.
 * 2. **Full Internacionalización**: ((Implementada)) Completamente agnóstico al contenido.
 *
 * @subsection Melhorias Futuras
 * 1. **Acción de Inicio Rápido**: ((Vigente)) Añadir un botón opcional "Añadir primer bloque" que pueda invocar un callback para abrir la `BlocksPalette`.
 *
 * =====================================================================
 */
// src/components/builder/ui/EmptyCanvasState.tsx
