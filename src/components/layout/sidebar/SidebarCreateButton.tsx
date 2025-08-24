// src/components/layout/sidebar/SidebarCreateButton.tsx
/**
 * @file SidebarCreateButton.tsx
 * @description Aparato de UI atómico y de presentación puro. Renderiza el
 *              botón de "Crear" principal y prominente en la barra lateral.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarCreateButtonProps {
  label: string;
  onClick: () => void;
}

export function SidebarCreateButton({
  label,
  onClick,
}: SidebarCreateButtonProps) {
  return (
    <div className="px-4 py-2">
      <Button size="lg" className="w-full justify-start" onClick={onClick}>
        <Plus className="mr-2 h-5 w-5" />
        <span className="font-bold">{label}</span>
      </Button>
    </div>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente de CTA Primario**: ((Implementada)) Este nuevo aparato establece el punto de entrada principal para la creación de contenido, alineándose con la UX de Canva.
 *
 * @subsection Melhorias Futuras
 * 1. **Acción de Apertura**: ((Vigente)) El `onClick` actualmente no hace nada. Deberá ser conectado para abrir un menú contextual o un modal con las opciones de creación rápida del `ActionDock`.
 *
 * =====================================================================
 */
// src/components/layout/sidebar/SidebarCreateButton.tsx
