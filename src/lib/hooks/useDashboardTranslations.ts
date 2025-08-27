// src/lib/hooks/useDashboardTranslations.ts
/**
 * @file useDashboardTranslations.ts
 * @description Hook soberano y SSoT para i18n en el Dashboard. Ha sido
 *              refactorizado a un estándar de élite para memoizar su objeto de
 *              retorno, garantizando la estabilidad referencial y optimizando el
 *              rendimiento de los componentes consumidores que utilizan React.memo.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
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
 * @function useDashboardTranslations
 * @description Hook que carga y devuelve todas las funciones de traducción
 *              necesarias para el layout principal del dashboard y sus
 *              componentes hijos. Es la SSoT para el consumo de i18n en el cliente.
 *              Su valor de retorno está memoizado para optimizar el rendimiento.
 * @returns Un objeto estable que contiene las funciones `t` para cada namespace requerido.
 */
export function useDashboardTranslations() {
  clientLogger.trace(
    "[useDashboardTranslations] Inicializando hook SSoT de i18n."
  );

  const tSidebar = useTypedTranslations("components.layout.DashboardSidebar");
  const tHeader = useTypedTranslations("components.layout.DashboardHeader");
  const tWorkspaces = useTypedTranslations(
    "components.workspaces.WorkspaceSwitcher"
  );
  const tDialogs = useTypedTranslations("components.ui.Dialogs");
  const tErrors = useTypedTranslations("shared.ValidationErrors");
  const tActionDock = useTypedTranslations("shared.ActionDock");
  const tDashboardPage = useTypedTranslations("app.[locale].dashboard.page");
  const tSitesPage = useTypedTranslations("app.[locale].dashboard.sites.page");
  const tFormatter = useFormatter();

  return useMemo(
    () => ({
      tSidebar,
      tHeader,
      tWorkspaces,
      tDialogs,
      tErrors,
      tActionDock,
      tDashboardPage,
      tSitesPage,
      tFormatter,
    }),
    [
      tSidebar,
      tHeader,
      tWorkspaces,
      tDialogs,
      tErrors,
      tActionDock,
      tDashboardPage,
      tSitesPage,
      tFormatter,
    ]
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **SSoT de I18n Centralizada**: ((Implementada)) El hook ahora carga todos los namespaces requeridos por el ecosistema del dashboard, resolviendo la causa raíz de la cascada de errores `TS2345` al proporcionar una fuente de verdad única y completa para las traducciones.
 * 2. **Estabilidad Referencial (Memoización)**: ((Implementada)) Se ha envuelto el objeto de retorno en `React.useMemo`. Esto garantiza que el hook siempre devuelva la misma instancia del objeto a menos que una de las funciones de traducción cambie, lo cual es una optimización de rendimiento crítica para los componentes consumidores memoizados.
 *
 * @subsection Melhorias Futuras
 * 1. **Carga de Namespaces Condicional**: ((Vigente)) A futuro, si el dashboard crece, se podría refactorizar este hook para que acepte un array de `namespaces` requeridos y los cargue dinámicamente, en lugar de cargar todos siempre. Esto optimizaría el rendimiento en vistas más simples que no necesiten todos los textos.
 * 2. **Abstracción a Hooks Granulares**: ((Pendiente)) Para una máxima adhesión al SRP, este hook monolítico podría ser descompuesto en hooks más pequeños y específicos (ej. `useSitesPageTranslations`, `useSidebarTranslations`). Esto reduciría la sobrecarga de carga de namespaces para componentes que solo necesitan uno o dos. Propondré esta refactorización si el hook se vuelve un cuello de botella.
 *
 * =====================================================================
 */
// src/lib/hooks/useDashboardTranslations.ts
