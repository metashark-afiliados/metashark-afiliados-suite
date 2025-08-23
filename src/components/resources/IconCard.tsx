// src/components/resources/IconCard.tsx
/**
 * @file IconCard.tsx
 * @description Componente de UI atómico y de presentación puro. Renderiza
 *              una tarjeta para un único icono en la Galería de Iconos.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import React from "react";
import toast from "react-hot-toast";

import { Card, CardContent } from "@/components/ui/card";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { clientLogger } from "@/lib/logging";

interface IconCardProps {
  iconName: string;
  copySuccessMessage: string;
}

export function IconCard({ iconName, copySuccessMessage }: IconCardProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(iconName);
      toast.success(copySuccessMessage.replace("{iconName}", iconName));
      clientLogger.trace("[IconCard] Nombre de icono copiado al portapapeles", {
        iconName,
      });
    } catch (err) {
      toast.error("Failed to copy icon name.");
      clientLogger.error("[IconCard] Error al copiar al portapapeles", err);
    }
  };

  return (
    <Card
      className="cursor-pointer transition-all hover:bg-muted hover:scale-105"
      onClick={handleCopy}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCopy();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Copiar nombre del icono: ${iconName}`}
    >
      <CardContent className="flex flex-col items-center justify-center gap-2 p-4">
        <DynamicIcon name={iconName} className="h-8 w-8" />
        <span className="truncate text-xs text-muted-foreground">
          {iconName}
        </span>
      </CardContent>
    </Card>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad (SRP)**: ((Implementada)) Este componente tiene la única responsabilidad de presentar un icono y manejar su interacción de copia.
 * 2. **Interactividad de Élite**: ((Implementada)) Proporciona una funcionalidad "click-to-copy" con feedback visual (toast), mejorando la DX.
 * 3. **Accesibilidad (a11y)**: ((Implementada)) La tarjeta es operable por teclado y tiene un `aria-label` descriptivo.
 *
 * @subsection Melhorias Futuras
 * 1. **Tooltip con Información**: ((Vigente)) Añadir un `<Tooltip>` que muestre el nombre `kebab-case` del icono al pasar el cursor.
 *
 * =====================================================================
 */
// src/components/resources/IconCard.tsx
