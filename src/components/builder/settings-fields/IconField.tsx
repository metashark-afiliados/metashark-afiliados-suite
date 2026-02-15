// src/components/builder/settings-fields/IconField.tsx
/**
 * @file IconField.tsx
 * @description Aparato de UI atómico y especializado. Su única responsabilidad
 *              es renderizar y gestionar la UI para editar una propiedad de
 *              tipo 'icon'.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";

import { BuilderTextInput } from "@/components/builder/ui";
import { Label } from "@/components/ui/label";
import { type PageBlock } from "@/lib/builder/types.d";

export interface IconFieldProps {
  block: PageBlock;
  propertyKey: string;
  label: string;
  value: any;
  updateFn: (blockId: string, propertyKey: string, value: any) => void;
}

export function IconField({
  block,
  propertyKey,
  label,
  value,
  updateFn,
}: IconFieldProps) {
  // Placeholder. A futuro, este componente contendrá un Popover con un selector visual.
  return (
    <div className="space-y-2">
      <Label htmlFor={`${block.id}-${propertyKey}`}>{label}</Label>
      <BuilderTextInput
        id={`${block.id}-${propertyKey}`}
        value={value ?? ""}
        onChange={(e) => updateFn(block.id, propertyKey, e.target.value)}
        placeholder="e.g., ShieldCheck"
      />
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este componente aísla la lógica para el tipo 'icon', preparando el terreno para su futura evolución a un selector visual sin impactar otros tipos de campo.
 *
 * @subsection Melhorias Futuras
 * 1. **Selector de Iconos Visual**: ((Vigente)) Reemplazar el `BuilderTextInput` con un `Popover` que contenga una versión compacta de la `IconGallery`. Esto proporcionaría una UX de élite para la selección de iconos.
 *
 * =====================================================================
 */
// src/components/builder/settings-fields/IconField.tsx
