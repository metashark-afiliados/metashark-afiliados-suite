// src/components/sites/SitesPageTitle.tsx
/**
 * @file SitesPageTitle.tsx
 * @description Aparato de UI atómico y soberano. Ha sido refactorizado a un
 *              estándar de élite para aceptar una prop `titleOverride` opcional,
 *              permitiendo que su título sea dinámico y controlado por un
 *              orquestador, o que consuma su propio contenido de i18n por defecto.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logging";

/**
 * @public
 * @interface SitesPageTitleProps
 * @description Contrato de props para el componente.
 */
export interface SitesPageTitleProps {
  /**
   * @property {string} [titleOverride]
   * @description Si se proporciona, este string sobrescribirá el título
   *              obtenido del archivo de internacionalización.
   */
  titleOverride?: string;
}

export function SitesPageTitle({ titleOverride }: SitesPageTitleProps) {
  const t = useTypedTranslations("components.sites.SitesHeader");

  const displayTitle = titleOverride || t("title");

  clientLogger.trace(
    "[SitesPageTitle] Renderizando componente de título soberano.",
    {
      source: titleOverride ? "prop" : "i18n",
      title: displayTitle,
    }
  );

  return (
    <div>
      <h1 className="text-2xl font-bold">{displayTitle}</h1>
      <p className="text-muted-foreground">{t("description")}</p>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Título Dinámico y Reutilización Mejorada**: ((Implementada)) El componente ahora acepta una prop `titleOverride`, cumpliendo la directiva. Esto lo transforma de un componente específico para "Mis Sitios" a un componente de título de página genérico y reutilizable, capaz de manejar tanto contenido estático (desde i18n) como dinámico (desde props).
 * 2. **Observabilidad Mejorada**: ((Implementada)) El `clientLogger` ahora registra la fuente del título (`prop` o `i18n`), proporcionando una visibilidad de élite sobre el comportamiento del componente para una depuración más sencilla.
 */