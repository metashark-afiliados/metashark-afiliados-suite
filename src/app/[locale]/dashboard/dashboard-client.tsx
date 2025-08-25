// src/app/[locale]/dashboard/dashboard-client.tsx
/**
 * @file dashboard-client.tsx
 * @description Orquestador de UI de cliente para el "Hub Creativo". Ensambla los
 *              componentes atómicos de la página principal del dashboard. Su
 *              arquitectura de importación ha sido refactorizada para usar rutas
 *              directas a los módulos, eliminando la dependencia de archivos
 *              barril (`index.ts`) para prevenir dependencias circulares.
 * @author Raz Podestá
 * @version 7.0.0
 */
"use client";

import { useTranslations } from "next-intl";

// --- INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA: IMPORTACIONES ATÓMICAS ---
import { ActionDock } from "@/components/dashboard/ActionDock";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { WelcomeHero } from "@/components/dashboard/WelcomeHero";
// --- FIN DE REFACTORIZACIÓN ARQUITECTÓNICA ---
import { useDashboard } from "@/lib/context/DashboardContext";
import { logger } from "@/lib/logging";

/**
 * @public
 * @component DashboardClient
 * @description Componente de cliente que consume el `DashboardContext` y ensambla la UI principal.
 * @returns {React.ReactElement}
 */
export function DashboardClient(): JSX.Element {
  logger.trace("[DashboardClient] Renderizando orquestador de UI.");
  const t = useTranslations("app.[locale].dashboard.page");
  const { user, recentCampaigns } = useDashboard();

  const username = user.user_metadata?.full_name || user.email || "User";

  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <WelcomeHero
        username={username}
        searchPlaceholder={t("welcomeHero.searchPlaceholder")}
      />
      <ActionDock />
      <RecentActivity recentCampaigns={recentCampaigns} />
    </div>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Estabilidad de Módulo (Prevención de Dependencia Circular)**: ((Implementada)) Se han refactorizado las importaciones para que apunten directamente a los archivos de los componentes, en lugar de a un archivo barril. Esta es la solución arquitectónica de élite para prevenir errores de `undefined` en tiempo de ejecución causados por dependencias circulares.
 *
 * @subsection Melhorias Futuras
 * 1. **Renderizado Condicional Basado en Plan**: ((Vigente)) Este orquestador podría ser extendido para leer el `profile.plan_type` del contexto y renderizar condicionalmente ciertos módulos (ej. un `UpsellBanner`) si el usuario está en el plan gratuito.
 * 2. **Personalización del Layout (Drag-and-Drop)**: ((Vigente)) Para una personalización de élite, se podría reintroducir `dnd-kit` aquí para permitir al usuario reordenar los componentes `WelcomeHero`, `ActionDock`, y `RecentActivity`, guardando el orden en la columna `dashboard_layout` de la tabla `profiles`.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/dashboard-client.tsx
