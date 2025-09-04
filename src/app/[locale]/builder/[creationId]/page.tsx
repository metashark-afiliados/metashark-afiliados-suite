// src/app/[locale]/builder/[creationId]/page.tsx
/**
 * @file page.tsx
 * @description Página de servidor principal del constructor. Es el punto de
 *              entrada y orquestador de datos para el IDE del constructor.
 *              Su arquitectura sigue el patrón de "Carga de Datos en Servidor,
 *              Hidratación Segura en Cliente". Refactorizado para alinear el
 *              logging con la firma canónica de Pino (AD-001).
 * @author Raz Podestá
 * @version 11.0.0
 */
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import React from "react";

import { BuilderLayout } from "@/app/[locale]/builder/[creationId]/BuilderLayout";
import { BuilderStoreProvider } from "@/components/builder/BuilderStoreProvider";
import { Canvas } from "@/components/builder/Canvas";
import {
  BOILERPLATE_CREATION_ID,
  getBoilerplateCreation,
} from "@/lib/builder/boilerplate";
import { type CampaignConfig } from "@/lib/builder/types.d";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { type Tables } from "@/lib/types/database";

/**
 * @private
 * @async
 * @function getCreationById
 * @description Función de acceso a datos atómica y segura. Obtiene una `Creation`
 *              por su ID, validando que el usuario autenticado sea su propietario.
 * @param {string} creationId - El ID de la `Creation` a obtener.
 * @param {string} userId - El ID del usuario autenticado para la validación de permisos.
 * @returns {Promise<Tables<"creations"> | null>} La `Creation` encontrada o `null`.
 */
async function getCreationById(
  creationId: string,
  userId: string
): Promise<Tables<"creations"> | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("creations")
    .select("*")
    .eq("id", creationId)
    .eq("created_by", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    logger.error(
      { err: error, creationId, userId },
      `[BuilderPageLoader] Error al obtener la 'creation'.`
    );
  }
  return data;
}

/**
 * @public
 * @async
 * @function generateMetadata
 * @description Genera los metadatos de la página de forma dinámica, utilizando el nombre de la creación.
 * @param {{ params: { creationId: string; locale: string } }} props - Propiedades para la generación de metadatos.
 * @returns {Promise<Metadata>} Los metadatos de la página.
 */
export async function generateMetadata({
  params: { creationId, locale },
}: {
  params: { creationId: string; locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "pages.BuilderPage" });
  let creationName = t("metadata_default_title");

  try {
    let creationData: Tables<"creations"> | null = null;
    if (
      process.env.DEV_MODE_BOILERPLATE_CREATION === "true" &&
      creationId === BOILERPLATE_CREATION_ID
    ) {
      creationData = getBoilerplateCreation();
    } else {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        creationData = await getCreationById(creationId, user.id);
      }
    }

    if (creationData?.name) {
      creationName = `${t("metadata_editing_prefix")} ${creationData.name}`;
    }
  } catch (error) {
    logger.error(
      { err: error, creationId },
      `[BuilderPage:Metadata] Error al obtener datos para metadata.`
    );
  }

  return {
    title: creationName,
  };
}

/**
 * @public
 * @page BuilderPage
 * @description Orquesta la carga de datos para el constructor. Obtiene la sesión,
 *              carga la `Creation` y ensambla el `BuilderStoreProvider` con el
 *              `BuilderLayout`, pasando el estado inicial como prop.
 * @param {{ params: { creationId: string } }} props - Los parámetros de la ruta.
 * @returns {Promise<React.ReactElement>} El componente del constructor listo para renderizar.
 */
export default async function BuilderPage({
  params,
}: {
  params: { creationId: string };
}): Promise<React.ReactElement> {
  const { creationId } = params;
  logger.trace({ creationId }, "[BuilderPage] Iniciando carga.");

  let creationData: Tables<"creations"> | null;

  if (
    process.env.DEV_MODE_BOILERPLATE_CREATION === "true" &&
    creationId === BOILERPLATE_CREATION_ID
  ) {
    logger.warn(
      { creationId },
      `[BuilderPage] MODO BOILERPLATE ACTIVO. Cargando datos simulados.`
    );
    creationData = getBoilerplateCreation();
  } else {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      logger.warn(
        { creationId },
        `[BuilderPage] Usuario no autenticado intentando acceder. Redirigiendo a login.`
      );
      return redirect(`/login?next=/builder/${creationId}`);
    }

    logger.trace(
      { userId: user.id },
      "[BuilderPage] Sesión de usuario validada, cargando datos."
    );
    creationData = await getCreationById(creationId, user.id);
  }

  if (!creationData) {
    logger.warn(
      { creationId },
      `[BuilderPage] No se encontró la 'creation' o el usuario no tiene permisos.`
    );
    notFound();
  }

  const contentFromDb = (creationData.content as Partial<CampaignConfig>) || {};
  const creationConfig: CampaignConfig = {
    id: creationData.id,
    name: creationData.name,
    site_id: null,
    theme: contentFromDb.theme || { globalFont: "Inter", globalColors: {} },
    blocks: contentFromDb.blocks || [],
  };

  logger.info(
    { creationId: creationData.id },
    "[BuilderPage] Datos listos. Hidratando proveedor de estado del cliente."
  );

  return (
    <BuilderStoreProvider initialState={creationConfig}>
      <BuilderLayout>
        <Canvas />
      </BuilderLayout>
    </BuilderStoreProvider>
  );
}
// src/app/[locale]/builder/[creationId]/page.tsx
