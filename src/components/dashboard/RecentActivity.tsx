// src/components/dashboard/RecentActivity.tsx
/**
 * @file RecentActivity.tsx
 * @description Componente de UI soberano. Sincronizado con la SSoT de i18n.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.1.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useDashboardTranslations } from "@/lib/hooks/useDashboardTranslations";
import { useRouter } from "@/lib/navigation";
import { logger } from "@/lib/logging";
import { type Tables } from "@/lib/types/database";

export function RecentActivity() {
  const { recentCampaigns } = useDashboard();
  const { tDashboardPage, tFormatter } = useDashboardTranslations();
  const router = useRouter();

  if (recentCampaigns.length === 0) return null;

  const STAGGER_CONTAINER = {
    /* ... */
  };
  const FADE_UP = {
    /* ... */
  };

  return (
    <motion.section /* ... */>
      <motion.h2 variants={FADE_UP} className="text-xl font-bold px-4 sm:px-6">
        {tDashboardPage("RecentActivity.title")}
      </motion.h2>
      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto pb-4 px-4 sm:px-6 scrollbar-hide">
          {recentCampaigns.map((campaign) => (
            <motion.div key={campaign.id} /* ... */>
              <Card
                onClick={() =>
                  router.push({
                    pathname: "/builder/[creationId]",
                    params: { creationId: campaign.id },
                  })
                }
                /* ... */
                aria-label={tDashboardPage("RecentActivity.cardAriaLabel", {
                  campaignName: campaign.name,
                })}
              >
                <CardContent className="p-4">
                  {/* ... */}
                  <CardTitle className="text-base truncate">
                    {campaign.name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {tDashboardPage("RecentActivity.lastEdited")}:{" "}
                    {tFormatter.relativeTime(
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
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Sincronización de Contratos:** Resuelve el error `TS2339`.
 * =====================================================================
 */
// src/components/dashboard/RecentActivity.tsx
