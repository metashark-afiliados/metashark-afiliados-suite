// src/components/builder/SettingsField.tsx
/**
 * @file SettingsField.tsx
 * @description Aparato de UI atómico y especializado ("Obrero"). Renderiza un
 *              único campo de configuración para una propiedad de bloque.
 *              Evolucionado para manejar tipos de propiedad complejos como `array` e `icon`,
 *              siendo el motor de renderizado dinámico del `SettingsPanel`.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.1.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import React from "react";
import { useTranslations } from "next-intl";
import { PlusCircle, Trash2 } from "lucide-react";

import {
  BuilderBooleanSwitch,
  BuilderColorPicker,
  BuilderTextAreaInput,
  BuilderTextInput,
} from "@/components/builder/ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  type BlockPropertyType,
  type EditablePropertyDefinition,
  type PageBlock,
} from "@/lib/builder/types.d";
import { logger } from "@/lib/logging";

/**
 * @private
 * @constant propertyComponentMap
 * @description Mapeo declarativo de `BlockPropertyType` a su componente de renderizado.
 *              Esta es una implementación del principio "Configuración sobre Código",
 *              permitiendo extender fácilmente los tipos de campos simples.
 */
const propertyComponentMap: Record<
  Exclude<BlockPropertyType, "array" | "icon">,
  React.ElementType
> = {
  text: BuilderTextInput,
  textarea: BuilderTextAreaInput,
  color: BuilderColorPicker,
  boolean: BuilderBooleanSwitch,
  number: BuilderTextInput, // Placeholder, a futuro será BuilderNumberInput
  select: BuilderTextInput, // Placeholder, a futuro será BuilderSelect
  image: BuilderTextInput, // Placeholder, a futuro será AssetPicker
};

/**
 * @public
 * @interface SettingsFieldProps
 * @description Contrato de props para el componente `SettingsField`.
 */
export interface SettingsFieldProps {
  /** El objeto de datos completo del bloque que se está editando. */
  block: PageBlock;
  /** La clave de la propiedad específica que este campo representa (ej. "title"). */
  propertyKey: string;
  /** La definición del editor para esta propiedad, desde `blockEditorDefinitions`. */
  definition: EditablePropertyDefinition;
  /** El valor actual de la propiedad. */
  value: any;
  /** La función callback para actualizar el estado en el store de Zustand. */
  updateFn: (blockId: string, propertyKey: string, value: any) => void;
}

/**
 * @public
 * @component SettingsField
 * @description Renderiza un campo de configuración dinámicamente basado en su
 *              `definition`. Actúa como un componente recursivo para el tipo `array`.
 * @param {SettingsFieldProps} props - Propiedades para configurar el campo.
 * @returns {React.ReactElement} El componente de campo de configuración renderizado.
 */
