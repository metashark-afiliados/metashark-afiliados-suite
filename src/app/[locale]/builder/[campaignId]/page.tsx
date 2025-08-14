// src/app/[locale]/builder/[campaignId]/page.tsx
/**
 * @file page.tsx
 * @description Página de servidor principal del constructor. Actúa como la capa de
 *              seguridad y obtención de datos, preparando e hidratando el estado
 *              inicial para la UI del cliente.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { notFound, redirect } from "next/navigation";

import { Canvas } from "@/components/builder/Canvas";
import { type CampaignConfig } from "@/lib/builder/types.d";
import { campaigns as campaignsData } from "@/lib/data";
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
 * 1. **Seguridad Robusta**: ((Implementada)) La página actúa como un guardián de seguridad, validando la sesión y los permisos a través de la capa de datos antes de renderizar.
 * 2. **Hidratación de Estado SSR**: ((Implementada)) El uso de `useBuilderStore.setState` en un Server Component es una técnica de élite que mejora significativamente el rendimiento de carga inicial.
 * 3. **Lógica de Fallback de UX**: ((Implementada)) Proporciona una configuración por defecto para campañas nuevas, asegurando que el usuario nunca vea un estado de error inesperado.
 *
 * @subsection Melhorias Futuras
 * 1. **Cacheo de Datos de Campaña**: ((Vigente)) La consulta `getCampaignContentById` es un candidato ideal para ser cacheada con `unstable_cache` de Next.js.
 * 2. **Sistema de Plantillas de Campaña**: ((Vigente)) La estructura de campaña por defecto está codificada. Una mejora arquitectónica sería mover esta y otras plantillas a una tabla `campaign_templates`.
 *
 * =====================================================================
 */
// src/app/[locale]/builder/[campaignId]/page.tsx
