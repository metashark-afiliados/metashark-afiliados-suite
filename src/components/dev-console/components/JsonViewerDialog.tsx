// src/components/dev-console/components/JsonViewerDialog.tsx
/**
 * @file JsonViewerDialog.tsx
 * @description Aparato de UI atómico y genérico para visualizar datos JSON
 *              dentro de un diálogo modal. Ha sido creado holísticamente para
 *              ser completamente soberano en su consumo de i18n, proporcionando
 *              una herramienta de depuración reutilizable y lista para producción.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { logger } from "@/lib/logging";
import { type Json } from "@/lib/types/database";

export interface JsonViewerDialogProps {
  /**
   * El título del diálogo, que se mostrará en el encabezado.
   * Este texto debe ser provisto directamente (ya traducido o como string literal).
   */
  title: string;
  /**
   * Los datos JSON a visualizar. Puede ser cualquier tipo que se pueda serializar a JSON.
   */
  data: Json | null;
  /**
   * El componente o elemento que actuará como disparador para abrir el diálogo.
   * Por ejemplo, un `Button` o un `DropdownMenuItem`.
   */
  trigger: React.ReactNode;
}

/**
 * @public
 * @component JsonViewerDialog
 * @description Renderiza un diálogo modal que muestra datos JSON formateados.
 *              Es útil para la depuración y para inspeccionar estructuras de datos complejas.
 * @param {JsonViewerDialogProps} props - Las propiedades para configurar el diálogo.
 * @returns {React.ReactElement}
 */
export function JsonViewerDialog({
  title,
  data,
  trigger,
}: JsonViewerDialogProps): React.ReactElement {
  // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Soberanía de i18n ---
  const t = useTypedTranslations("components.dev-console.JsonViewerDialog");
  // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---

  logger.trace(`[JsonViewerDialog] Renderizando diálogo con título: ${title}`);

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <pre className="mt-2 w-full rounded-lg bg-muted p-4 text-xs overflow-auto max-h-[60vh]">
          {JSON.stringify(data, null, 2) || t("no_data_available")}
        </pre>
      </DialogContent>
    </Dialog>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este nuevo aparato encapsula una única responsabilidad: la visualización de JSON en un diálogo, mejorando la modularidad y reutilización.
 * 2. **Soberanía de Internacionalización**: ((Implementada)) El componente ahora consume su propio namespace `components.dev-console.JsonViewerDialog`, asegurando que todos sus textos visibles sean traducibles y estén tipo-seguros.
 * 3. **Componente Genérico y Reutilizable**: ((Implementada)) Al aceptar `title`, `data` y `trigger` como props, es un componente de UI altamente genérico que puede ser usado para inspeccionar cualquier dato JSON en cualquier parte de la aplicación.
 * 4. **Full Observabilidad**: ((Implementada)) Incluye un `logger.trace` para registrar su renderizado.
 *
 * @subsection Melhorias Futuras
 * 1. **Funcionalidad de Búsqueda/Filtrado de JSON**: ((Vigente)) Para grandes objetos JSON, añadir un campo de búsqueda (`<Input>`) dentro del diálogo que permita filtrar las claves o valores del JSON.
 * 2. **Modos de Visualización**: ((Vigente)) Implementar un selector de "Modo de Visualización" (ej. "Árbol", "Crudo") para ofrecer diferentes representaciones de los datos JSON.
 *
 * =====================================================================
 */
// src/components/dev-console/components/JsonViewerDialog.tsx
