// src/components/sites/SitesHeader.tsx
/**
 * @file src/components/sites/SitesHeader.tsx
 * @description Encabezado para la página "Mis Sitios". Es un componente de
 *              presentación puro que recibe todos sus textos, estado y manejadores
 *              de eventos a través de props, adhiriéndose a la "Filosofía LEGO".
 *              Compone el diálogo de creación y la barra de búsqueda.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PlusCircle, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { CreateSiteForm, type CreateSiteFormTexts } from "./CreateSiteForm";

/**
 * @public
 * @interface SitesHeaderTexts
 * @description Contrato de props para los textos internacionalizados del encabezado.
 */
export interface SitesHeaderTexts {
  title: string;
  description: string;
  searchPlaceholder: string;
  clearSearchAria: string;
  createSiteButton: string;
  createDialogTitle: string;
}

interface SitesHeaderProps {
  texts: SitesHeaderTexts;
  formTexts: CreateSiteFormTexts;
  isCreateDialogOpen: boolean;
  setCreateDialogOpen: (isOpen: boolean) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  workspaceId: string;
  onCreate: (formData: FormData) => void;
  isPending: boolean;
}

/**
 * @public
 * @component SitesHeader
 * @description Renderiza el encabezado de la página "Mis Sitios", incluyendo el
 *              título, la barra de búsqueda y el botón para abrir el diálogo de
 *              creación de sitios.
 * @param {SitesHeaderProps} props - Propiedades para configurar el encabezado.
 * @returns {React.ReactElement}
 */
export function SitesHeader({
  texts,
  formTexts,
  isCreateDialogOpen,
  setCreateDialogOpen,
  searchQuery,
  onSearchChange,
  workspaceId,
  onCreate,
  isPending,
}: SitesHeaderProps): React.ReactElement {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative">
      <div>
        <h1 className="text-2xl font-bold">{texts.title}</h1>
        <p className="text-muted-foreground">{texts.description}</p>
      </div>
      <div className="flex w-full md:w-auto items-center gap-2">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={texts.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10"
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onSearchChange("")}
                  aria-label={texts.clearSearchAria}
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0">
              <PlusCircle className="mr-2 h-4 w-4" />
              {texts.createSiteButton}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{texts.createDialogTitle}</DialogTitle>
            </DialogHeader>
            <CreateSiteForm
              workspaceId={workspaceId}
              onSuccess={onCreate}
              isPending={isPending}
              texts={formTexts}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente Puro y Controlado**: ((Implementada)) El componente es 100% controlado. El estado del diálogo y del campo de búsqueda es gestionado por un hook soberano (`useSitesPage`) y pasado como props, manteniendo este componente puramente presentacional.
 * 2. **Composición Atómica**: ((Implementada)) Compone el `CreateSiteForm` dentro de un `Dialog`, demostrando la "Filosofía LEGO".
 * 3. **UX Mejorada con Animación**: ((Implementada)) El uso de `AnimatePresence` y `motion.div` de `framer-motion` para el botón de limpiar búsqueda proporciona un feedback visual sutil y de alta calidad.
 *
 * @subsection Melhorias Futuras
 * 1. **Filtros Avanzados**: ((Vigente)) Añadir un botón de "Filtros" que abra un `<Popover>` con opciones para ordenar la lista de sitios (por fecha, por nombre), actualizando la URL con nuevos `searchParams` y pasando el estado al `useSitesPage`.
 *
 * =====================================================================
 */
// src/components/sites/SitesHeader.tsx
