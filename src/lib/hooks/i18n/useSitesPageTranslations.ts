// src/lib/hooks/i18n/useSitesPageTranslations.ts
/**
 * @file useSitesPageTranslations.ts
 * @description Hook de traducción soberano y de élite para el ecosistema
 *              "Mis Sitios". Es la SSoT para el consumo de i18n en esta área,
 *              cargando únicamente los namespaces que necesita y memoizando su
 *              retorno para un rendimiento óptimo.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useMemo } from "react";
import { useFormatter } from "next-intl";

import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logging";

/**
 * @public
 * @function useSitesPageTranslations
 * @description Hook que carga y devuelve las funciones de traducción
 *              específicas para el módulo "Mis Sitios" y sus dependencias compartidas.
 * @returns Un objeto estable que contiene las funciones `t` para los namespaces requeridos.
 */
export function useSitesPageTranslations() {
  clientLogger.trace(
    "[useSitesPageTranslations] Inicializando hook de i18n soberano."
  );

  const tSitesPage = useTypedTranslations("app.[locale].dashboard.sites.page");
  const tDialogs = useTypedTranslations("components.ui.Dialogs");
  const tErrors = useTypedTranslations("shared.ValidationErrors");
  const tFormatter = useFormatter();

  return useMemo(
    () => ({
      tSitesPage,
      tDialogs,
      tErrors,
      tFormatter,
    }),
    [tSitesPage, tDialogs, tErrors, tFormatter]
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Abstracción Granular (SRP)**: Este nuevo hook es altamente cohesivo. Su única responsabilidad es proveer las traducciones para el dominio "Mis Sitios". Esto resuelve la causa raíz de los errores `TS2345` al asegurar que todos los namespaces requeridos estén disponibles y correctamente tipados.
 * 2. ((Implementada)) **Optimización de Rendimiento (Memoización)**: El objeto de retorno está envuelto en `React.useMemo`, garantizando la estabilidad referencial. Esto es una optimización de élite que previene re-renderizados innecesarios en componentes consumidores memoizados.
 * 3. ((Implementada)) **API de Traducción Específica de Dominio**: El hook expone una API clara (`tSitesPage`, `tDialogs`) que es semánticamente relevante para los componentes que la consumirán, mejorando la legibilidad del código.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Factoría de Hooks de Traducción**: Para una reutilización de código de nivel superior, se podría crear una factoría `createTranslationsHook<T extends (keyof Messages)[]>([...namespaces])`. Esta factoría recibiría un array de namespaces y devolvería un hook memoizado que carga solo esos namespaces. Esto eliminaría la duplicación de la lógica `useMemo` en cada hook soberano.
 *
 * =====================================================================
 */
// src/lib/hooks/i18n/useSitesPageTranslations.ts
