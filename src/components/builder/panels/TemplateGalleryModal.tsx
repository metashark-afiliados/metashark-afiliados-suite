// src/components/builder/panels/TemplateGalleryModal.tsx
/**
 * @file TemplateGalleryModal.tsx
 * @description Orquestador de UI modal para la galería de plantillas.
 *              Sincronizado para consumir `useTranslations` y renderizar
 *              contenido completamente internacionalizado.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.1.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useTranslations } from "next-intl";
import { shallow } from "zustand/shallow";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TEMPLATE_MANIFEST } from "@/config/template-manifest.config";
import { useTemplateGalleryStore } from "@/lib/hooks/useTemplateGalleryStore";

import { TemplateCard } from "./TemplateCard";

export function TemplateGalleryModal(): React.ReactElement {
  const t = useTranslations("pages.TemplateGallery");
  const { isOpen, close, activeCategoryId } = useTemplateGalleryStore(
    (state) => ({
      isOpen: state.isOpen,
      close: state.close,
      activeCategoryId: state.activeCategoryId,
    }),
    shallow
  );

  if (!isOpen || !activeCategoryId) {
    return <></>;
  }

  const templatesForCategory = TEMPLATE_MANIFEST[activeCategoryId] || [];
  const categoryTitle = t(`category_${activeCategoryId}_title` as any);

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{categoryTitle}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-4">
          {templatesForCategory.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {templatesForCategory.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <p>{t("no_templates_placeholder")}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Full Internacionalización**: ((Implementada)) El componente ahora consume `useTranslations` para renderizar el título del modal y el estado vacío, completando el blindaje de i18n.
 * 2. **Simplificación de API**: ((Implementada)) Al refactorizar `TemplateCard` para que sea autónomo en su internacionalización, la prop `label` fue eliminada de aquí, simplificando este orquestador.
 *
 * =====================================================================
 */
// src/components/builder/panels/TemplateGalleryModal.tsx
