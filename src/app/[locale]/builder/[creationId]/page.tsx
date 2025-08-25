// src/app/[locale]/builder/[creationId]/page.tsx
/**
 * @file page.tsx
 * @description Página de servidor principal del constructor. Es el punto de
 *              entrada y orquestador de datos para el IDE del constructor.
 *              Su arquitectura sigue el patrón de "Carga de Datos en Servidor,
 *              Hidratación Segura en Cliente".
 * @author Raz Podestá
 * @version 8.0.0
 */
import { notFound, redirect } from "next/navigation";
import React from "react";

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

import { BuilderLayout } from "./BuilderLayout";

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
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Hydration Segura en SSR**: ((Implementada)) La página ahora envuelve el layout con `BuilderStoreProvider` y le pasa `initialState` como prop. Este es el patrón canónico que resuelve el error de `setState` en el servidor.
 * 2. **Desacoplamiento Servidor-Cliente**: ((Implementada)) Este Server Component ahora se adhiere estrictamente al SRP: su única responsabilidad es la carga de datos y la seguridad, delegando toda la lógica de UI y estado al cliente.
 * 3. **Full Observabilidad**: ((Implementada)) Se han añadido logs de `trace`, `warn` e `info` para cada punto de decisión del flujo de carga.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación de Metadatos Dinámicos**: ((Vigente)) Añadir una función `generateMetadata` a esta página que lea el `creationData.name` para establecer dinámicamente el título de la pestaña del navegador (ej. "Editando: Mi Nueva Landing Page"), mejorando el SEO y la UX.
 * 2. **Esqueleto de Carga (`loading.tsx`)**: ((Vigente)) Crear un archivo `loading.tsx` en este directorio con un esqueleto de carga de alta fidelidad del layout de 3 (o 4) columnas para proporcionar un feedback visual instantáneo al usuario mientras los datos se cargan, mejorando el LCP.
 *
 * =====================================================================
 */
// src/app/[locale]/builder/[creationId]/page.tsx
