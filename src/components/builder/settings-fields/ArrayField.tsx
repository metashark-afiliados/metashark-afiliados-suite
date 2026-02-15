// src/components/builder/settings-fields/ArrayField.tsx
/**
 * @file ArrayField.tsx
 * @description Aparato de UI atómico y especializado. Su única responsabilidad
 *              es renderizar y gestionar la UI para editar una propiedad de
 *              tipo 'array' de objetos.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { PlusCircle, Trash2 } from "lucide-react";

import { SettingsField } from "@/components/builder/SettingsField";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  type EditablePropertyDefinition,
  type PageBlock,
} from "@/lib/builder/types.d";
import { logger } from "@/lib/logging";

export interface ArrayFieldProps {
  block: PageBlock;
  propertyKey: string;
  definition: EditablePropertyDefinition;
  value: any[];
  updateFn: (blockId: string, propertyKey: string, value: any) => void;
}

export function ArrayField({
  block,
  propertyKey,
  definition,
  value,
  updateFn,
}: ArrayFieldProps) {
  const t = useTranslations("components.builder.SettingsPanel");
  const items = Array.isArray(value) ? value : [];
  const itemSchema = definition.itemSchema;

  if (!itemSchema) {
    logger.error(
      `[ArrayField] 'itemSchema' no definido para la propiedad: "${propertyKey}"`
    );
    return (
      <div className="text-xs text-destructive">
        Error de configuración: falta itemSchema.
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
  };

  const handleRemoveItem = (indexToRemove: number) => {
    updateFn(
      block.id,
      propertyKey,
      items.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleItemUpdate = (
    itemIndex: number,
    itemPropKey: string,
    itemValue: any
  ) => {
    const newItems = [...items];
    newItems[itemIndex] = { ...newItems[itemIndex], [itemPropKey]: itemValue };
    updateFn(block.id, propertyKey, newItems);
  };

  return (
    <div className="space-y-2">
      <Label>{t(definition.label as any)}</Label>
      <Accordion type="multiple" className="w-full border rounded-md">
        {items.map((item, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="px-3 border-b last:border-b-0"
          >
            <AccordionTrigger>
              {t("properties.item_label", { index: index + 1 })}
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2 pb-4">
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
                className="text-destructive w-full"
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este componente ahora tiene la única responsabilidad de gestionar la UI para propiedades de tipo array.
 * 2. **Composición Recursiva**: ((Implementada)) La utilización de `SettingsField` dentro de sí mismo es una implementación de élite que demuestra la potencia de la arquitectura de componentes.
 *
 * @subsection Melhorias Futuras
 * 1. **Reordenamiento de Items (D&D)**: ((Vigente)) Integrar `@dnd-kit/sortable` para permitir al usuario reordenar los `AccordionItem` con arrastrar y soltar, proporcionando una UX de edición superior.
 *
 * =====================================================================
 */
// src/components/builder/settings-fields/ArrayField.tsx
