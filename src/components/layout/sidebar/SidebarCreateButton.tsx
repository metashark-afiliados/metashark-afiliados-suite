// src/components/layout/sidebar/SidebarCreateButton.tsx
/**
 * @file SidebarCreateButton.tsx
 * @description Aparato de UI atómico y soberano. Renderiza el botón de "Crear"
 *              principal en la barra lateral y gestiona su propia lógica de
 *              interacción e internacionalización.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboardTranslations } from "@/lib/hooks/useDashboardTranslations";
import { clientLogger } from "@/lib/logging";

/**
 * @public
 * @component SidebarCreateButton
 * @description Renderiza el botón de "Crear" en la barra lateral primaria.
 *              Es un componente soberano.
 * @returns {React.ReactElement}
 */
export function SidebarCreateButton(): React.ReactElement {
  const { tSidebar } = useDashboardTranslations();
  clientLogger.trace("[SidebarCreateButton] Renderizando componente soberano.");

  const handleCreateClick = () => {
    clientLogger.info(
      "[SidebarCreateButton] Flujo de creación iniciado por el usuario."
    );
    // Lógica futura para abrir el menú/modal de creación.
    // Ejemplo: useCreationMenuStore.getState().open();
  };

  return (
    <div className="px-4 py-2">
      <Button
        size="lg"
        className="w-full justify-start"
        onClick={handleCreateClick}
      >
        <Plus className="mr-2 h-5 w-5" />
        <span className="font-bold">{tSidebar("create_button")}</span>
      </Button>
    </div>
  );
}
// src/components/layout/sidebar/SidebarCreateButton.tsx
