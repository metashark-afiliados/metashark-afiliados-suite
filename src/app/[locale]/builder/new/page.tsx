// src/app/[locale]/builder/new/page.tsx
/**
 * @file src/app/[locale]/builder/new/page.tsx
 * @description "Bootstrap" de creación de campañas. Instrumentado con
 *              Full Observabilidad de máxima granularidad para un diagnóstico
 *              de flujo de élite. Refactorizado para alinear el logging con la
 *              firma canónica de Pino (AD-001).
 * @author Raz Podestá
 * @version 5.0.0
 */
import { AlertTriangle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import React from "react";

import { ErrorStateCard } from "@/components/shared/error-state-card";
import { campaigns as campaignsActions } from "@/lib/actions";
import { logger } from "@/lib/logger";
import { type ActionResult } from "@/lib/validators/index.ts";

interface CreateCampaignLoaderProps {
  searchParams: {
    siteId?: string;
    type?: string;
  };
}

export default async function CreateCampaignLoader({
  searchParams,
}: CreateCampaignLoaderProps): Promise<React.ReactElement> {
  logger.trace(
    {},
    "============================================================"
  );
  logger.trace(
    { searchParams },
    "[CreateCampaignLoader] INICIO DEL FLUJO DE CREACIÓN"
  );

  const { siteId, type } = searchParams;
  let t;

  try {
    logger.trace(
      {},
      "[CreateCampaignLoader] Paso 1: Intentando obtener traducciones..."
    );
    t = await getTranslations(
      "app.[locale].dashboard.sites.[siteId].campaigns.page"
    );
    logger.trace(
      {},
      "[CreateCampaignLoader] Paso 1 OK: Traducciones obtenidas."
    );
  } catch (error) {
    logger.error(
      { err: error },
      "[CreateCampaignLoader] Paso 1 FALLIDO: Error crítico al obtener traducciones."
    );
    return (
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 p-4">
        <ErrorStateCard
          icon={AlertTriangle}
          title="i18n Configuration Error"
          description="Could not load translation messages. Check server logs."
        />
      </main>
    );
  }

  if (!type) {
    logger.warn(
      {},
      "[CreateCampaignLoader] Paso 2 FALLIDO: Petición inválida, falta el searchParam 'type'."
    );
    return (
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 p-4">
        <ErrorStateCard
          icon={AlertTriangle}
          title={t("errors.invalid_data")}
          description="No se proporcionó el tipo de campaña a crear."
        />
      </main>
    );
  }
  logger.trace(
    { type },
    `[CreateCampaignLoader] Paso 2 OK: searchParam 'type' validado.`
  );

  let result: ActionResult<{ id: string }, { errorId: string }>;
  try {
    logger.trace(
      {},
      "[CreateCampaignLoader] Paso 3: Invocando Server Action..."
    );
    result = await campaignsActions.createCampaignFromTemplateAction(
      type,
      siteId
    );
    logger.trace(
      { result },
      "[CreateCampaignLoader] Paso 3 OK: Server Action completada."
    );
  } catch (error) {
    logger.error(
      { err: error },
      "[CreateCampaignLoader] Paso 3 FALLIDO: Error crítico al invocar la Server Action."
    );
    return (
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 p-4">
        <ErrorStateCard
          icon={AlertTriangle}
          title={t("errors.creation_failed")}
          description={t("errors.unexpected", { errorId: "action-crash" })}
        />
      </main>
    );
  }

  if (!result.success) {
    const errorId = result.data?.errorId || "unknown";
    logger.error(
      { result },
      `[CreateCampaignLoader] Paso 4 FALLIDO: La Server Action devolvió un error. Error ID: ${errorId}`
    );
    const description = t("errors.unexpected", { errorId });

    return (
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 p-4">
        <ErrorStateCard
          icon={AlertTriangle}
          title={t("errors.creation_failed")}
          description={description}
        />
      </main>
    );
  }
  logger.trace(
    {},
    "[CreateCampaignLoader] Paso 4 OK: El resultado de la acción fue exitoso."
  );

  const newCampaignId = result.data.id;
  logger.info(
    { newCampaignId },
    `[CreateCampaignLoader] Paso 5: Redirigiendo al builder. FIN DEL FLUJO.`
  );
  logger.trace(
    {},
    "============================================================"
  );

  return redirect(`/builder/${newCampaignId}`);
}
// src/app/[locale]/builder/new/page.tsx
