// src/app/[locale]/builder/new/page.tsx
/**
 * @file src/app/[locale]/builder/new/page.tsx
 * @description "Bootstrap" de creación de campañas. Corregido para construir
 *              manualmente la cadena de texto del error, resolviendo un
 *              complejo error de inferencia de tipos de `next-intl`.
 * @author Raz Podestá
 * @version 1.0.3
 */
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AlertTriangle } from "lucide-react";

import { createPersistentErrorLog } from "@/lib/actions/_helpers";
import { campaigns as campaignsActions } from "@/lib/actions";
import { ErrorStateCard } from "@/components/shared/error-state-card";
import { logger } from "@/lib/logging";
import { type ActionResult } from "@/lib/validators";

interface CreateCampaignLoaderProps {
  searchParams: {
    siteId?: string;
    type?: string;
  };
}

export default async function CreateCampaignLoader({
  searchParams,
}: CreateCampaignLoaderProps): Promise<React.ReactElement> {
  const { siteId, type } = searchParams;
  const tError = await getTranslations("CampaignsPage.errors");

  if (!type) {
    // ... (sin cambios en este bloque)
    logger.warn(
      "[CreateCampaignLoader] Petición inválida: falta el searchParam 'type'.",
      { searchParams }
    );
    return (
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 p-4">
        <ErrorStateCard
          icon={AlertTriangle}
          title={tError("invalid_data")}
          description="No se proporcionó el tipo de campaña a crear."
        />
      </main>
    );
  }

  const result: ActionResult<{ id: string }> =
    await campaignsActions.createCampaignFromTemplateAction(type, siteId);

  if (!result.success) {
    const errorId = await createPersistentErrorLog(
      "CreateCampaignLoader",
      new Error(result.error),
      { siteId, type }
    );

    // --- INICIO DE CORRECCIÓN (TS2322) ---
    // Se construye la cadena manualmente para evitar ambigüedad de tipos.
    const descriptionTemplate = tError("unexpected");
    const finalDescription = descriptionTemplate.replace("{errorId}", errorId);
    // --- FIN DE CORRECCIÓN ---

    return (
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 p-4">
        <ErrorStateCard
          icon={AlertTriangle}
          title={tError("creation_failed")}
          description={finalDescription}
        />
      </main>
    );
  }

  const newCampaignId = result.data.id;
  logger.info(
    `[CreateCampaignLoader] Campaña ${newCampaignId} creada. Redirigiendo al builder.`
  );

  return redirect(`/builder/${newCampaignId}`);
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Resolución Definitiva de TS2322**: ((Implementada)) La construcción manual de la cadena de error `description` elimina la ambigüedad para el compilador de TypeScript, resolviendo el error persistente de forma robusta.
 * =====================================================================
 */
// src/app/[locale]/builder/new/page.tsx
