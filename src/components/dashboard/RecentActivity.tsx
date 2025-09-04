// src/components/dashboard/RecentActivity.tsx
/**
 * @file RecentActivity.tsx
 * @description Componente de UI de presentación puro para mostrar diseños recientes.
 *              Ha sido refactorizado a un estándar de élite para ser un
 *              ensamblador 100% agnóstico a la lógica de negocio, consumiendo
 *              el hook soberano `useRecentActivity` para obtener todo su estado
 *              y contenido.
 * @author Raz Podestá - MetaShark Tech
 * @version 13.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useRecentActivity } from "@/lib/hooks/useRecentActivity";
import { clientLogger } from "@/lib/logger";
import { Link } from "@/lib/navigation";

/**
 * @public
 * @component RecentActivity
 * @description Ensambla la sección de "Actividad Reciente" del "Hub Creativo".
 *              Es un componente de presentación puro que delega toda su lógica
 *              al hook `useRecentActivity`.
 * @returns {React.ReactElement | null}
 */
export function RecentActivity(): React.ReactElement | null {
  clientLogger.trace(
    "[RecentActivity] Renderizando componente de presentación puro."
  );

  const { recentCampaigns, t, tFormatter, handleNavigate, animationVariants } =
    useRecentActivity();

  if (!recentCampaigns || recentCampaigns.length === 0) {
    return null;
  }

  const { STAGGER_CONTAINER, FADE_UP } = animationVariants;

  return (
    <motion.section
      variants={STAGGER_CONTAINER}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      className="mt-8 space-y-4"
    >
      <motion.div
        variants={FADE_UP}
        className="flex justify-between items-center px-4 sm:px-6"
      >
        <h2 className="text-xl font-bold">{t("title")}</h2>
        <Button variant="ghost" asChild>
          <Link href="/dashboard/projects">
            {t("viewAll")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </motion.div>
      <div className="relative">
        <motion.div
          variants={FADE_UP}
          className="flex space-x-4 overflow-x-auto pb-4 px-4 sm:px-6 scrollbar-hide"
        >
          {recentCampaigns.map((campaign) => (
            <motion.div
              key={campaign.id}
              variants={FADE_UP}
              className="w-64 flex-shrink-0"
            >
              <Card
                onClick={() => handleNavigate(campaign.creation_id)}
                className="group cursor-pointer transition-all hover:border-primary/40 hover:-translate-y-1 hover:shadow-lg h-full"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleNavigate(campaign.creation_id);
                  }
                }}
                aria-label={t("cardAriaLabel", {
                  campaignName: campaign.name,
                })}
              >
                <CardContent className="p-3">
                  <div className="flex h-24 items-center justify-center rounded-md bg-muted mb-3 overflow-hidden">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-base truncate font-semibold">
                    {campaign.name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {t("lastEdited")}:{" "}
                    {tFormatter.relativeTime(
                      new Date(campaign.updated_at || campaign.created_at)
                    )}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Implementación de Previsualizaciones**: La mejora de élite sigue siendo reemplazar el icono `FileText` con una previsualización de imagen real de la campaña. Esto requiere una Server Action `generateCampaignPreview` y la actualización de la capa de datos.
 * 2. **Lazy Loading de Imágenes**: Una vez implementadas las previsualizaciones, el componente `<img>` o `<Image>` debe usar `loading="lazy"` para optimizar el LCP de la página.
 * 3. **Componente `RecentActivityCard` Atómico**: La `motion.div` que renderiza cada tarjeta podría ser extraída a su propio componente `RecentActivityCard.tsx` para una máxima atomicidad y limpieza del JSX en este orquestador.
 * 4. **Scroll Horizontal Mejorado**: Añadir botones de "scroll left/right" que aparezcan en hover en los extremos del carrusel para mejorar la navegabilidad en dispositivos de escritorio sin trackpad.
 * 5. **Estado Vacío Explícito**: Si `recentCampaigns` está vacío, en lugar de renderizar `null`, se podría mostrar un componente `EmptyState` que invite al usuario a crear su primer diseño.
 * 6. **Accesibilidad de Carrusel**: Implementar `aria-roledescription="carousel"` en el contenedor y `aria-label` en los botones de navegación (si se añaden) para una accesibilidad de élite.
 * =====================================================================
 */
// src/components/dashboard/RecentActivity.tsx
