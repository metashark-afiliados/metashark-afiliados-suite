// src/components/shared/PaginatedResourceView.tsx
/**
 * @file PaginatedResourceView.tsx
 * @description Aparato de UI de layout, genérico y de élite. Encapsula el patrón
 *              de renderizar una vista de recursos (cuadrícula o tabla) junto con
 *              sus controles de paginación, adhiriéndose estrictamente al principio DRY.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { PaginationControls } from "@/components/shared/pagination-controls";
import { Card } from "@/components/ui/card";
import { clientLogger } from "@/lib/logging";

/**
 * @public
 * @interface PaginatedResourceViewProps
 * @description Contrato de props genérico para el componente.
 * @template T - El tipo de los datos de cada item del recurso.
 */
export interface PaginatedResourceViewProps<T> {
  /** Un identificador único para la vista actual (ej. 'grid' o 'list'), usado para forzar la re-animación. */
  viewKey: string;
  /** El array de datos a renderizar. */
  items: T[];
  /** Texto a mostrar cuando el array `items` está vacío. */
  emptyStateText: string;
  /** El número de la página actual. */
  page: number;
  /** El número total de items en todas las páginas. */
  totalCount: number;
  /** El número de items por página. */
  limit: number;
  /** La ruta base para los enlaces de paginación. */
  basePath: string;
  /** La consulta de búsqueda actual para mantener en los enlaces de paginación. */
  searchQuery?: string;
  /**
   * @property renderView
   * @description Una función "render prop" que recibe los datos y devuelve el JSX para la vista.
   *              Este patrón de Inversión de Control permite una flexibilidad de renderizado máxima.
   * @param {T[]} items - El array de items para la página actual.
   * @returns {React.ReactNode} El componente de vista (ej. `<SitesGrid />` o `<SitesTable />`).
   */
  renderView: (items: T[]) => React.ReactNode;
}

/**
 * @public
 * @component PaginatedResourceView
 * @description Orquesta el renderizado de una vista de recursos paginada.
 * @template T - El tipo del recurso.
 * @param {PaginatedResourceViewProps<T>} props - Propiedades del componente.
 * @returns {React.ReactElement}
 */
export function PaginatedResourceView<T>({
  viewKey,
  items,
  emptyStateText,
  page,
  totalCount,
  limit,
  basePath,
  searchQuery,
  renderView,
}: PaginatedResourceViewProps<T>): React.ReactElement {
  clientLogger.trace(
    "[PaginatedResourceView] Renderizando vista de recursos paginada.",
    { viewKey, itemCount: items.length }
  );

  return (
    <>
      {items.length > 0 ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={viewKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderView(items)}
          </motion.div>
        </AnimatePresence>
      ) : (
        <Card className="flex h-64 flex-col items-center justify-center p-8 text-center border-dashed">
          <h3 className="text-xl font-semibold">{emptyStateText}</h3>
        </Card>
      )}

      <PaginationControls
        page={page}
        totalCount={totalCount}
        limit={limit}
        basePath={basePath}
        searchQuery={searchQuery}
      />
    </>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Abstracción Arquitectónica (DRY)**: Este nuevo componente encapsula un patrón de UI repetido, eliminando la duplicación de código y mejorando drásticamente la mantenibilidad.
 * 2. ((Implementada)) **Flexibilidad con Render Props (Inversión de Control)**: El uso de una `renderView` prop es una implementación de élite que hace al componente completamente agnóstico a cómo se renderizan los datos, permitiéndole manejar cuadrículas, tablas, o cualquier otra estructura de vista.
 * 3. ((Implementada)) **Animación Integrada**: La lógica de `AnimatePresence` y `motion.div` está ahora centralizada, garantizando transiciones consistentes entre vistas (ej. de cuadrícula a lista) para cualquier recurso.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Slot para Estado Vacío**: En lugar de un simple `emptyStateText`, el componente podría aceptar un `emptyStateSlot: React.ReactNode` para permitir un renderizado de estado vacío completamente personalizado (ej. con un botón de "Crear Primer Recurso").
 *
 * =====================================================================
 */
// src/components/shared/PaginatedResourceView.tsx
