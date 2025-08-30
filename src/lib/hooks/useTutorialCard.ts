// src/lib/hooks/useTutorialCard.ts
/**
 * @file src/lib/hooks/useTutorialCard.ts
 * @description Hook Soberano que encapsula la lógica de consumo de datos de i18n
 *              para el componente `DashboardTutorialCard`. Provee una API limpia
 *              y desacoplada con todo el contenido necesario para la UI.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logging";

/**
 * @public
 * @function useTutorialCard
 * @description Hook que provee toda la lógica y datos necesarios para el `DashboardTutorialCard`.
 * @returns Un objeto con los textos y URLs internacionalizados para ser consumidos
 *          por el componente de presentación.
 */
export function useTutorialCard() {
  clientLogger.trace("[useTutorialCard] Hook soberano inicializado.");

  const t = useTypedTranslations("components.dashboard.DashboardTutorialCard");

  return {
    title: t("title"),
    description: t("description"),
    buttonText: t("buttonText"),
    buttonHref: t("buttonHref"),
  };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **URL de Documentación Dinámica**: El `buttonHref` podría ser construido dinámicamente basándose en el `locale` actual del usuario para dirigirlo a la versión localizada de la documentación (ej. `/es-ES/docs`), si la estructura de rutas lo soporta.
 * 2. **Contexto de Usuario**: El hook podría consumir el `useDashboard` context para obtener el `plan_type` del usuario y devolver un `buttonHref` diferente que apunte a tutoriales "Pro" para usuarios premium.
 * 3. **A/B Testing de CTAs**: Integrar con un servicio de feature flags para devolver diferentes variantes de `buttonText` y `buttonHref`, permitiendo realizar pruebas A/B sobre qué llamado a la acción es más efectivo.
 * 4. **Estado de Carga**: Si los textos o la URL se cargaran de forma asíncrona (ej. desde un CMS), el hook debería manejar y devolver un estado `isLoading`.
 * 5. **Manejo de Errores**: En caso de una carga asíncrona, el hook debería manejar los errores y devolver un estado de error para que la UI pueda mostrar un mensaje apropiado.
 * =====================================================================
 */
// src/lib/hooks/useTutorialCard.ts
