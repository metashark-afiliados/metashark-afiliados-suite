// src/components/builder/ui/BuilderTextInput.tsx
/**
 * @file BuilderTextInput.tsx
 * @description Componente de UI atómico y puro para la entrada de texto simple en el constructor.
 *              Encapsula el componente `Input` base, proporcionando una interfaz
 *              consistente para la edición de propiedades de texto.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * @public
 * @interface BuilderTextInputProps
 * @description Contrato de props para el componente.
 */
export interface BuilderTextInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  "aria-label"?: string;
}

/**
 * @public
 * @component BuilderTextInput
 * @description Renderiza un campo de texto controlado. Es 100% agnóstico al contenido,
 *              recibiendo su `aria-label` y `placeholder` del componente padre.
 * @param {BuilderTextInputProps} props - Propiedades del componente.
 * @returns {React.ReactElement}
 */
export function BuilderTextInput({
  value,
  onChange,
  placeholder,
  className,
  id,
  "aria-label": ariaLabel,
}: BuilderTextInputProps): React.ReactElement {
  return (
    <Input
      id={id}
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn("w-full", className)}
      aria-label={ariaLabel || placeholder || "Campo de texto"}
    />
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Componente puro que encapsula una única responsabilidad.
 * 2. **Full Internacionalización**: ((Implementada)) Es completamente agnóstico al contenido, permitiendo que el `SettingsPanel` le inyecte textos traducidos.
 * 3. **Accesibilidad (a11y)**: ((Implementada)) Incluye `id` y `aria-label` para una correcta implementación y asociación con un `<Label>`.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación Visual**: ((Vigente)) Añadir una prop `hasError: boolean` para mostrar visualmente estados de validación (ej. borde rojo).
 * 2. **Iconos Adicionales**: ((Vigente)) Permitir la adición de iconos decorativos o funcionales dentro del input (ej. un icono de "búsqueda").
 *
 * =====================================================================
 */
// src/components/builder/ui/BuilderTextInput.tsx
