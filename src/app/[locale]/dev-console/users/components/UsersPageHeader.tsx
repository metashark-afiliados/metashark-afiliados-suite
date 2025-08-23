// src/app/[locale]/dev-console/users/components/UsersPageHeader.tsx
/**
 * @file UsersPageHeader.tsx
 * @description Aparato de UI atómico y de presentación puro. Renderiza el
 *              encabezado para la página de gestión de usuarios, incluyendo
 *              el título, descripción y la barra de búsqueda.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import React from "react";
import { SearchInput } from "@/components/ui/SearchInput";

export interface UsersPageHeaderProps {
  title: string;
  description: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearSearchAriaLabel: string;
}

export function UsersPageHeader({
  title,
  description,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  clearSearchAriaLabel,
}: UsersPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <SearchInput
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={onSearchChange}
        clearAriaLabel={clearSearchAriaLabel}
        className="w-full sm:max-w-xs"
      />
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad (SRP)**: ((Implementada)) Este componente tiene la única responsabilidad de presentar el encabezado, desacoplándolo del orquestador de la página.
 * 2. **Componente Puro y Controlado**: ((Implementada)) Es 100% agnóstico al estado, recibiendo todos sus datos y callbacks a través de props.
 *
 * @subsection Melhorias Futuras
 * 1. **Botón de Acción**: ((Vigente)) Se podría añadir una prop `primaryAction?: React.ReactNode` para renderizar un botón de acción principal, como "Añadir Usuario".
 *
 * =====================================================================
 */
// src/app/[locale]/dev-console/users/components/UsersPageHeader.tsx
