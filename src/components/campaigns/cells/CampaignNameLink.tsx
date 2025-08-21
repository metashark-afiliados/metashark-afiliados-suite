// src/components/campaigns/cells/CampaignNameLink.tsx
/**
 * @file CampaignNameLink.tsx
 * @description Componente de celda puro. Corregido para construir la URL final
 *              antes de pasarla al `Link`, resolviendo el error de `Dynamic href`.
 * @author Raz Podestá
 * @version 2.0.0
 */
import React from "react";
import { type CampaignMetadata } from "@/lib/data/campaigns";
import { Link } from "@/lib/navigation";

interface CampaignNameLinkProps {
  campaign: CampaignMetadata;
}

export function CampaignNameLink({ campaign }: CampaignNameLinkProps) {
  // --- INICIO DE CORRECCIÓN ---
  const href = `/builder/${campaign.id}`;
  // --- FIN DE CORRECCIÓN ---

  return (
    <Link href={href as any} className="font-medium hover:underline">
      {campaign.name}
    </Link>
  );
}
// src/components/campaigns/cells/CampaignNameLink.tsx
