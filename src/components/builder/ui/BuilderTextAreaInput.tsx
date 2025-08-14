// src/components/builder/ui/BuilderTextAreaInput.tsx
/**
 * @file BuilderTextAreaInput.tsx
 * @description Componente de UI atómico y puro para la entrada de texto multilínea en el constructor.
 *              Encapsula el componente `Textarea` base, proporcionando una interfaz
 *              consistente para la edición de propiedades de texto largas.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/**
 * @public
 * @interface BuilderTextAreaInputProps
 * @description Contrato de props para el componente.
 */
export interface BuilderTextAreaInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  "aria-label"?: string;
}

/**
 * @public
 * @component BuilderTextAreaInput
 * @description Renderiza un campo de texto multilínea controlado. Es 100% agnóstico
 *              al contenido, recibiendo su `aria-label` y `placeholder` del padre.
 * @param {BuilderTextAreaInputProps} props - Propiedades del componente.
 * @returns {React.ReactElement}
 */
export function BuilderTextAreaInput({
  value,
  onChange,
  placeholder,
  className,
  id,
  "aria-label": ariaLabel,
}: BuilderTextAreaInputProps): React.ReactElement {
  return (
    <Textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn("w-full min-h-[100px]", className)}
      aria-label={ariaLabel || placeholder || "Campo de texto multilínea"}
    />
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Componente puro que encapsula la edición de texto largo.
 * 2. **Full Internacionalización**: ((Implementada)) Completamente agnóstico al contenido.
 * 3. **Accesibilidad (a11y)**: ((Implementada)) Incluye `id` y `aria-label` para una correcta implementación.
 *
 * @subsection Melhorias Futuras
 * 1. **Auto-ajuste de Altura**: ((Vigente)) Integrar lógica o una librería ligera para que el `textarea` crezca automáticamente en altura a medida que el usuario escribe, evitando barras de scroll.
 * 2. **Contador de Caracteres**: ((Vigente)) Añadir una prop `maxLength` que, cuando se proporciona, muestre un contador de caracteres (ej. "120/500") para dar feedback al usuario.
 *
 * =====================================================================
 */
// src/components/builder/ui/BuilderTextAreaInput.tsx
