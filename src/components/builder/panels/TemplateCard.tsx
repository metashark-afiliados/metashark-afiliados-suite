// src/components/builder/panels/TemplateCard.tsx
/**
 * @file TemplateCard.tsx
 * @description Aparato de UI atómico y de presentación puro. Renderiza una
 *              única tarjeta de plantilla. Corregido para importar
 *              correctamente `@dnd-kit/core`.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.1.1
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import Image from "next/image";
// --- INICIO DE CORRECCIÓN DE ERROR DE TIPEO ---
import { useDraggable } from "@dnd-kit/core";
// --- FIN DE CORRECCIÓN DE ERROR DE TIPEO ---
import { useTranslations } from "next-intl";

import { type TemplateDefinition } from "@/config/template-manifest.config";
import { logger } from "@/lib/logging";

export interface TemplateCardProps {
  template: TemplateDefinition;
}

export function TemplateCard({
  template,
}: TemplateCardProps): React.ReactElement {
  const t = useTranslations("pages.TemplateGallery");
  const label = t(template.i18nKey as any);

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `template-${template.id}`,
    data: {
      fromPalette: true,
      blockType: template.blockType,
      initialProps: template.initialProps || {},
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="group relative cursor-grab active:cursor-grabbing"
      role="button"
      aria-label={t("template_card_aria_label", { templateName: label })}
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
 * 1. **Resolución de Error de Compilación (TS2307)**: ((Implementada)) Se ha corregido el error de tipeo en la importación de `@dnd-kit/core`, restaurando la funcionalidad de arrastrar y soltar.
 *
 * =====================================================================
 */
// src/components/builder/panels/TemplateCard.tsx
