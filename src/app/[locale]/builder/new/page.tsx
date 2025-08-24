// src/app/[locale]/builder/new/page.tsx
/**
 * @file src/app/[locale]/builder/new/page.tsx
 * @description "Bootstrap" de creación de campañas. Instrumentado con
 *              Full Observabilidad de máxima granularidad para un diagnóstico
 *              de flujo de élite.
 * @author Raz Podestá
 * @version 4.2.0
 */
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AlertTriangle } from "lucide-react";
import React from "react";

import { campaigns as campaignsActions } from "@/lib/actions";
import { ErrorStateCard } from "@/components/shared/error-state-card";
import { logger } from "@/lib/logging";
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
  logger.trace("============================================================");
  logger.trace("[CreateCampaignLoader] INICIO DEL FLUJO DE CREACIÓN", {
    searchParams,
  });

  const { siteId, type } = searchParams;
  let t;

  try {
    logger.trace(
      "[CreateCampaignLoader] Paso 1: Intentando obtener traducciones..."
    );
    t = await getTranslations(
      "app.[locale].dashboard.sites.[siteId].campaigns.page"
    );
    logger.trace("[CreateCampaignLoader] Paso 1 OK: Traducciones obtenidas.");
  } catch (error) {
    logger.error(
      "[CreateCampaignLoader] Paso 1 FALLIDO: Error crítico al obtener traducciones.",
      { error: error instanceof Error ? error.message : String(error) }
    );
    // Renderiza un error sin traducciones si i18n falla
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
    `[CreateCampaignLoader] Paso 2 OK: searchParam 'type' validado: "${type}".`
  );

  let result: ActionResult<{ id: string }, { errorId: string }>;
  try {
    logger.trace("[CreateCampaignLoader] Paso 3: Invocando Server Action...");
    result = await campaignsActions.createCampaignFromTemplateAction(
      type,
      siteId
    );
    logger.trace(
      "[CreateCampaignLoader] Paso 3 OK: Server Action completada.",
      {
        result,
      }
    );
  } catch (error) {
    logger.error(
      "[CreateCampaignLoader] Paso 3 FALLIDO: Error crítico al invocar la Server Action.",
      { error: error instanceof Error ? error.message : String(error) }
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
      `[CreateCampaignLoader] Paso 4 FALLIDO: La Server Action devolvió un error. Error ID: ${errorId}`,
      { result }
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
    "[CreateCampaignLoader] Paso 4 OK: El resultado de la acción fue exitoso."
  );

  const newCampaignId = result.data.id;
  logger.info(
    `[CreateCampaignLoader] Paso 5: Redirigiendo al builder para campaignId: ${newCampaignId}. FIN DEL FLUJO.`
  );
  logger.trace("============================================================");

  return redirect(`/builder/${newCampaignId}`);
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Full Observabilidad Granular**: ((Implementada)) Se ha añadido logging explícito para cada paso lógico, incluyendo la obtención de traducciones, la validación de parámetros y la invocación de la Server Action, tanto para casos de éxito como de fallo.
 * 2. **Manejo de Errores de Infraestructura**: ((Implementada)) El componente ahora maneja de forma robusta un posible fallo en la capa de i18n, renderizando un estado de error claro sin depender de las propias traducciones.
 *
 * @subsection Melhorias Futuras
 * 1. **Componente `ErrorPageLayout`**: ((Vigente)) El patrón `<main><ErrorStateCard>...</main>` se repite. Abstraerlo a un componente `ErrorPageLayout` mejoraría la reutilización y el cumplimiento del principio DRY.
 *
 * =====================================================================
 */
// src/app/[locale]/builder/new/page.tsx
