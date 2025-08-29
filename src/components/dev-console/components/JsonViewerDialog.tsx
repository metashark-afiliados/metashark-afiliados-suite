/**
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logging";
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
  const t = useTypedTranslations("components.dev-console.JsonViewerDialog");

  clientLogger.trace(
    `[JsonViewerDialog] Renderizando diálogo con título: ${title}`
  );

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
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Funcionalidad de Búsqueda/Filtrado de JSON**: ((Vigente)) Para grandes objetos JSON, añadir un campo de búsqueda (`<Input>`) dentro del diálogo que permita filtrar las claves o valores del JSON.
 * 2. **Modos de Visualización**: ((Vigente)) Implementar un selector de "Modo de Visualización" (ej. "Árbol", "Crudo") para ofrecer diferentes representaciones de los datos JSON, utilizando una librería como `react-json-view`.
 * 3. **Botón para Copiar al Portapapeles**: ((Vigente)) Añadir un botón que permita al desarrollador copiar el contenido JSON completo al portapapeles con un solo clic.
 *
 * =====================================================================
 */
