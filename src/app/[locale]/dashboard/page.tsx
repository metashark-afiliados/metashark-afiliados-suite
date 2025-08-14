// src/components/dashboard/dashboard-client.tsx
/**
 * @file src/components/dashboard/dashboard-client.tsx
 * @description Orquestador de cliente puro para la página principal del dashboard.
 *              Ha sido refactorizado para utilizar una exportación nombrada,
 *              alineándose con las convenciones del proyecto y resolviendo
 *              el error de importación en su consumidor.
 * @author L.I.A. Legacy
 * @version 2.2.0
 */
"use client";

import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState, useTransition } from "react";
import toast from "react-hot-toast";

import { ActionCard } from "@/components/dashboard/ActionCard";
import { RecentCampaigns } from "@/components/dashboard/RecentCampaigns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { updateDashboardLayoutAction } from "@/lib/actions/profiles.actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { logger } from "@/lib/logging";

/**
 * @public
 * @component DashboardClient
 * @description Ensambla y gestiona la interactividad de la página del dashboard.
 * @returns {React.ReactElement}
 */
export function DashboardClient(): React.ReactElement {
  const t = useTranslations("DashboardPage");
  const { user, modules: initialModules, recentCampaigns } = useDashboard();
  const [modules, setModules] = useState(initialModules);
  const [, startTransition] = useTransition();
  const username = user.user_metadata?.full_name || user.email;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = modules.findIndex((m) => m.id === active.id);
      const newIndex = modules.findIndex((m) => m.id === over!.id);
      const newOrder = arrayMove(modules, oldIndex, newIndex);
      setModules(newOrder);

      const moduleIds = newOrder.map((m) => m.id);
      logger.trace(
        "[DashboardClient] Usuario reordenó los módulos, guardando layout.",
        { userId: user.id, newOrder: moduleIds }
      );

      startTransition(async () => {
        const result = await updateDashboardLayoutAction(moduleIds);
        if (!result.success) {
          toast.error(result.error || t("layoutSaveError"));
          logger.error("[DashboardClient] Fallo al guardar el nuevo layout.", {
            userId: user.id,
            error: result.error,
          });
          setModules(modules); // Rollback optimistic update
        }
      });
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex h-full flex-col gap-8 relative">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute top-0 right-0">
                <HelpCircle className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{t("tooltip")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
          className="flex flex-col gap-8"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <h1 className="text-2xl font-bold text-foreground">
              {t("welcomeMessage", { username })}
            </h1>
            <p className="text-md text-muted-foreground">{t("subtitle")}</p>
          </motion.div>
          <SortableContext items={modules.map((m) => m.id)}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {modules.map((module, index) => (
                <ActionCard
                  key={module.id}
                  module={module}
                  isPrimary={index === 0}
                />
              ))}
            </div>
          </SortableContext>
          <RecentCampaigns campaigns={recentCampaigns} />
        </motion.div>
      </div>
    </DndContext>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Alineación de Convenciones**: ((Implementada)) Se ha cambiado la exportación a una exportación nombrada (`export function`). Esto resuelve el error de build y alinea el componente con la convención de exportación canónica del proyecto.
 *
 */
// src/components/dashboard/dashboard-client.tsx
