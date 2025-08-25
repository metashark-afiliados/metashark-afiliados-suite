// src/components/builder/panels/TemplateGalleryModal.tsx
/**
 * @file TemplateGalleryModal.tsx
 * @description Orquestador de UI modal para la galería de plantillas.
 *              Consume el `useTemplateGalleryStore` para su visibilidad y contexto,
 *              lee el `TEMPLATE_MANIFEST` para obtener su contenido y ensambla una
 *              cuadrícula de `TemplateCard` para la categoría activa.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
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

/**
 * @public
 * @component TemplateGalleryModal
 * @description Renderiza el modal que muestra las plantillas de bloque disponibles
 *              para la categoría seleccionada en la `BlockLibrary`.
 * @returns {React.ReactElement}
 */
export function TemplateGalleryModal(): React.ReactElement {
  const t = useTranslations("pages.BuilderPage.TemplateGallery");
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
  const categoryTitle = t(`category_${activeCategoryId}_title` as any, {
    defaultValue: activeCategoryId,
  });

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
                <TemplateCard
                  key={template.id}
                  template={template}
                  label={t(template.i18nKey as any)}
                />
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
 * 1. **Orquestador de UX Central**: ((Implementada)) Este componente es el corazón de la nueva experiencia de selección de bloques, proporcionando una interfaz visual rica para la exploración de plantillas.
 * 2. **Arquitectura de Ensamblaje (LEGO)**: ((Implementada)) Es un orquestador puro que consume un store de estado, un manifiesto de datos y compone un átomo de UI (`TemplateCard`), adhiriéndose a la "Filosofía LEGO".
 *
 * @subsection Melhorias Futuras
 * 1. **Búsqueda y Filtrado Dentro del Modal**: ((Vigente)) Añadir un `SearchInput` en la `DialogHeader` para permitir a los usuarios filtrar las plantillas por nombre o etiquetas (`tags`) dentro de una categoría.
 * 2. **Pestañas de Sub-categorías**: ((Vigente)) Para categorías con muchas plantillas (ej. "Heros"), se podrían añadir `<Tabs>` para filtrar por sub-categorías (ej. "Con formulario", "Con video", "Minimalista").
 *
 * =====================================================================
 */
// src/components/builder/panels/TemplateGalleryModal.tsx
