// src/components/builder/panels/TemplateCard.tsx
/**
 * @file TemplateCard.tsx
 * @description Aparato de UI atómico y de presentación puro. Renderiza una
 *              única tarjeta de plantilla dentro del `TemplateGalleryModal`.
 *              Este componente es ahora la nueva SSoT para la funcionalidad
 *              de arrastrar y soltar desde la biblioteca.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import Image from "next/image";
import { useDraggable } from "@dnd-kit/core";

import { type TemplateDefinition } from "@/config/template-manifest.config";
import { logger } from "@/lib/logging";

/**
 * @public
 * @interface TemplateCardProps
 * @description Contrato de props para el componente `TemplateCard`.
 */
interface TemplateCardProps {
  template: TemplateDefinition;
  label: string;
}

/**
 * @public
 * @component TemplateCard
 * @description Renderiza una tarjeta de plantilla arrastrable.
 * @param {TemplateCardProps} props - Propiedades para configurar la tarjeta.
 * @returns {React.ReactElement}
 */
export function TemplateCard({
  template,
  label,
}: TemplateCardProps): React.ReactElement {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `template-${template.id}`,
    data: {
      fromPalette: true, // Mantenemos la misma lógica de identificación
      blockType: template.blockType,
      initialProps: template.initialProps || {},
    },
  });

  const handleDragStart = () => {
    logger.trace(`[TemplateCard] Iniciando arrastre de plantilla`, {
      templateId: template.id,
      blockType: template.blockType,
    });
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onDragStart={handleDragStart}
      className="group relative cursor-grab active:cursor-grabbing"
      role="button"
      aria-label={`Añadir plantilla: ${label}`}
    >
      <div className="aspect-[4/3] w-full overflow-hidden rounded-md border bg-muted transition-all group-hover:ring-2 group-hover:ring-primary group-hover:ring-offset-2 group-hover:ring-offset-background">
        <Image
          src={template.previewImageUrl}
          alt={`Previsualización de ${label}`}
          width={400}
          height={300}
          className="object-cover object-top w-full h-full"
        />
      </div>
      <p className="mt-2 text-center text-xs font-medium text-muted-foreground group-hover:text-foreground">
        {label}
      </p>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Nueva SSoT de D&D**: ((Implementada)) Este componente ahora encapsula la lógica de `useDraggable`, convirtiéndose en la nueva fuente para iniciar el arrastre de bloques al `Canvas`.
 * 2. **Datos de Arrastre Enriquecidos**: ((Implementada)) El objeto `data` del `useDraggable` ahora incluye `initialProps`, permitiendo que el `Canvas` (a través del `block-initializer.helper`) cree bloques con el contenido predefinido de la plantilla.
 * 3. **Componente de Presentación Puro**: ((Implementada)) Es un átomo de UI 100% puro y agnóstico al estado, recibiendo todo su contenido y lógica a través de props.
 *
 * @subsection Melhorias Futuras
 * 1. **Botón "Añadir al Canvas"**: ((Vigente)) Además de ser arrastrable, la tarjeta podría mostrar un botón de "+" al pasar el cursor para añadir el bloque al final del `Canvas` con un solo clic, una alternativa de UX útil.
 * 2. **Previsualización en Pantalla Completa**: ((Vigente)) Añadir un icono de "expandir" que abra la `previewImageUrl` en un modal de tamaño completo para una mejor inspección.
 *
 * =====================================================================
 */
// src/components/builder/panels/TemplateCard.tsx
