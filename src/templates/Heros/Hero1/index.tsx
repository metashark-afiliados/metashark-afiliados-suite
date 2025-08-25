// src/templates/Heros/Hero1/index.tsx
/**
 * @file index.tsx
 * @description Componente de bloque de plantilla para una sección Hero primaria.
 *              Es un componente de presentación puro y editable, diseñado para
 *              ser renderizado en el Canvas del constructor.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import React from "react";
import { useTranslations } from "next-intl";

import { EditableText } from "@/components/builder/ui/EditableText";
import { clientLogger } from "@/lib/logging";

/**
 * @public
 * @interface Hero1Props
 * @description Contrato de props para el componente Hero1. Incluye las props
 *              inyectadas por el `DraggableBlockWrapper` para la edición en vivo.
 */
export interface Hero1Props {
  blockId: string;
  title: string;
  subtitle: string;
  onUpdate: (propName: string, newValue: string) => void;
}

/**
 * @public
 * @component Hero1
 * @description Renderiza una sección de Hero con título y subtítulo editables.
 * @param {Hero1Props} props - Las propiedades para configurar el componente.
 * @returns {React.ReactElement}
 */
export function Hero1({
  blockId,
  title,
  subtitle,
  onUpdate,
}: Hero1Props): React.ReactElement {
  const t = useTranslations("components.builder.BlocksPalette");
  clientLogger.trace(`[Hero1:Render] Renderizando bloque con ID: ${blockId}`);

  return (
    <section
      className="text-center py-20 bg-gray-100 font-sans text-gray-800"
      data-lia-marker="Hero1"
    >
      <EditableText
        tag="h1"
        value={title}
        onSave={(newValue) => onUpdate("title", newValue)}
        className="text-4xl font-bold"
        placeholder={t("block_name_Hero1")}
      />
      <EditableText
        tag="p"
        value={subtitle}
        onSave={(newValue) => onUpdate("subtitle", newValue)}
        className="text-xl mt-4 text-gray-600 max-w-2xl mx-auto"
        placeholder="Un subtítulo convincente para tu oferta..."
      />
    </section>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente de Plantilla Funcional**: ((Implementada)) Este es el segundo bloque de construcción visual y funcional, solidificando la arquitectura del builder.
 * 2. **Edición en Vivo (Inline Editing)**: ((Implementada)) La integración con `EditableText` es la implementación canónica de la edición en el `Canvas`.
 *
 * @subsection Melhorias Futuras
 * 1. **Botón de CTA Editable**: ((Vigente)) Añadir una prop `ctaText` y renderizar un `<button>` con `EditableText` para permitir la personalización del Call to Action.
 * 2. **Imagen de Fondo**: ((Vigente)) Incluir una prop `backgroundImageUrl` y aplicar un estilo de fondo al `<section>` para una personalización visual más rica.
 *
 * =====================================================================
 */
// src/templates/Heros/Hero1/index.tsx
