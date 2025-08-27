/**
 * @file dashboard-client.tsx
 * @description Orquestador de UI de élite para el "Hub Creativo". Ha sido
 *              refactorizado a su estado canónico: un ensamblador 100% puro
 *              que compone componentes soberanos. No contiene lógica de
 *              negocio, estado o i18n, cumpliendo con el Principio de
 *              Responsabilidad Única al más alto nivel.
 * @author Raz Podestá - MetaShark Tech
 * @version 9.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { ActionDock } from "@/components/dashboard/ActionDock";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { WelcomeHero } from "@/components/dashboard/WelcomeHero";
import { clientLogger } from "@/lib/logging";

export function DashboardClient(): JSX.Element {
  clientLogger.trace(
    "[DashboardClient] Renderizando ensamblador de UI puro para el Hub Creativo."
  );
  return (
    <>
      <WelcomeHero />
      <ActionDock />
      <RecentActivity />
    </>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Simplificación Radical (SRP)**: ((Implementada)) El componente ha sido despojado de toda lógica y ahora es un ensamblador puro. Su única responsabilidad es componer la UI, lo cual es la culminación de la refactorización de sus hijos.
 * 2. **Desacoplamiento Completo**: ((Implementada)) Al no pasar props ni consumir hooks de i18n, este componente está completamente desacoplado de sus hijos, lo que permite modificar cualquiera de ellos sin impactar al orquestador.
 *
 * @subsection Melhorias Futuras
 * 1. **Layout de Dashboard Personalizable**: ((Vigente)) La mejora de élite para este aparato es permitir que los usuarios reordenen las secciones (`WelcomeHero`, `ActionDock`, etc.). Esto se puede lograr haciendo que este componente lea una configuración de layout (un array de IDs de componente) desde el `useDashboardUIStore` (que a su vez lo leería de `profile.dashboard_layout`) y renderice los componentes en el orden especificado por el usuario. Propondré implementar esta característica en una futura épica de "Personalización de UI".
 * 2. **Renderizado Condicional Basado en Datos**: ((Pendiente)) El componente podría consumir el `useDashboard` hook para tomar decisiones de renderizado, como no renderizar `<RecentActivity />` si `recentCampaigns` está vacío, evitando así renderizar una sección vacía y manteniendo la UI más limpia.
 *
 * =====================================================================
 */
