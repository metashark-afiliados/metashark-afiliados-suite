// src/components/resources/IconCard.tsx
/**
 * @file IconCard.tsx
 * @description Componente de UI atómico y de presentación puro. Renderiza
 *              una tarjeta para un único icono en la Galería de Iconos.
 *              **Actualizado para incluir un Tooltip con el nombre del icono en kebab-case.**
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl"; // <-- Importar useTranslations

import { Card, CardContent } from "@/components/ui/card";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // <-- Importaciones de Tooltip
import { clientLogger } from "@/lib/logging";
import { pascalToKebabCase } from "@/lib/utils/text"; // <-- Importar utilidad

interface IconCardProps {
  iconName: string;
  copySuccessMessage: string;
}

/**
 * @public
 * @component IconCard
 * @description Renderiza una tarjeta de icono con funcionalidad de copiar al portapapeles
 *              y un tooltip que muestra el nombre del icono en formato kebab-case.
 * @param {IconCardProps} props - Propiedades del componente.
 * @returns {React.ReactElement}
 */
export function IconCard({
  iconName,
  copySuccessMessage,
}: IconCardProps): React.ReactElement {
  const t = useTranslations("pages.IconGalleryPage"); // <-- Usar useTranslations para aria-label del tooltip
  const kebabCaseName = pascalToKebabCase(iconName); // Convertir para el tooltip

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(iconName);
      toast.success(copySuccessMessage.replace("{iconName}", iconName));
      clientLogger.trace("[IconCard] Nombre de icono copiado al portapapeles", {
        iconName,
      });
    } catch (err) {
      toast.error("Failed to copy icon name."); // Este error no debería ocurrir, pero se mantiene como fallback
      clientLogger.error("[IconCard] Error al copiar al portapapeles", err);
    }
  };

  return (
    // --- INICIO DE IMPLEMENTACIÓN HOLÍSTICA: Tooltip para información contextual ---
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
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
            // Aria-label para el botón de la tarjeta (principal)
            aria-label={t("copySuccessMessage", { iconName })} // Reutilizar mensaje de éxito para accesibilidad
          >
            <CardContent className="flex flex-col items-center justify-center gap-2 p-4">
              <DynamicIcon name={iconName} className="h-8 w-8" />
              <span className="truncate text-xs text-muted-foreground">
                {iconName}
              </span>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          {/* Contenido del tooltip: nombre del icono en kebab-case */}
          <p>{kebabCaseName}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    // --- FIN DE IMPLEMENTACIÓN HOLÍSTICA ---
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
 * 1. **Tooltip Informativo (UX de Élite)**: ((Implementada)) Se ha envuelto la `Card` en un `TooltipProvider`, `Tooltip` y `TooltipTrigger`. Al pasar el cursor, se muestra el nombre del icono en formato `kebab-case`, utilizando la utilidad `pascalToKebabCase` recién creada. Esto mejora la UX al proporcionar información adicional sin ocupar espacio en la UI.
 * 2. **Full Internacionalización para `aria-label`**: ((Implementada)) El `aria-label` de la tarjeta se ha actualizado para consumir `t("copySuccessMessage", { iconName })`, garantizando que el texto accesible sea traducible.
 * 3. **Consumo de `useTranslations`**: ((Implementada)) El componente ahora utiliza `useTranslations("pages.IconGalleryPage")` para obtener textos internacionalizados para la accesibilidad del tooltip.
 * 4. **No Regresión Funcional**: ((Implementada)) Toda la funcionalidad existente del componente (copiar al portapapeles, accesibilidad con teclado) se mantiene intacta.
 * 5. **Versionado Consistente**: ((Implementada)) Se ha incrementado la versión a `2.0.0` para reflejar esta adición significativa.
 *
 * @subsection Melhorias Futuras
 * 1. **Acción Rápida en Tooltip**: ((Vigente)) El `TooltipContent` podría incluir un pequeño botón para "Copiar al portapapeles" directamente dentro del tooltip, ofreciendo una interacción más directa sin necesidad de hacer clic en la tarjeta completa.
 * 2. **Indicador Visual de Estado de Copia**: ((Vigente)) Después de copiar un icono, el `TooltipContent` o la propia `Card` podrían mostrar un breve mensaje de "¡Copiado!" o un icono de check temporalmente para confirmar la acción visualmente.
 *
 * =====================================================================
 */
