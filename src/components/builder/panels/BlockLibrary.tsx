// src/components/builder/panels/BlockLibrary.tsx
/**
 * @file BlockLibrary.tsx
 * @description Orquestador de UI para la biblioteca de categorías. Conectado
 *              al store `useTemplateGalleryStore` para invocar el modal de la galería.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import {
  BLOCK_CATEGORIES_CONFIG,
  type BlockCategoryId,
} from "@/config/block-categories.config";
import { useTemplateGalleryStore } from "@/lib/hooks/useTemplateGalleryStore";
import { logger } from "@/lib/logging";

export function BlockLibrary(): React.ReactElement {
  const t = useTranslations("pages.BuilderPage.BlockLibrary");
  const openGallery = useTemplateGalleryStore((state) => state.open);

  const handleCategoryClick = (categoryId: BlockCategoryId) => {
    logger.info(
      `[BlockLibrary] Categoría seleccionada: ${categoryId}. Abriendo galería de plantillas...`
    );
    openGallery(categoryId);
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <h3 className="font-bold text-lg border-b pb-2">{t("title")}</h3>
      <nav className="flex flex-col space-y-2">
        {BLOCK_CATEGORIES_CONFIG.map((category) => (
          <Button
            key={category.id}
            variant="ghost"
            className="w-full justify-start text-base p-6"
            onClick={() => handleCategoryClick(category.id)}
          >
            <DynamicIcon name={category.iconName} className="mr-4 h-5 w-5" />
            <span>{t(category.i18nKey as any)}</span>
          </Button>
        ))}
      </nav>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Flujo de Usuario Conectado**: ((Implementada)) El `onClick` del botón de categoría ahora invoca la acción `open` del store, conectando la UI con la lógica de estado y completando el flujo de la "Galería de Plantillas".
 *
 * @subsection Melhorias Futuras
 * 1. **Estado Activo Visual**: ((Vigente)) El `BlockLibrary` podría suscribirse al `activeCategoryId` del store. El botón de la categoría actualmente abierta en el modal debería tener un estilo visual "activo" para proporcionar un feedback claro al usuario.
 *
 * =====================================================================
 */
// src/components/builder/panels/BlockLibrary.tsx
