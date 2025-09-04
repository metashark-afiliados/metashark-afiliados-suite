// src/lib/context/WorkspacesContext.tsx
/**
 * @file WorkspacesContext.tsx
 * @description Proveedor de contexto para compartir datos globales de workspaces.
 *              Refactorizado para alinearse con la arquitectura "Lean Database",
 *              operando con `activeWorkspaceRoleId` (number) en lugar de un ENUM de string.
 * @author L.I.A Legacy
 * @version 2.0.0
 * @see .docs-espejo/lib/context/WorkspacesContext.tsx.md
 */
"use client";

import { createContext, type ReactNode, useContext } from "react";
import { type Tables } from "@/lib/types/database";

type Workspace = Tables<"workspaces">;
type Invitation = {
  id: string;
  status: string;
  workspaces: { name: string; icon: string | null } | null;
};

export interface WorkspacesContextProps {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  /**
   * El ID numérico del rol del usuario en el workspace activo.
   * Corresponde a la clave primaria en la tabla `workspace_roles`.
   * Es `null` si no hay un workspace activo.
   */
  activeWorkspaceRoleId: number | null;
  pendingInvitations: Invitation[];
}

const WorkspacesContext = createContext<WorkspacesContextProps | undefined>(
  undefined
);

export const WorkspacesProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: WorkspacesContextProps;
}) => {
  return (
    <WorkspacesContext.Provider value={value}>
      {children}
    </WorkspacesContext.Provider>
  );
};

export const useWorkspaces = (): WorkspacesContextProps => {
  const context = useContext(WorkspacesContext);
  if (context === undefined) {
    throw new Error("useWorkspaces must be used within a WorkspacesProvider");
  }
  return context;
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Contexto Unificado `DashboardContext`**: Actualmente existen `DashboardContext` y `WorkspacesContext` con datos superpuestos. Podrían ser unificados en un único `DashboardContext` para simplificar el árbol de proveedores y el consumo de datos.
 * 2.  **Memoización del Valor**: El prop `value` podría ser envuelto en `useMemo` en el componente `DashboardContextProviders` para prevenir re-renderizados innecesarios si los datos del layout no cambian.
 * 3.  **Tipos de Invitación Robustos**: El tipo `Invitation` está definido localmente. Debería ser importado desde un manifiesto de tipos de datos central (`src/lib/data/invitations/types.ts`) para una mayor cohesión.
 * 4.  **Consumidor `useActiveWorkspace`**: Crear un hook `useActiveWorkspace` que consuma este contexto y devuelva directamente `activeWorkspace` y `activeWorkspaceRoleId`, abstrayendo la necesidad de desestructurar `useWorkspaces` cada vez.
 * 5.  **Manejo de Errores de Contexto**: El mensaje de error podría ser más específico, indicando que el `DashboardLayout` es el responsable de proveer este contexto.
 * 6.  **Documentación de Proveedor**: Mejorar la TSDoc de `WorkspacesProvider` para indicar que es consumido por `DashboardContextProviders` y no debería ser usado directamente.
 * 7.  **Inyección de Dependencias para Pruebas**: Refactorizar el hook `useWorkspaces` para que pueda aceptar un contexto mockeado, facilitando las pruebas unitarias.
 * 8.  **Contexto Específico de Permisos**: La propiedad `activeWorkspaceRoleId` podría ser movida a un `PermissionsContext` más específico si la lógica de permisos se vuelve más compleja.
 * 9.  **Optimización de `pendingInvitations`**: Si la lista de invitaciones es grande, podría ser obtenida a través de una llamada de cliente separada en lugar de ser pasada por el contexto inicial, para no bloquear el renderizado del layout.
 * 10. **Internacionalización del Mensaje de Error**: El mensaje de error lanzado por `useWorkspaces` podría ser una clave de i18n para soportar equipos de desarrollo multilingües.
 * =====================================================================
 */
// src/lib/context/WorkspacesContext.tsx
