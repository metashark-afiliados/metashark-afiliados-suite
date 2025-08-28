// src/components/builder/BlocksPalette.tsx
/**
 * @file BlocksPalette.tsx
 * @description Orquestador de UI que muestra la lista de bloques de construcción
 *              disponibles. Es un componente declarativo que se auto-configura
 *              leyendo el manifiesto `blockEditorDefinitions`. Ha sido
 *              refactorizado holísticamente para consumir los aparatos canónicos
 *              `PaletteItem` y `PaletteItemPreview` (si fuera necesario para DragOverlay)
 *              desde su ubicación centralizada, eliminando definiciones internas duplicadas.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";

import { blockEditorDefinitions } from "@/lib/builder/block-editor-definitions";
import { logger } from "@/lib/logging";
// --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Consumir aparatos canónicos ---
import { PaletteItem } from "@/components/builder/panels/PaletteItem";
// Se asume que PaletteItemPreview también se importa si BlocksPalette necesitara renderizarlo directamente,
// pero su uso principal es en DragOverlay en BuilderLayout, donde ya se importa canónicamente.
// Si BlocksPalette.tsx alguna vez necesitara renderizarlo (e.g., para una vista más compleja),
// la importación sería: import { PaletteItem, PaletteItemPreview } from "@/components/builder/panels/PaletteItem";
// --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---

/**
 * @public
 * @component BlocksPalette
 * @description Orquesta el renderizado de la lista completa de bloques de construcción
 *              disponibles, obtenidos del manifiesto `blockEditorDefinitions`.
 *              Ahora delega la renderización de cada ítem a su componente atómico `PaletteItem`.
 * @returns {React.ReactElement}
 */
export function BlocksPalette(): React.ReactElement {
  const t = useTranslations("components.builder.BlocksPalette");
  const availableBlockTypes = Object.keys(blockEditorDefinitions);

  logger.trace("[BlocksPalette] Renderizando paleta de bloques.", {
    count: availableBlockTypes.length,
  });

  return (
    <div className="p-4 space-y-4 relative">
      <h3 className="font-bold text-lg border-b pb-2">{t("title")}</h3>
      <div className="grid grid-cols-2 gap-2">
        {availableBlockTypes.map((type) => (
          // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Usar PaletteItem canónico ---
          <PaletteItem key={type} blockType={type} />
          // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
        ))}
      </div>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Eliminación de Código Duplicado**: ((Implementada)) Se han eliminado las definiciones internas duplicadas de `PaletteItem` y `PaletteItemPreview` de este archivo, lo que reduce la deuda técnica y mejora la claridad.
 * 2. **Consumo de Aparatos Canónicos**: ((Implementada)) El componente ahora importa y utiliza la versión canónica de `PaletteItem` desde `src/components/builder/panels/PaletteItem.tsx`. Esto asegura que exista una única fuente de verdad para la lógica y presentación de un ítem de paleta.
 * 3. **Mayor Atomicidad del Orquestador**: ((Implementada)) `BlocksPalette` ahora es un orquestador más puro, enfocado exclusivamente en orquestar la lista de bloques y delegar la renderización de cada ítem a un subcomponente atómico externo, adhiriéndose mejor al SRP.
 *
 * @subsection Melhorias Futuras
 * 1. **Categorización y Búsqueda (UI)**: ((Vigente)) Añadir un `Accordion` para agrupar bloques por categoría y un `SearchInput` para filtrarlos, mejorando la usabilidad de la paleta.
 * 2. **Integración con DragOverlay (si es necesario)**: ((Pendiente)) Si en el futuro `BlocksPalette.tsx` necesitara renderizar `PaletteItemPreview` (ej., para mostrar una previsualización dentro de su propio panel), se aseguraría que la importación de `PaletteItemPreview` también provenga de `src/components/builder/panels/PaletteItem.tsx`. Por ahora, su uso principal es en `BuilderLayout` para el `DragOverlay`.
 *
 * =====================================================================
 */
// src/components/builder/BlocksPalette.tsx
