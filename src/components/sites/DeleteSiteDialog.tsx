// src/components/sites/DeleteSiteDialog.tsx
/**
 * @file src/components/sites/DeleteSiteDialog.tsx
 * @description Modal de confirmación para la eliminación irreversible de un sitio.
 *              Este aparato es un componente de presentación 100% puro y agnóstico
 *              al contenido, recibiendo todos sus textos, estado y callbacks a
 *              través de su contrato de props. Encapsula la lógica de un
 *              formulario para pasar datos ocultos a la Server Action.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import * as React from "react";
import { Loader2, ShieldAlert, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/**
 * @public
 * @interface DeleteSiteDialogTexts
 * @description Contrato para los textos internacionalizados del diálogo.
 */
export interface DeleteSiteDialogTexts {
  title: string;
  description: (subdomain: string) => React.ReactNode;
  cancelButton: string;
  confirmButton: string;
}

interface SimpleSite {
  id: string;
  subdomain: string | null;
}

interface DeleteSiteDialogProps {
  site: SimpleSite;
  onDelete: (formData: FormData) => void;
  isPending: boolean;
  texts: DeleteSiteDialogTexts;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * @public
 * @component DeleteSiteDialog
 * @description Renderiza un botón que, al ser presionado, abre un modal de
 *              confirmación para una acción destructiva (eliminar sitio).
 * @param {DeleteSiteDialogProps} props - Las propiedades para configurar el diálogo.
 * @returns {React.ReactElement}
 */
export function DeleteSiteDialog({
  site,
  onDelete,
  isPending,
  texts,
  onClick,
}: DeleteSiteDialogProps): React.ReactElement {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={onClick}
          aria-label={`Eliminar el sitio ${site.subdomain}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form action={onDelete}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-red-600" />
              {texts.title}
            </DialogTitle>
            <DialogDescription>
              {texts.description(site.subdomain || "")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {texts.cancelButton}
              </Button>
            </DialogClose>
            <input type="hidden" name="siteId" value={site.id} />
            <Button variant="destructive" type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {texts.confirmButton}
            </Button>
          </DialogFooter>
        </form>
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
 * 1. **Componente Puro y Controlado**: ((Implementada)) El aparato es 100% controlado por props, lo que lo hace predecible, testeable y reutilizable.
 * 2. **Soporte para Texto Enriquecido**: ((Implementada)) La prop `description` acepta `React.ReactNode`, permitiendo que el componente padre pase texto formateado (ej. con `<strong>`), una práctica de élite para la internacionalización.
 * 3. **Paso de Datos Ocultos**: ((Implementada)) Utiliza un `<input type="hidden">` dentro de un formulario para pasar el `siteId` a la Server Action, un patrón robusto para acciones que operan sobre una entidad específica.
 *
 * @subsection Melhorias Futuras
 * 1. **Componente Genérico `ConfirmationDialog`**: ((Vigente)) Este componente sigue un patrón muy común. Podría ser abstraído a un `ConfirmationDialog` más genérico que reciba el `triggerButton`, el contenido y los `hiddenInputs` como props, para ser reutilizado en toda la aplicación para cualquier acción de confirmación.
 *
 * =====================================================================
 */
// src/components/sites/DeleteSiteDialog.tsx
