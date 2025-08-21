// src/components/layout/sidebar/user-menu/UserMenuSkeleton.tsx
import React from "react";

/**
 * @public
 * @component UserMenuSkeleton
 * @description Aparato de UI atómico y de presentación puro. Su única
 *              responsabilidad es renderizar un esqueleto de carga visualmente
 *              consistente para el menú de usuario, proporcionando feedback
 *              inmediato mientras los datos de la sesión se cargan.
 * @returns {React.ReactElement} El componente de esqueleto de carga.
 * @author Raz Podestá
 * @version 1.0.0
 */
export function UserMenuSkeleton(): React.ReactElement {
  return (
    <div
      className="mt-auto border-t p-4"
      role="status"
      aria-label="Loading user menu"
    >
      <div className="flex items-center gap-3 p-2">
        <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
          <div className="h-3 w-32 animate-pulse rounded-md bg-muted" />
        </div>
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
 * 1. **Hiper-Atomicidad (SRP)**: ((Implementada)) Se ha extraído el estado de esqueleto a su propio componente aislado, mejorando la cohesión del ecosistema `UserMenu` y adhiriéndose al Principio de Responsabilidad Única.
 * 2. **Accesibilidad (a11y)**: ((Implementada)) Se ha añadido `role="status"` y un `aria-label` para que los lectores de pantalla comuniquen correctamente el estado de carga.
 *
 * @subsection Melhorias Futuras
 * 1. **Animación de Shimmer**: ((Vigente)) Para una UX de élite, la animación `animate-pulse` podría ser reemplazada por un efecto de "shimmer" (brillo que se desliza), que a menudo se percibe como más moderno y de mayor calidad.
 *
 * =====================================================================
 */