export function SettingsField({
  block,
  propertyKey,
  definition,
  value,
  updateFn,
}: SettingsFieldProps): React.ReactElement {
  const t = useTranslations("components.builder.SettingsPanel");

  // --- LÓGICA PARA TIPO 'ARRAY' ---
  if (definition.type === "array") {
    const items = Array.isArray(value) ? value : [];
    const itemSchema = definition.itemSchema;

    if (!itemSchema) {
      logger.error(
        `[SettingsField] Error de configuración crítico: 'itemSchema' no definido para la propiedad de array "${propertyKey}" en el bloque tipo "${block.type}".`
      );
      return (
        <div className="text-xs text-destructive">
          Error de configuración: Falta itemSchema.
        </div>
      );
    }

    const handleAddItem = () => {
      const newItem = Object.keys(itemSchema).reduce(
        (acc, key) => {
          acc[key] = itemSchema[key].defaultValue;
          return acc;
        },
        {} as Record<string, any>
      );
      updateFn(block.id, propertyKey, [...items, newItem]);
      logger.trace("[SettingsField] Nuevo ítem añadido a la propiedad array.", {
        blockId: block.id,
        propertyKey,
      });
    };

    const handleRemoveItem = (indexToRemove: number) => {
      updateFn(
        block.id,
        propertyKey,
        items.filter((_, index) => index !== indexToRemove)
      );
      logger.trace("[SettingsField] Ítem eliminado de la propiedad array.", {
        blockId: block.id,
        propertyKey,
        removedIndex: indexToRemove,
      });
    };

    const handleItemUpdate = (
      itemIndex: number,
      itemPropKey: string,
      itemValue: any
    ) => {
      const newItems = [...items];
      newItems[itemIndex] = {
        ...newItems[itemIndex],
        [itemPropKey]: itemValue,
      };
      updateFn(block.id, propertyKey, newItems);
    };

    return (
      <div className="space-y-2">
        <Label>{t(definition.label as any)}</Label>
        <Accordion type="multiple" className="w-full border rounded-md">
          {items.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="px-3">
              <AccordionTrigger>
                {t("properties.item_label", { index: index + 1 })}
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                {Object.keys(itemSchema).map((itemPropKey) => (
                  <SettingsField
                    key={itemPropKey}
                    block={block}
                    propertyKey={itemPropKey}
                    definition={itemSchema[itemPropKey]}
                    value={item[itemPropKey]}
                    updateFn={(_, prop, val) =>
                      handleItemUpdate(index, prop, val)
                    }
                  />
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => handleRemoveItem(index)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t("properties.removeItem_button")}
                </Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleAddItem}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          {t("properties.addItem_button")}
        </Button>
      </div>
    );
  }

  // --- LÓGICA PARA TIPO 'ICON' (Placeholder) ---
  if (definition.type === "icon") {
    return (
      <div className="space-y-2">
        <Label htmlFor={`${block.id}-${propertyKey}`}>
          {t(definition.label as any)}
        </Label>
        <BuilderTextInput
          id={`${block.id}-${propertyKey}`}
          value={value ?? ""}
          onChange={(e) => updateFn(block.id, propertyKey, e.target.value)}
          placeholder="e.g., ShieldCheck"
        />
      </div>
    );
  }

  // --- LÓGICA PARA TIPOS SIMPLES ---
  const InputComponent =
    propertyComponentMap[definition.type as keyof typeof propertyComponentMap];

  if (!InputComponent) {
    logger.error(
      `[SettingsField] Componente de input no mapeado para el tipo: "${definition.type}"`
    );
    return (
      <div className="text-xs text-destructive">
        Error: Componente de UI no implementado para el tipo '{definition.type}'
      </div>
    );
  }

  // Lógica de props unificada para componentes simples
  const commonInputProps = {
    id: `${block.id}-${propertyKey}`,
    value: value ?? "",
    checked: !!value,
    onChange: (e: React.ChangeEvent<HTMLInputElement> | string) => {
      const newValue = typeof e === "string" ? e : e.target.value;
      updateFn(block.id, propertyKey, newValue);
    },
    onCheckedChange: (checked: boolean) => {
      updateFn(block.id, propertyKey, checked);
    },
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={commonInputProps.id}>{t(definition.label as any)}</Label>
      <InputComponent {...commonInputProps} />
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Full TSDoc**: ((Implementada)) Cada interfaz, constante y componente está ahora documentado de forma granular para explicar su propósito exacto.
 * 2. **Soporte para `type: "array"`**: ((Implementada)) El componente ahora puede renderizar una lista de sub-campos dentro de un `Accordion` para editar arrays de objetos, como las tarjetas de `Features1`. Incluye lógica para añadir y eliminar ítems.
 * 3. **Full Internacionalización**: ((Implementada)) El componente consume `useTranslations` y utiliza las claves de i18n de `definition.label` para renderizar las etiquetas. Se han añadido nuevas claves de i18n para los botones de añadir/eliminar ítems.
 * 4. **Full Observabilidad**: ((Implementada)) Se han añadido logs de `trace` y `error` para monitorear la manipulación de arrays y los errores de configuración, proporcionando una visibilidad completa del comportamiento del `SettingsPanel`.
 * 5. **Cero Regresiones**: ((Implementada)) La lógica para manejar los tipos de campo simples (`text`, `color`, etc.) se ha preservado y unificado, garantizando que no haya pérdida de funcionalidad.
 *
 * @subsection Melhorias Futuras
 * 1. **Selector de Iconos Visual**: ((Vigente)) Reemplazar el `BuilderTextInput` para el tipo `icon` con un `Popover` que contenga una versión compacta de la `IconGallery`, permitiendo una selección de iconos visual e intuitiva.
 * 2. **Reordenamiento de Items de Array**: ((Vigente)) Integrar `@dnd-kit/sortable` dentro del `Accordion` para permitir al usuario reordenar los ítems del array mediante arrastrar y soltar, una mejora de UX de élite.
 * 3. **Componentes de Input Especializados**: ((Vigente)) Crear componentes `BuilderNumberInput` (con controles de incremento/decremento) y `BuilderSelect` para manejar los tipos `number` y `select` de forma más específica.
 *
 * =====================================================================
 */
// src/components/builder/SettingsField.tsx
