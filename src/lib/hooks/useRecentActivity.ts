// src/lib/hooks/useRecentActivity.ts
/**
 * @file src/lib/hooks/useRecentActivity.ts
 * @description Hook Soberano que encapsula la lógica de negocio y de estado
 *              para el componente `RecentActivity` del "Hub Creativo". Orquesta
 *              el consumo de datos de sesión, la lógica de navegación y la
 *              internacionalización, proveyendo una API limpia para la UI.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useDashboard } from "@/lib/context/DashboardContext";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logger";
import { useRouter } from "@/lib/navigation";
import { useFormatter } from "next-intl";

/**
 * @public
 * @function useRecentActivity
 * @description Hook que provee toda la lógica y estado necesarios para el `RecentActivity`.
 * @returns Un objeto con los datos, manejadores y funciones de i18n para ser
 *          consumidos por el componente de presentación.
 */
export function useRecentActivity() {
  clientLogger.trace("[useRecentActivity] Hook soberano inicializado.");

  const { recentCampaigns } = useDashboard();
  const t = useTypedTranslations("components.dashboard.RecentActivity");
  const tFormatter = useFormatter();
  const router = useRouter();

  const handleNavigate = (creationId: string) => {
    clientLogger.trace(
      "[useRecentActivity] Navegando al builder para la creación.",
      { creationId }
    );
    router.push({
      pathname: "/builder/[creationId]",
      params: { creationId },
    });
  };

  const animationVariants = {
    STAGGER_CONTAINER: {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.07,
        },
      },
    },
    FADE_UP: {
      hidden: { opacity: 0, y: 20 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
      },
    },
  };

  return {
    recentCampaigns,
    t,
    tFormatter,
    handleNavigate,
    animationVariants,
  };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **`isEmpty` Flag Computado**: El hook podría devolver un booleano `isEmpty` (`recentCampaigns.length === 0`) para que el componente de UI no necesite contener esa lógica.
 * 2. **Límite de Campañas Configurable**: Añadir un parámetro `limit` al hook (`useRecentActivity({ limit: 5 })`) que controle cuántas campañas recientes se obtienen del contexto, haciendo el hook más flexible.
 * 3. **Manejo de Estado de Carga**: Si el `DashboardContext` pudiera tener un estado de carga, este hook debería manejarlo y devolver un flag `isLoading`, permitiendo a la UI mostrar un esqueleto de carga.
 * 4. **Pre-fetching de Datos**: Implementar una lógica de `onMouseEnter` en la tarjeta dentro del componente de UI que llame a una función `prefetchCampaign` expuesta por este hook. Esta función usaría `router.prefetch` para precargar los datos del "Builder" antes del clic, mejorando la performance percibida.
 * 5. **Abstracción de Variantes de Animación**: Centralizar las variantes de `framer-motion` en un manifiesto (`src/config/animations.config.ts`) y que este hook las importe, adhiriéndose al principio DRY.
 * =====================================================================
 */
// src/lib/hooks/useRecentActivity.ts
