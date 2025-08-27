/**
 * @file RecentActivity.tsx
 * @description Componente de UI soberano para mostrar diseños recientes. Ha sido
 *              refactorizado a un estándar de élite para ser completamente
 *              autocontenido en su consumo de i18n, implementar una UI mejorada
 *              con un enlace "Ver Todo", y alinearse con la arquitectura de
 *              "Creaciones Soberanas" para el enrutamiento.
 * @author Raz Podestá - MetaShark Tech
 * @version 12.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { motion } from "framer-motion";
import { FileText, ArrowRight } from "lucide-react";
import { useFormatter } from "next-intl";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { Link, useRouter } from "@/lib/navigation";
import { clientLogger } from "@/lib/logging";

export function RecentActivity() {
  clientLogger.trace(
    "[RecentActivity] Renderizando componente de actividad reciente soberano."
  );

  const { recentCampaigns } = useDashboard();
  const t = useTypedTranslations("components.dashboard.RecentActivity");
  const tFormatter = useFormatter();
  const router = useRouter();

  if (!recentCampaigns || recentCampaigns.length === 0) {
    // En un estado vacío, no se renderiza nada para mantener la UI limpia.
    return null;
  }

  const STAGGER_CONTAINER = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };
  const FADE_UP = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const handleNavigate = (creationId: string) => {
    clientLogger.trace(
      "[RecentActivity] Navegando al builder para la creación.",
      { creationId }
    );
    router.push({
      pathname: "/builder/[creationId]",
      params: { creationId },
    });
  };

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
                    {/* Placeholder para la previsualización de la campaña */}
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
 *
 * @subsection Melhorias Adicionadas
 * 1. **Soberanía de Internacionalización**: ((Implementada)) El componente ahora consume su propio namespace `components.dashboard.RecentActivity` a través de `useTypedTranslations`, completando su refactorización a un aparato soberano y resolviendo la causa raíz del error `TS2345`.
 * 2. **Enlace "Ver Todo"**: ((Implementada)) Se ha añadido un encabezado a la sección que incluye el título y un enlace "Ver Todo", mejorando la navegabilidad y la UX.
 * 3. **Corrección de Enrutamiento**: ((Implementada)) El `onClick` de la tarjeta ahora redirige utilizando `campaign.creation_id`, alineándose con la arquitectura de "Creaciones Soberanas" donde `creation_id` es la SSoT para el editor.
 * 4. **Accesibilidad (a11y) Mejorada**: ((Implementada)) La tarjeta ahora es completamente operable por teclado (`onKeyDown`) y tiene un `aria-label` descriptivo.
 *
 * @subsection Melhorias Futuras
 * 1. **Implementación de Previsualizaciones**: ((Vigente)) La mejora de élite para este componente es reemplazar el icono `FileText` con una previsualización de imagen real. Esto requiere:
 *    - Una Server Action `generateCampaignPreview(creationId)` que use una librería de browser headless (como Playwright) para tomar una captura de pantalla del `content` de la `Creation`.
 *    - Guardar la imagen en Supabase Storage y almacenar la URL en un nuevo campo `preview_image_url` en la tabla `creations`.
 *    - Actualizar la capa de datos para que `recentCampaigns` incluya esta URL. Propondré esta épica de infraestructura en la siguiente fase.
 * 2. **Lazy Loading de Imágenes**: ((Pendiente)) Una vez implementadas las previsualizaciones, las imágenes deben ser cargadas de forma diferida (`loading="lazy"`) para optimizar el LCP de la página.
 *
 * =====================================================================
 */
