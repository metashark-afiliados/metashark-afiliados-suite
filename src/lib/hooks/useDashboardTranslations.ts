// src/lib/hooks/useDashboardTranslations.ts
/**
 * @file useDashboardTranslations.ts
 * @description Hook soberano y SSoT para i18n en el Dashboard. Sincronizado
 *              para incluir todos los namespaces requeridos por el ecosistema de
 *              "Mis Sitios", resolviendo la causa raíz de errores de tipo `TS2339`.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.1.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useFormatter } from "next-intl";
import { useTypedTranslations } from "@/lib/i18n/hooks";

/**
 * @public
 * @function useDashboardTranslations
 * @description Hook que carga y devuelve todas las funciones de traducción
 *              necesarias para el layout principal del dashboard y sus
 *              componentes hijos. Es la SSoT para el consumo de i18n en el cliente.
 * @returns Un objeto que contiene las funciones `t` para cada namespace requerido.
 */
export function useDashboardTranslations() {
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

  return {
    tSidebar,
    tHeader,
    tWorkspaces,
    tDialogs,
    tErrors,
    tActionDock,
    tDashboardPage,
    tSitesPage,
    tFormatter,
  };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **SSoT de I18n Completa:** El hook ahora es la fuente de verdad para todas las traducciones del dashboard, incluyendo `tSitesPage`. Esta centralización resuelve la causa raíz de los errores de tipo `TS2339` al proveer una API de consumo consistente y completa para todos los componentes del ecosistema.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Memoización del Objeto de Retorno:** El objeto devuelto por este hook se crea en cada renderizado. Para una optimización de élite, podría ser envuelto en `React.useMemo` con un array de dependencias vacío, asegurando que la misma instancia del objeto sea devuelta en re-renderizados, lo que puede optimizar los componentes consumidores que dependen de la estabilidad referencial de este objeto.
 * 2. ((Vigente)) **Carga de Namespaces Condicional:** A futuro, si el dashboard crece, se podría refactorizar este hook para que acepte un array de `namespaces` requeridos y los cargue dinámicamente, en lugar de cargar todos siempre. Esto optimizaría el rendimiento en vistas más simples que no necesiten todos los textos.
 *
 * =====================================================================
 */
// src/lib/hooks/useDashboardTranslations.ts
