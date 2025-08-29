// src/components/dashboard/layout/mobile-sidebar.tsx
/**
 * @file mobile-sidebar.tsx
 * @description Componente de cliente que ensambla la barra lateral para la vista móvil.
 *              Ha sido refactorizado holísticamente para consumir el componente
 *              soberano `DashboardSidebar`, resolviendo un error crítico de módulo
 *              no encontrado y completando la arquitectura de layout del dashboard.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { Menu } from "lucide-react";

import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { clientLogger } from "@/lib/logging";

/**
 * @public
 * @component MobileSidebar
 * @description Ensambla la barra lateral para la vista móvil, utilizando el
 *              componente `Sheet` para crear un menú desplegable.
 * @returns {React.ReactElement}
 */
export function MobileSidebar(): React.ReactElement {
  clientLogger.trace(
    "[MobileSidebar] Renderizando ensamblador de sidebar móvil."
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col p-0 bg-card">
        <DashboardSidebar />
      </SheetContent>
    </Sheet>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-29
 *
 * @section Melhorias Futuras
 * 1. ((Vigente)) **Cierre Automático al Navegar:** El `Sheet` podría ser controlado por un estado local (`isOpen`). Este estado se pasaría al `DashboardSidebar`, que a su vez lo pasaría a sus `NavLink`. Al hacer clic en un enlace, se invocaría `setIsOpen(false)` para cerrar automáticamente el menú, mejorando la UX móvil.
 * 2. ((Vigente)) **Animación de Contenido:** El contenido dentro del `SheetContent` (`DashboardSidebar`) podría ser animado con `framer-motion` para aparecer de forma escalonada, proporcionando una transición más fluida.
 *
 * =====================================================================
 */
// src/components/dashboard/layout/mobile-sidebar.tsx
