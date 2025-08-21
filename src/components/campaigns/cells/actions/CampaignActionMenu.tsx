// src/components/campaigns/cells/actions/CampaignActionMenu.tsx
/**
 * @file CampaignActionMenu.tsx
 * @description Componente de presentación atómico y puro. Su única responsabilidad
 *              es renderizar el menú de acciones para una campaña. Corregido para
 *              utilizar importaciones de módulo atómicas.
 * @author Raz Podestá
 * @version 1.1.0
 */
"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type CampaignMetadata } from "@/lib/data/campaigns";
import { Link } from "@/lib/navigation";
import {
  Archive,
  Copy,
  Edit,
  MoreHorizontal,
  PieChart,
  Trash2,
} from "lucide-react";

interface CampaignActionMenuProps {
  campaign: CampaignMetadata;
  t: (key: string) => string;
  onDuplicate: () => void;
  onArchive: () => void;
  onDeleteClick: () => void;
}

export function CampaignActionMenu({
  campaign,
  t,
  onDuplicate,
  onArchive,
  onDeleteClick,
}: CampaignActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link
            href={
              {
                pathname: "/builder/[campaignId]",
                params: { campaignId: campaign.id },
              } as any
            }
          >
            <Edit className="mr-2 h-4 w-4" />
            <span>{t("table.action_edit")}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          <span>{t("table.action_duplicate")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onArchive}>
          <Archive className="mr-2 h-4 w-4" />
          <span>{t("table.action_archive")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <PieChart className="mr-2 h-4 w-4" />
          <span>{t("table.action_analytics")}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            onDeleteClick();
          }}
          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>{t("table.action_delete")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
// src/components/campaigns/cells/actions/CampaignActionMenu.tsx
