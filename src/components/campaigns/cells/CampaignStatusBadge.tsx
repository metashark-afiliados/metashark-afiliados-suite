// src/components/campaigns/cells/CampaignStatusBadge.tsx
/**
 * @file CampaignStatusBadge.tsx
 * @description Componente de celda atómico y puro. Su única responsabilidad es
 *              renderizar un Badge con el estilo y texto correctos para el estado
 *              de una campaña.
 * @author Raz Podestá
 * @version 1.0.0
 */
import React from "react";
import { type useTranslations } from "next-intl";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type CampaignStatus = "draft" | "published" | "archived";
const statusVariantMap: Record<CampaignStatus, BadgeProps["variant"]> = {
  published: "default",
  archived: "secondary",
  draft: "outline",
};

interface CampaignStatusBadgeProps {
  status: CampaignStatus;
  t: ReturnType<typeof useTranslations>;
}

export function CampaignStatusBadge({ status, t }: CampaignStatusBadgeProps) {
  return (
    <Badge
      variant={statusVariantMap[status]}
      className={cn(
        status === "published" &&
          "bg-green-500/20 border-green-500/50 text-green-700 dark:text-green-400"
      )}
    >
      {t(`status.${status}` as any)}
    </Badge>
  );
}
// src/components/campaigns/cells/CampaignStatusBadge.tsx
