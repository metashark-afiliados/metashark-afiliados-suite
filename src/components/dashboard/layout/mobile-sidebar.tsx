// src/components/dashboard/layout/mobile-sidebar.tsx
/**
 * @file mobile-sidebar.tsx
 * @description Componente de cliente que ensambla la barra lateral para la vista móvil.
 *              Utiliza el componente `Sheet` para crear un menú desplegable que contiene
 *              la navegación principal y la información del usuario.
 * @author Raz Podestá (adaptado de paddle-nextjs-starter-kit)
 * @version 1.0.0
 */
"use client";

import { Menu } from "lucide-react";

import { Sidebar } from "@/components/dashboard/layout/sidebar";
import { SidebarUserInfo } from "@/components/dashboard/layout/sidebar-user-info";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col p-0">
        {/* Aquí se ensamblan los componentes atómicos ya creados */}
        <Sidebar />
        <SidebarUserInfo />
      </SheetContent>
    </Sheet>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Experiencia Responsiva**: ((Implementada)) Este aparato proporciona la base para una navegación móvil de élite, una pieza clave de la UX moderna.
 * 2. **Composición Atómica**: ((Implementada)) Ensambla los componentes `Sidebar` y `SidebarUserInfo`, demostrando la reutilización y la "Filosofía LEGO".
 *
 * @subsection Melhorias Futuras
 * 1. **Cierre Automático de `Sheet`**: ((Vigente)) Se podría pasar el estado de apertura/cierre (`isOpen`, `setIsOpen`) del `Sheet` al componente `Sidebar` para que, al hacer clic en un enlace de navegación, el menú se cierre automáticamente.
 *
 * =====================================================================
 */
