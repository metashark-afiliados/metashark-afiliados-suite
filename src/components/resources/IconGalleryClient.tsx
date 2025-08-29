// src/components/resources/IconGalleryClient.tsx
/**
 * @file IconGalleryClient.tsx
 * @description Orquestador de UI de cliente para la Galería de Iconos. Ha sido
 *              refactorizado holísticamente a un estándar de élite para implementar
 *              **virtualización de cuadrícula con `@tanstack/react-virtual`**,
 *              garantizando una renderización óptima y una experiencia de usuario
 *              fluida incluso con miles de iconos.
 * @author L.I.A. Legacy & Raz Podestá
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual"; // <-- Importación para virtualización

import { SearchInput } from "@/components/ui/SearchInput";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { IconCard } from "./IconCard";
import { clientLogger } from "@/lib/logging";
import { cn } from "@/lib/utils";

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

/**
 * @public
 * @component IconGalleryClient
 * @description Orquesta la UI de la galería de iconos, gestionando la búsqueda,
 *              el filtrado y la renderización virtualizada de las secciones de categorías.
 * @param {IconGalleryClientProps} props - Propiedades para configurar la galería.
 * @returns {React.ReactElement}
 */
export function IconGalleryClient({
  groupedIcons,
  texts,
}: IconGalleryClientProps): React.ReactElement {
  clientLogger.trace(
    "[IconGalleryClient] Renderizando orquestador de UI para galería de iconos."
  );

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

  // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Implementación de Virtualización ---
  const parentRef = useRef<HTMLDivElement>(null); // Referencia al contenedor de la galería
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null); // Elemento scrollable principal

  // Obtener el elemento de scroll del layout principal una vez
  useEffect(() => {
    const scroller = document.getElementById("main-content-scroller");
    setScrollElement(scroller);
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: filteredGroups.length, // Virtualizamos las secciones de categorías
    getScrollElement: () => scrollElement,
    // Estimación de tamaño: un encabezado de categoría (h2) y luego la cuadrícula.
    // Asumimos un promedio por fila de iconos. Ajustar si el layout cambia mucho.
    // Un grupo puede tener 1 ícono o 100. Esto es una estimación.
    estimateSize: (index) => {
      const group = filteredGroups[index];
      // Altura del título + un estimado para el grid de iconos
      // (ej. 40px para título + 2 filas de iconos * ~80px/fila = 200px)
      const baseHeight = 40; // approx height for h2
      const iconRowHeight = 80; // approx height for one row of icons (icon size + gap + padding)
      const iconsPerLine = 6; // Average number of icons per line for estimation
      const numRows = Math.ceil(group.icons.length / iconsPerLine);
      return (
        baseHeight + (numRows > 0 ? numRows * iconRowHeight : iconRowHeight)
      ); // min 1 icon row height
    },
    overscan: 5, // Renderizar 5 ítems fuera del viewport para un scroll más suave
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---

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
        // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Contenedor virtualizado ---
        <div
          ref={parentRef}
          style={{
            height: `${totalSize}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualItems.map((virtualGroup) => {
            const group = filteredGroups[virtualGroup.index];
            return (
              <section
                key={group.category}
                data-index={virtualGroup.index}
                ref={rowVirtualizer.measureElement} // Medir el tamaño real del elemento
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualGroup.start}px)`,
                }}
                className={cn("space-y-4", virtualGroup.index > 0 && "pt-8")} // Añadir padding superior si no es el primer grupo
              >
                <h2 className="text-xl font-semibold tracking-tight text-primary">
                  {group.category}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4 mt-4">
                  {group.icons.map((iconName) => (
                    <IconCard
                      key={iconName}
                      iconName={iconName}
                      copySuccessMessage={texts.copySuccessMessage}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
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
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Virtualización de Cuadrícula de Alto Rendimiento**: ((Implementada)) El componente ahora utiliza `useVirtualizer` para renderizar solo las secciones de categorías visibles en el viewport. Esto garantiza un rendimiento de renderizado instantáneo y un uso de memoria bajo, sin importar la cantidad total de categorías o iconos.
 * 2. **Integración con Anclaje de DOM (`main-content-scroller`)**: ((Implementada)) La virtualización se integra con el `id="main-content-scroller"` del layout principal a través de `getScrollElement`, demostrando el éxito de la refactorización arquitectónica desacoplada.
 * 3. **Estimación Dinámica de Tamaño**: ((Implementada)) La función `estimateSize` ahora intenta calcular una altura más precisa para cada grupo, basándose en el número de iconos dentro de él, mejorando la precisión del scroll.
 * 4. **`measureElement` para Precisión**: ((Implementada)) Se ha añadido `ref={rowVirtualizer.measureElement}` a cada elemento virtualizado para que `@tanstack/react-virtual` pueda medir su tamaño real después de la renderización, ajustando el scroll para mayor precisión.
 * 5. **Full Observabilidad**: ((Implementada)) Se mantiene `clientLogger` para rastrear el renderizado del componente.
 *
 * @subsection Melhorias Futuras
 * 1. **Navegación por Categorías (Sticky)**: ((Vigente)) Añadir una barra lateral o un menú desplegable con enlaces de anclaje (`#Arrow`, `#User`, etc.) que, al hacer clic, desplacen suavemente al usuario a la sección virtualizada correspondiente. Esto podría usar `scrollElement.scrollTo()` o `virtualItem.measureElement(element, true)`.
 * 2. **Cacheo de `filteredGroups`**: ((Vigente)) Aunque `useMemo` ya está en uso, si `groupedIcons` es extremadamente grande, se podría optimizar aún más la generación de `filteredGroups` si la función de filtro fuera muy costosa.
 * 3. **Columnas Responsivas en `estimateSize`**: ((Vigente)) La estimación del tamaño en `estimateSize` asume un número fijo de iconos por línea. Podría ser mejorada para tener en cuenta las columnas responsivas de Tailwind (`grid-cols-2 sm:grid-cols-4 ...`) para una estimación más precisa.
 *
 * =====================================================================
 */
