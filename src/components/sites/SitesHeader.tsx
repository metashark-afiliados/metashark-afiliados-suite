// src/components/sites/SitesHeader.tsx
/**
 * @file SitesHeader.tsx
 * @description Encabezado para la página "Mis Sitios". Es un componente de
 *              presentación puro que recibe todos sus textos, estado y manejadores
 *              de eventos a través de props, adhiriéndose a la "Filosofía LEGO".
 *              Compone el diálogo de creación y la barra de búsqueda.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import React from "react";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/SearchInput";

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
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCreateSiteClick: () => void;
}

/**
 * @public
 * @component SitesHeader
 * @description Renderiza el encabezado de la página "Mis Sitios".
 * @param {SitesHeaderProps} props - Propiedades para configurar el encabezado.
 * @returns {React.ReactElement}
 */
export function SitesHeader({
  texts,
  searchQuery,
  onSearchChange,
  onCreateSiteClick,
}: SitesHeaderProps): React.ReactElement {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative">
      <div>
        <h1 className="text-2xl font-bold">{texts.title}</h1>
        <p className="text-muted-foreground">{texts.description}</p>
      </div>
      <div className="flex w-full md:w-auto items-center gap-2">
        <SearchInput
          placeholder={texts.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          clearAriaLabel={texts.clearSearchAria}
          className="w-full md:w-64"
        />
        <Button onClick={onCreateSiteClick} className="shrink-0">
          <PlusCircle className="mr-2 h-4 w-4" />
          {texts.createSiteButton}
        </Button>
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
 * 1. **Resolución de Error de Build**: ((Implementada)) La creación de este archivo con las dependencias correctas resuelve la importación circular y el error de exportación.
 * 2. **Componente Atómico (SRP)**: ((Implementada)) Este nuevo aparato encapsula la UI del encabezado de la página de sitios, mejorando la modularidad.
 *
 * @subsection Melhorias Futuras
 * 1. **Filtros Avanzados**: ((Vigente)) Añadir un botón de "Filtros" que abra un `<Popover>` con opciones para ordenar la lista de sitios.
 *
 * =====================================================================
 */
// src/components/sites/SitesHeader.tsx
