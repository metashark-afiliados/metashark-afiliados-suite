// src/lib/hooks/useWelcomeHero.ts
/**
 * @file src/lib/hooks/useWelcomeHero.ts
 * @description Hook Soberano que encapsula la lógica de negocio y de estado
 *              para el componente `WelcomeHero` del "Hub Creativo". Orquesta
 *              el consumo de datos de sesión, el estado de la paleta de comandos
 *              y la internacionalización, proveyendo una API limpia para la UI.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useMemo } from "react";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useCommandPaletteStore } from "@/lib/hooks/use-command-palette";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logging";

/**
 * @public
 * @function useWelcomeHero
 * @description Hook que provee toda la lógica y estado necesarios para el `WelcomeHero`.
 * @returns Un objeto con los datos computados, manejadores de eventos y la función
 *          de traducción para ser consumidos por el componente de presentación.
 */
export function useWelcomeHero() {
  clientLogger.trace("[useWelcomeHero] Hook soberano inicializado.");

  const { user } = useDashboard();
  const t = useTypedTranslations("components.dashboard.WelcomeHero");
  const openCommandPalette = useCommandPaletteStore((state) => state.open);

  const username = useMemo(() => {
    return user.user_metadata?.full_name?.split(" ")[0] || user.email || "User";
  }, [user]);

  return {
    t,
    username,
    openCommandPalette,
  };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Saludo Contextual por Hora del Día**: Extender el hook para determinar la hora actual del cliente y devolver una clave de i18n dinámica (ej. `title_morning`, `title_afternoon`) para un saludo más personalizado.
 * 2. **Estado de Carga de Contexto**: Si los datos del `DashboardContext` pudieran ser nulos inicialmente, este hook podría manejar ese estado de carga y devolver un flag `isLoading` para que la UI muestre un esqueleto.
 * 3. **Filtrado de Pestañas por Permisos**: El hook podría filtrar las pestañas (`tabs`) a mostrar basándose en el `plan_type` del usuario, ocultando pestañas de características "Pro" para usuarios del plan gratuito.
 * 4. **A/B Testing de Saludos**: Integrar con un servicio de feature flags para devolver diferentes variantes del texto del título, permitiendo realizar pruebas A/B sobre el engagement del usuario.
 * 5. **Internacionalización de Roles**: Para saludos más formales, el hook podría acceder al rol del usuario y construir un saludo que incluya el rol traducido (ej. "Bienvenido, Desarrollador Raz").
 * =====================================================================
 */
// src/lib/hooks/useWelcomeHero.ts
