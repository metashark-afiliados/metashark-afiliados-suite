// src/lib/hooks/useTutorialCard.ts
/**
 * @file useTutorialCard.ts
 * @description Hook Soberano que encapsula la lógica de consumo de datos de i18n
 *              para el componente `DashboardTutorialCard`. Provee una API limpia,
 *              desacoplada y fuertemente tipada con todo el contenido necesario para la UI.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
"use client";

import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logging";
import { type Route } from "@/lib/navigation";

/**
 * @public
 * @interface UseTutorialCardReturn
 * @description El contrato de datos de retorno del hook `useTutorialCard`.
 *              Define la forma de los datos que el componente de UI consumirá.
 */
export interface UseTutorialCardReturn {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: Route;
}

/**
 * @public
 * @function useTutorialCard
 * @description Hook que provee toda la lógica y datos necesarios para el `DashboardTutorialCard`.
 * @returns {UseTutorialCardReturn} Un objeto con los textos y URLs internacionalizados
 *          para ser consumidos por el componente de presentación.
 */
export function useTutorialCard(): UseTutorialCardReturn {
  const t = useTypedTranslations("components.dashboard.DashboardTutorialCard");

  const buttonHref = t("buttonHref") as Route;

  clientLogger.trace("[useTutorialCard] Hook soberano inicializado.", {
    resolvedHref: buttonHref,
  });

  return {
    title: t("title"),
    description: t("description"),
    buttonText: t("buttonText"),
    buttonHref: buttonHref,
  };
}
// src/lib/hooks/useTutorialCard.ts
