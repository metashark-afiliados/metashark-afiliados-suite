// src/components/resources/IconGalleryClient.tsx
/**
 * @file IconGalleryClient.tsx
 * @description Orquestador de UI de cliente para la Galería de Iconos. Gestiona
 *              el estado de búsqueda, filtra los iconos y renderiza la cuadrícula agrupada.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import React, { useMemo, useState } from "react";

import { SearchInput } from "@/components/ui/SearchInput";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { IconCard } from "./IconCard";

export interface IconGroup {
  category: string;
  icons: string[];
}

interface IconGalleryClientProps {
  groupedIcons: IconGroup[];
  texts: {
    searchPlaceholder: string;
    clearSearchAriaLabel: string;
    noResults: string;
    copySuccessMessage: string;
  };
}

export function IconGalleryClient({
  groupedIcons,
  texts,
}: IconGalleryClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredGroups = useMemo(() => {
    if (!debouncedSearchTerm) {
      return groupedIcons;
    }

    const lowercasedFilter = debouncedSearchTerm.toLowerCase();

    return groupedIcons
      .map((group) => {
        const filteredIcons = group.icons.filter((iconName) =>
          iconName.toLowerCase().includes(lowercasedFilter)
        );
        return { ...group, icons: filteredIcons };
      })
      .filter((group) => group.icons.length > 0);
  }, [debouncedSearchTerm, groupedIcons]);

  return (
    <div className="flex flex-col gap-8">
      <div className="sticky top-[60px] z-10 bg-card py-4 border-b">
        <SearchInput
          placeholder={texts.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          clearAriaLabel={texts.clearSearchAriaLabel}
        />
      </div>

      {filteredGroups.length > 0 ? (
        <div className="space-y-8">
          {filteredGroups.map(({ category, icons }) => (
            <section key={category}>
              <h2 className="text-xl font-semibold tracking-tight text-primary">
                {category}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4 mt-4">
                {icons.map((iconName) => (
                  <IconCard
                    key={iconName}
                    iconName={iconName}
                    copySuccessMessage={texts.copySuccessMessage}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
          <p>{texts.noResults}</p>
        </div>
      )}
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Filtrado en Tiempo Real**: ((Implementada)) Utiliza `useDebounce` para un filtrado eficiente y fluido de los más de 1300 iconos.
 * 2. **Composición Atómica**: ((Implementada)) Orquesta el átomo `IconCard` y consume el componente de conveniencia `SearchInput`.
 * 3. **Estado Vacío Robusto**: ((Implementada)) Muestra un mensaje claro cuando la búsqueda no produce resultados.
 *
 * @subsection Melhorias Futuras
 * 1. **Virtualización de Alto Rendimiento**: ((Vigente)) ((PRIORIDAD ALTA)) Para optimizar el renderizado inicial y el rendimiento con un gran número de elementos, se debe implementar la virtualización de la cuadrícula utilizando `@tanstack/react-virtual`. Esto evitará renderizar los 1300+ iconos a la vez, mostrando solo los que están en el viewport.
 * 2. **Navegación por Categorías**: ((Vigente)) Añadir una barra lateral o un menú desplegable con enlaces de anclaje (`#Arrow`, `#User`, etc.) para navegar rápidamente entre las categorías de iconos.
 *
 * =====================================================================
 */
// src/components/resources/IconGalleryClient.tsx
