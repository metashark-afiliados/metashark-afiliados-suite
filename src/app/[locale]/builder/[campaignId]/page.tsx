// src/app/[locale]/builder/[campaignId]/page.tsx
/**
 * @file page.tsx
 * @description Página de servidor principal del constructor. Ha sido refactorizado
 *              para inyectar el `site_id` (incluso si es nulo) en el objeto `campaignConfig`
 *              durante la hidratación del store, asegurando que el estado del cliente
 *              tenga el contexto completo y cumpliendo con el nuevo contrato de tipo.
 * @author Raz Podestá
 * @version 3.0.0
 */
import { notFound, redirect } from "next/navigation";
import React from "react";

import { Canvas } from "@/components/builder/Canvas";
import { useBuilderStore } from "@/lib/builder/core/store";
import { type CampaignConfig } from "@/lib/builder/types.d";
import { campaignsData } from "@/lib/data";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";

export default async function BuilderPage({
  params,
}: {
  params: { campaignId: string };
}): Promise<React.ReactElement> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect(`/auth/login?next=/builder/${params.campaignId}`);
  }

  const campaignData = await campaignsData.editor.getCampaignContentById(
    params.campaignId,
    user.id
  );

  if (!campaignData) {
    notFound();
  }

  const baseConfig: Omit<CampaignConfig, "id" | "name" | "site_id" | "blocks"> =
    {
      theme: { globalFont: "Inter", globalColors: {} },
    };

  const contentFromDb = (campaignData.content as Partial<CampaignConfig>) || {};

  // Construye el objeto `campaignConfig` adhiriéndose estrictamente al tipo,
  // asegurando que `site_id` (potencialmente nulo) esté presente.
  const campaignConfig: CampaignConfig = {
    ...baseConfig,
    id: campaignData.id,
    name: campaignData.name,
    site_id: campaignData.site_id,
    blocks: [],
    ...contentFromDb,
  };

  useBuilderStore.setState({ campaignConfig });

  logger.info(
    "[BuilderPage] Datos de campaña cargados e hidratados en el store.",
    { campaignId: campaignData.id, siteId: campaignData.site_id }
  );

  return (
    <div className="h-full w-full bg-background p-4 relative">
      <Canvas />
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Contrato**: ((Implementada)) La lógica de hidratación ahora construye un objeto `CampaignConfig` que cumple estrictamente con el nuevo contrato de tipo, incluyendo el `site_id` nulo.
 * 2. **Hidratación de Contexto Completo**: ((Implementada)) La lógica fusiona el `site_id` del registro de la base de datos en el objeto `campaignConfig` antes de hidratar el store, asegurando que el estado del cliente sea una representación completa y precisa desde el inicio.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de `content`**: ((Vigente)) El `content` de la base de datos debería ser validado con `CampaignConfigSchema.partial().safeParse()` antes de ser usado para una mayor resiliencia.
 *
 * =====================================================================
 */
// src/app/[locale]/builder/[campaignId]/page.tsx
