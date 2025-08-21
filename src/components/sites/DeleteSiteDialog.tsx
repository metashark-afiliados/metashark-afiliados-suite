// src/components/sites/DeleteSiteDialog.tsx
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
 * @description Renderiza un modal de confirmación para eliminar un sitio.
 *              Alineado con la API de Button v12.0.
 * @author L.I.A. Legacy
 * @version 1.1.0
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
 * 1. **Alineación de API de Button**: ((Implementada)) Se ha corregido el uso de la prop `variant`, resolviendo el error de tipo.
 *
 * =====================================================================
 */
