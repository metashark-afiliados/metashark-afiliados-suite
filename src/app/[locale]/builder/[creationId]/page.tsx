// src/app/[locale]/builder/[creationId]/page.tsx
/**
 * @file page.tsx
 * @description Página de servidor principal del constructor. Es el punto de
 *              entrada y orquestador de datos para el IDE del constructor.
 *              Su arquitectura sigue el patrón de "Carga de Datos en Servidor,
 * *            Hidratación Segura en Cliente". Refactorizado para incluir metadatos dinámicos.
 * @author Raz Podestá
 * @version 10.0.0
 * @date 2025-08-28
 */
import { notFound, redirect } from "next/navigation";
import React from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { BuilderStoreProvider } from "@/components/builder/BuilderStoreProvider";
import { Canvas } from "@/components/builder/Canvas";
import {
  BOILERPLATE_CREATION_ID,
  getBoilerplateCreation,
} from "@/lib/builder/boilerplate";
import { type CampaignConfig } from "@/lib/builder/types.d";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type Tables } from "@/lib/types/database";
// --- INICIO DE REFACTORIZACIÓN: Importación de BuilderLayout ---
import { BuilderLayout } from "./BuilderLayout";
// --- FIN DE REFACTORIZACIÓN ---

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
      `[BuilderPageLoader] Error al obtener la 'creation' ${creationId}`,
      error
    );
  }
  return data;
}

/**
 * @public
 * @async
 * @function generateMetadata
 * @description Genera los metadatos de la página de forma dinámica, utilizando el nombre de la creación.
 * @param {object} props - Propiedades para la generación de metadatos, incluyendo los parámetros de la URL.
 * @returns {Promise<Metadata>} Los metadatos de la página.
 */
export async function generateMetadata({
  params: { creationId, locale },
}: {
  params: { creationId: string; locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "pages.BuilderPage" });
  let creationName = t("metadata_default_title"); // Título por defecto

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
      `[BuilderPage:Metadata] Error al obtener datos para metadata:`,
      error
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
  logger.trace(`[BuilderPage] Iniciando carga para creationId: ${creationId}`);

  let creationData: Tables<"creations"> | null;

  if (
    process.env.DEV_MODE_BOILERPLATE_CREATION === "true" &&
    creationId === BOILERPLATE_CREATION_ID
  ) {
    logger.warn(
      `[BuilderPage] MODO BOILERPLATE ACTIVO. Cargando datos simulados para ${creationId}`
    );
    creationData = getBoilerplateCreation();
  } else {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      logger.warn(
        `[BuilderPage] Usuario no autenticado intentando acceder a ${creationId}. Redirigiendo a login.`
      );
      return redirect(`/login?next=/builder/${creationId}`);
    }

    logger.trace(`[BuilderPage] Sesión de usuario validada, cargando datos.`, {
      userId: user.id,
    });
    creationData = await getCreationById(creationId, user.id);
  }

  if (!creationData) {
    logger.warn(
      `[BuilderPage] No se encontró la 'creation' o el usuario no tiene permisos.`,
      { creationId }
    );
    notFound();
  }

  // Transforma los datos de la DB al formato que espera el store.
  const contentFromDb = (creationData.content as Partial<CampaignConfig>) || {};
  const creationConfig: CampaignConfig = {
    id: creationData.id,
    name: creationData.name,
    site_id: null, // Las 'Creations' son soberanas y no tienen site_id.
    theme: contentFromDb.theme || { globalFont: "Inter", globalColors: {} },
    blocks: contentFromDb.blocks || [],
  };

  logger.info(
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
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 10.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Futuras
 * 1. **Esqueleto de Carga (`loading.tsx`)**: ((Vigente)) Crear un archivo `loading.tsx` en este directorio con un esqueleto de carga de alta fidelidad del layout de 3 (o 4) columnas para proporcionar un feedback visual instantáneo al usuario mientras los datos se cargan, mejorando el LCP.
 * 2. **Internacionalización Completa de Metadata**: ((Vigente)) Las claves de i18n `metadata_default_title` y `metadata_editing_prefix` deben ser añadidas al schema de Zod de `pages.BuilderPage` y a los archivos de mensajes.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Importación de `BuilderLayout`**: ((Implementada)) Se ha añadido la declaración de importación para `BuilderLayout`, resolviendo el error `TS2304`.
 *
 * =====================================================================
 */
// src/app/[locale]/builder/[creationId]/page.tsx
