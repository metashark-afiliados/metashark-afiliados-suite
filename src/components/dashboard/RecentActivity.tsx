// src/components/dashboard/RecentActivity.tsx
/**
 * @file src/components/dashboard/RecentActivity.tsx
 * @description Componente de UI atómico para mostrar la actividad reciente.
 *              Refactorizado a la arquitectura "Hub Creativo", ahora
 *              presenta las campañas en un carrusel horizontal con animaciones
 *              escalonadas y accesibilidad mejorada.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.1.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useFormatter, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "@/lib/navigation";
import { type Tables } from "@/lib/types/database";
import { logger } from "@/lib/logging";

type Campaign = Tables<"campaigns">;

export interface RecentActivityProps {
  recentCampaigns: Campaign[];
}

export function RecentActivity({ recentCampaigns }: RecentActivityProps) {
  const t = useTranslations("app.[locale].dashboard.page.RecentActivity");
  const format = useFormatter();
  const router = useRouter();

  logger.trace(
    "[RecentActivity] Renderizando componente de actividad reciente.",
    {
      count: recentCampaigns.length,
    }
  );

  const STAGGER_CONTAINER = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const FADE_UP = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  if (recentCampaigns.length === 0) {
    return null;
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      variants={STAGGER_CONTAINER}
      className="space-y-4"
    >
      <motion.h2 variants={FADE_UP} className="text-xl font-bold px-4 sm:px-6">
        {t("title")}
      </motion.h2>
      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto pb-4 px-4 sm:px-6 scrollbar-hide">
          {recentCampaigns.map((campaign) => (
            <motion.div
              variants={FADE_UP}
              key={campaign.id}
              className="flex-shrink-0 w-[250px]"
            >
              <Card
                className="group cursor-pointer hover:border-primary/50 h-full transition-all duration-300 hover:shadow-lg"
                onClick={() =>
                  router.push({
                    pathname: "/builder/[creationId]",
                    params: { creationId: campaign.id },
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push({
                      pathname: "/builder/[creationId]",
                      params: { creationId: campaign.id },
                    });
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={t("cardAriaLabel", { campaignName: campaign.name })}
              >
                <CardContent className="p-4">
                  <div className="h-32 bg-muted rounded-md flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-base truncate">
                    {campaign.name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {t("lastEdited")}:{" "}
                    {format.relativeTime(
                      new Date(campaign.updated_at || campaign.created_at)
                    )}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Layout de Carrusel Horizontal**: ((Implementada)) El componente ahora renderiza las tarjetas en un carrusel con scroll horizontal (`flex overflow-x-auto`), alineándose con el blueprint del "Hub Creativo" de Canva.
 * 2. **Estado Vacío Limpio**: ((Implementada)) El componente ahora devuelve `null` si no hay campañas recientes, creando una interfaz más limpia y evitando mostrar una sección vacía.
 * 3. **Accesibilidad (a11y) Mejorada**: ((Implementada)) Las tarjetas ahora son operables por teclado (`onKeyDown`) y tienen un `aria-label` descriptivo.
 *
 * @subsection Melhorias Futuras
 * 1. **Previsualizaciones de Campañas**: ((Vigente)) La tarjeta podría mostrar una miniatura real de la campaña en lugar de un icono placeholder. Esto requeriría una Server Action para generar y almacenar una captura de pantalla del `content` de la campaña.
 * 2. **Controles de Scroll**: ((Vigente)) Añadir botones de "Anterior" y "Siguiente" que aparezcan en hover en dispositivos de escritorio para mejorar la navegabilidad del carrusel para usuarios sin trackpad.
 *
 * =====================================================================
 */
// src/components/dashboard/RecentActivity.tsx// src/components/dashboard/RecentActivity.tsx
