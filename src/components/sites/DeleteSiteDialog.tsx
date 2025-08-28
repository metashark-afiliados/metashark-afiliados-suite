// src/components/sites/DeleteSiteDialog.tsx
/**
 * @file DeleteSiteDialog.tsx
 * @description Aparato de UI atómico y de ensamblaje puro. Ha sido refactorizado
 *              holísticamente para consumir el componente genérico `ConfirmationDialogContent`,
 *              eliminando la duplicación de código y centralizando la lógica de diálogos.
 *              Ahora es soberano en su consumo de i18n, utilizando `useTranslations` directamente.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import * as React from "react";
import { ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";

import { ConfirmationDialogContent } from "@/components/ui/ConfirmationDialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { clientLogger } from "@/lib/logging";

interface SimpleSite {
  id: string;
  subdomain: string | null;
}

export interface DeleteSiteDialogProps {
  site: SimpleSite;
  onDelete: (formData: FormData) => void;
  isPending: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  // La prop `texts` ha sido eliminada, ya que el componente ahora consume
  // sus propias traducciones directamente del namespace `SitesPage`.
}

/**
 * @public
 * @component DeleteSiteDialog
 * @description Renderiza un modal de confirmación para eliminar un sitio.
 *              Actúa como un ensamblador puro que configura el `ConfirmationDialogContent`.
 * @param {DeleteSiteDialogProps} props - Propiedades para configurar el diálogo de eliminación.
 * @returns {React.ReactElement}
 */
export function DeleteSiteDialog({
  site,
  onDelete,
  isPending,
  onClick,
}: DeleteSiteDialogProps): React.ReactElement {
  clientLogger.trace(
    `[DeleteSiteDialog] Renderizando diálogo para sitio: ${site.subdomain}`
  );
  const t = useTranslations("SitesPage");
  const tDialogs = useTranslations("components.ui.Dialogs");
  const [isOpen, setIsOpen] = React.useState(false); // Gestionar estado de apertura internamente

  const dialogTitle = t("deleteDialog.title");
  const dialogDescription = t.rich("deleteDialog.description", {
    subdomain: site.subdomain,
    strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
  });
  const confirmButtonText = t("deleteDialog.confirmButton");
  const cancelButtonText = tDialogs("generic_cancelButton");
  const confirmationLabel = t.rich("deleteDialog.confirmation_label", {
    subdomain: site.subdomain,
    strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={(e) => {
            onClick?.(e);
            e.stopPropagation(); // Prevenir que el clic se propague a la tarjeta padre
            setIsOpen(true);
          }}
          aria-label={t("card.deleteSiteAriaLabel", {
            subdomain: site.subdomain,
          })}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <ConfirmationDialogContent
        icon={ShieldAlert}
        title={dialogTitle}
        description={dialogDescription}
        confirmButtonText={confirmButtonText}
        cancelButtonText={cancelButtonText}
        onConfirm={onDelete}
        onClose={() => setIsOpen(false)}
        isPending={isPending}
        hiddenInputs={{ siteId: site.id }}
        confirmationText={site.subdomain || ""}
        confirmationLabel={confirmationLabel}
      />
    </Dialog>
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
 * 1. **Reutilización de Componente Genérico (DRY)**: ((Implementada)) El componente ahora utiliza `ConfirmationDialogContent.tsx`, eliminando la duplicación de código y consolidando la lógica de UI de diálogos.
 * 2. **Soberanía de Internacionalización**: ((Implementada)) El componente consume `useTranslations("SitesPage")` y `useTranslations("components.ui.Dialogs")` directamente, lo que significa que ya no necesita recibir un objeto `texts` como prop, simplificando su API y fortaleciendo su cohesión.
 * 3. **Simplificación del JSX**: ((Implementada)) El código JSX se ha reducido drásticamente, mejorando la legibilidad y la mantenibilidad.
 * 4. **Gestión de Estado de Apertura**: ((Implementada)) El estado `isOpen` del diálogo se gestiona internamente con `useState`, desacoplandolo del componente padre (`SiteCardHeader` o `SitesGrid`).
 * 5. **Propagación de Clics Controlada**: ((Implementada)) Se ha añadido `e.stopPropagation()` en el `onClick` del `DialogTrigger` para evitar que el evento se propague a los elementos padres, como la tarjeta de sitio, previniendo comportamientos no deseados.
 *
 * @subsection Melhorias Futuras
 * 1. **Animación de Diálogo**: ((Vigente)) Integrar `framer-motion` para animar la entrada y salida del diálogo, mejorando la experiencia del usuario.
 * 2. **Hook Soberano de Diálogo**: ((Vigente)) Para una abstracción de élite, la lógica completa de este diálogo (estado de apertura, gestión de `isPending`, etc.) podría encapsularse en un hook `useDeleteSiteDialog` personalizado, convirtiendo este componente en un presentador aún más puro.
 *
 * =====================================================================
 */
// src/components/sites/DeleteSiteDialog.tsx
