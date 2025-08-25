// src/templates/Features/Features1/index.tsx
/**
 * @file index.tsx
 * @description Componente de bloque de plantilla para una sección de "Características".
 *              Es un componente de presentación puro, editable y full internacionalizado,
 *              diseñado para ser renderizado y manipulado por el "Builder".
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import React from "react";

import { EditableText } from "@/components/builder/ui/EditableText";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { type LucideIconName } from "@/config/lucide-icon-names";
import { clientLogger } from "@/lib/logging";

/**
 * @public
 * @interface FeatureItem
 * @description Define el contrato de datos para una única característica.
 */
export interface FeatureItem {
  icon: LucideIconName;
  title: string;
  description: string;
}

/**
 * @public
 * @interface Features1Props
 * @description Contrato de props para el componente Features1. Incluye las props
 *              inyectadas por el `DraggableBlockWrapper` para la edición en vivo.
 */
export interface Features1Props {
  blockId: string;
  title: string;
  subtitle: string;
  features: FeatureItem[];
  onUpdate: (propName: string, newValue: any) => void;
}

/**
 * @public
 * @component Features1
 * @description Renderiza una sección de características con título, subtítulo
 *              y una cuadrícula de hasta 3 características, todo editable.
 * @param {Features1Props} props - Las propiedades para configurar el componente.
 * @returns {React.ReactElement}
 */
export function Features1({
  blockId,
  title,
  subtitle,
  features,
  onUpdate,
}: Features1Props): React.ReactElement {
  clientLogger.trace(
    `[Features1:Render] Renderizando bloque con ID: ${blockId}`
  );

  /**
   * @private
   * @function handleFeatureUpdate
   * @description Manejador de alto nivel para actualizar una propiedad dentro
   *              de un objeto en el array `features`.
   * @param {number} index - El índice del item a actualizar.
   * @param {keyof FeatureItem} field - El campo del item a actualizar.
   * @param {string} value - El nuevo valor.
   */
  const handleFeatureUpdate = (
    index: number,
    field: keyof FeatureItem,
    value: string
  ) => {
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    onUpdate("features", newFeatures);
  };

  return (
    <section
      className="py-20 bg-background font-sans text-foreground"
      data-lia-marker="Features1"
    >
      <div className="container mx-auto flex flex-col items-center gap-8 px-4 md:px-6">
        <EditableText
          tag="h2"
          value={title}
          onSave={(newValue) => onUpdate("title", newValue)}
          className="text-3xl font-bold text-center"
          placeholder="Título de Características"
        />
        <EditableText
          tag="p"
          value={subtitle}
          onSave={(newValue) => onUpdate("subtitle", newValue)}
          className="max-w-2xl text-center text-muted-foreground"
          placeholder="Subtítulo descriptivo de las características."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
          {(features || []).map((feature, index) => (
            <div
              key={index}
              className="group h-full overflow-hidden rounded-lg border border-border/80 bg-card/80 p-6"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <DynamicIcon
                  name={feature.icon}
                  className="h-6 w-6 text-primary"
                />
              </div>
              <EditableText
                tag="h3"
                value={feature.title}
                onSave={(newValue) =>
                  handleFeatureUpdate(index, "title", newValue)
                }
                className="font-semibold"
                placeholder={`Título Caract. ${index + 1}`}
              />
              <EditableText
                tag="p"
                value={feature.description}
                onSave={(newValue) =>
                  handleFeatureUpdate(index, "description", newValue)
                }
                className="mt-2 text-sm text-muted-foreground"
                placeholder={`Descripción para la característica ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente de Plantilla Complejo**: ((Implementada)) Este aparato es el primer bloque que gestiona una estructura de datos compleja (un array de objetos), validando la robustez de la arquitectura de edición.
 * 2. **Lógica de Actualización Anidada**: ((Implementada)) La función `handleFeatureUpdate` es una implementación de élite que maneja la actualización inmutable de un array de objetos, una lógica fundamental para bloques dinámicos.
 * 3. **Edición en Vivo Completa**: ((Implementada)) Todos los elementos textuales son editables en vivo, proporcionando una experiencia de usuario superior.
 *
 * @subsection Melhorias Futuras
 * 1. **Selector de Iconos en Vivo**: ((Vigente)) El `DynamicIcon` es estático. Una mejora de élite sería convertirlo en un `EditableIcon` que, al hacer clic, abra un `Popover` con el `EmojiPicker` o un selector de iconos para cambiarlo en vivo.
 * 2. **Añadir/Eliminar/Reordenar Características**: ((Vigente)) Añadir controles en la UI de la plantilla o en el `SettingsPanel` para permitir al usuario añadir, eliminar o reordenar dinámicamente las tarjetas de características.
 *
 * =====================================================================
 */
// src/templates/Features/Features1/index.tsx
