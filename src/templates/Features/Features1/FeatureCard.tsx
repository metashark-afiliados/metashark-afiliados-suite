// src/templates/Features/Features1/FeatureCard.tsx
/**
 * @file FeatureCard.tsx
 * @description Aparato de UI atómico y de presentación puro. Renderiza una
 *              única tarjeta de característica para el bloque `Features1`.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";

import { EditableText } from "@/components/builder/ui/EditableText";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { type FeatureItem } from "@/lib/builder/types.d";

export interface FeatureCardProps {
  feature: FeatureItem;
  index: number;
  onUpdateFeature: (
    index: number,
    field: keyof FeatureItem,
    value: string
  ) => void;
}

/**
 * @public
 * @component FeatureCard
 * @description Renderiza una tarjeta de característica individual y editable.
 * @param {FeatureCardProps} props - Propiedades para configurar la tarjeta.
 * @returns {React.ReactElement}
 */
export function FeatureCard({
  feature,
  index,
  onUpdateFeature,
}: FeatureCardProps): React.ReactElement {
  return (
    <div className="group h-full overflow-hidden rounded-lg border border-border/80 bg-card/80 p-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
        <DynamicIcon name={feature.icon} className="h-6 w-6 text-primary" />
      </div>
      <EditableText
        tag="h3"
        value={feature.title}
        onSave={(newValue) => onUpdateFeature(index, "title", newValue)}
        className="font-semibold"
        placeholder={`Título Caract. ${index + 1}`}
      />
      <EditableText
        tag="p"
        value={feature.description}
        onSave={(newValue) => onUpdateFeature(index, "description", newValue)}
        className="mt-2 text-sm text-muted-foreground"
        placeholder={`Descripción para la característica ${index + 1}`}
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
 * 1. **Hiper-Atomicidad (SRP)**: ((Implementada)) Este componente tiene la única responsabilidad de presentar una característica, cumpliendo la "Filosofía LEGO".
 * 2. **Contrato de API Desacoplado**: ((Implementada)) El callback `onUpdateFeature` proporciona una API clara y específica para comunicar cambios, desacoplando el componente de la lógica de estado del array completo.
 *
 * @subsection Melhorias Futuras
 * 1. **Selector de Iconos en Vivo**: ((Vigente)) El `DynamicIcon` podría ser reemplazado por un `EditableIcon` que abra un popover para cambiar el icono en vivo.
 *
 * =====================================================================
 */
// src/templates/Features/Features1/FeatureCard.tsx
