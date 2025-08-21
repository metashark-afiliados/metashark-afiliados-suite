// src/components/layout/sidebar/user-menu/UserMenuSkeleton.tsx
/**
 * @file UserMenuSkeleton.tsx
 * @description Aparato de UI atómico y puro para el estado de carga del menú de usuario.
 * @author Raz Podestá
 * @version 1.0.0
 */
import React from "react";

export function UserMenuSkeleton(): React.ReactElement {
  return (
    <div className="mt-auto border-t p-4">
      <div className="flex items-center gap-3 p-2">
        <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
        <div className="flex flex-col gap-1">
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
 * 1. **Hiper-Atomicidad (SRP)**: ((Implementada)) El estado de esqueleto ahora es un componente aislado, reutilizable y fácil de mantener.
 *
 * =====================================================================
 */
// src/components/layout/sidebar/user-menu/UserMenuSkeleton.tsx
