// src/app/[locale]/dev-console/users/components/UsersPageHeader.tsx
/**
 * @file UsersPageHeader.tsx
 * @description Aparato de UI atómico y de ensamblaje puro. Ha sido refactorizado
 *              holísticamente para consumir el componente de layout abstracto
 *              `ResourcePageHeader`, delegando toda la lógica de layout y
 *              cumpliendo el principio DRY al más alto nivel.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { ResourcePageHeader } from "@/components/shared/ResourcePageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { clientLogger } from "@/lib/logger";
import React from "react";

export interface UsersPageHeaderProps {
  title: string;
  description: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearSearchAriaLabel: string;
}

/**
 * @public
 * @component UsersPageHeader
 * @description Orquesta y ensambla la UI del encabezado de la página de gestión
 *              de usuarios. Delega la lógica de layout al componente genérico
 *              `ResourcePageHeader`, actuando como un ensamblador puro.
 * @param {UsersPageHeaderProps} props - Propiedades para configurar el encabezado.
 * @returns {React.ReactElement}
 */
export function UsersPageHeader({
  title,
  description,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  clearSearchAriaLabel,
}: UsersPageHeaderProps): React.ReactElement {
  clientLogger.trace(
    "[UsersPageHeader] Renderizando orquestador de UI consumiendo abstracción."
  );

  const titleSlot = (
    <div>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );

  const actionsSlot = (
    <SearchInput
      placeholder={searchPlaceholder}
      value={searchValue}
      onChange={onSearchChange}
      clearAriaLabel={clearSearchAriaLabel}
      className="w-full sm:max-w-xs"
    />
  );

  return <ResourcePageHeader titleSlot={titleSlot} actionsSlot={actionsSlot} />;
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @subsection Melhorias Adicionadas
 * 1. **Adopción de Abstracción de Layout (DRY)**: ((Implementada)) El componente ahora consume `ResourcePageHeader`, delegando toda la lógica de layout (`flex`, `justify-between`, etc.). Esto lo convierte en un orquestador de composición puro, más simple, declarativo y visualmente consistente con otros encabezados.
 * 2. **Simplificación Radical**: ((Implementada)) El JSX del componente se ha reducido a su mínima expresión, mejorando drásticamente la legibilidad y la mantenibilidad. La lógica de layout ya no está duplicada.
 *
 * @subsection Melhorias Futuras
 * 1. **Botón de Acción Primaria**: ((Vigente)) Para una funcionalidad de administración completa, el `actionsSlot` podría ser extendido para incluir un botón de "Añadir Usuario", que abriría un modal de creación. Propondré esta mejora cuando se aborde la funcionalidad de creación de usuarios desde el Dev Console.
 *
 * =====================================================================
 */
// src/app/[locale]/dev-console/users/components/UsersPageHeader.tsx
