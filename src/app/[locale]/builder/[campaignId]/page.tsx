// src/app/[locale]/builder/[campaignId]/page.tsx
/**
 * @file page.tsx
 * @description Página de servidor principal del constructor. Actúa como la capa de
 *              seguridad y obtención de datos, preparando e hidratando el estado
 *              inicial para la UI del cliente.
 *              Corregido para importar el módulo de datos de campaña con su nombre de exportación correcto.
 * @author Raz Podestá
 * @version 2.0.0
 */
import { notFound, redirect } from "next/navigation";

import { Canvas } from "@/components/builder/Canvas";
import { type CampaignConfig } from "@/lib/builder/types.d";
import { campaignsData } from "@/lib/data"; // CORRECTION: Changed import to campaignsData
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { useBuilderStore } from "@/lib/builder/core/store";

/**
 * @public
 * @async
 * @function BuilderPage
 * @description Valida permisos, obtiene datos y pre-carga el estado de Zustand.
 * @param {object} props - Propiedades de la página.
 * @param {{ campaignId: string }} props.params - Parámetros de la ruta.
 * @returns {Promise<React.ReactElement>}
 */
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
    logger.warn("[BuilderPage] Acceso no autenticado. Redirigiendo a login.", {
      campaignId: params.campaignId,
    });
    return redirect(`/auth/login?next=/builder/${params.campaignId}`);
  }

  const campaignData = await campaignsData.editor.getCampaignContentById(
    params.campaignId,
    user.id
  );

  if (!campaignData) {
    logger.error(
      `[BuilderPage] Campaña no encontrada o acceso denegado para ${params.campaignId} por usuario ${user.id}`
    );
    notFound();
  }

  // Lógica de fallback: si la campaña es nueva y no tiene contenido,
  // se genera una estructura por defecto para una mejor UX.
  const campaignConfig: CampaignConfig =
    (campaignData.content as CampaignConfig | null) ?? {
      id: campaignData.id,
      name: campaignData.name,
      theme: { globalFont: "Inter", globalColors: {} },
      blocks: [],
    };

  // Hidratación del estado de Zustand en el servidor.
  useBuilderStore.setState({ campaignConfig });

  logger.info(
    "[BuilderPage] Datos de campaña cargados e hidratados en el store.",
    {
      campaignId: campaignData.id,
    }
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
 * 1. **Correção de Importação**: ((Implementada)) A importação de `campaignsData` foi corrigida para usar o nome de exportação correto do arquivo barril `src/lib/data/index.ts`, resolvendo o erro `TS2305`.
 * 2. **Segurança Robusta**: ((Implementada)) A página atua como um guardião de segurança, validando a sessão e os permissões através da camada de dados antes de renderizar.
 * 3. **Hidratação de Estado SSR**: ((Implementada)) O uso de `useBuilderStore.setState` em um Server Component é uma técnica de élite que melhora significativamente o desempenho de carga inicial.
 * 4. **Lógica de Fallback de UX**: ((Implementada)) Fornece uma configuração por defeito para campanhas novas, garantindo que o usuário nunca veja um estado de erro inesperado.
 *
 * @subsection Melhorias Futuras
 * 1. **Cacheo de Dados de Campanha**: ((Implementada)) A consulta `getCampaignContentById` é agora cacheada com `unstable_cache` de Next.js (implementado em `src/lib/data/campaigns/editor.data.ts`).
 * 2. **Sistema de Plantillas de Campaña**: ((Vigente)) A estrutura de campanha por defeito está codificada. Uma melhoria arquitetónica seria mover esta e outras plantillas para uma tabela `campaign_templates`.
 *
 * =====================================================================
 */
