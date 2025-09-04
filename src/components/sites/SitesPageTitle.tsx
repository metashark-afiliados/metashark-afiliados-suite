// src/components/sites/SitesPageTitle.tsx
/**
 * @file SitesPageTitle.tsx
 * @description Aparato de UI atómico y soberano. Su única responsabilidad es
 *              renderizar el título y la descripción de la página "Mis Sitios",
 *              consumiendo sus propias traducciones.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logger";

export function SitesPageTitle() {
  clientLogger.trace(
    "[SitesPageTitle] Renderizando componente de título soberano."
  );
  const t = useTypedTranslations("components.sites.SitesHeader");

  return (
    <div>
      <h1 className="text-2xl font-bold">{t("title")}</h1>
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
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este nuevo aparato aísla perfectamente la responsabilidad de renderizar el título de la página, desacoplándolo de los controles de acción y adhiriéndose a la "Filosofía LEGO".
 * 2. **Soberanía de I18n**: ((Implementada)) El componente es autocontenido en su consumo de traducciones, mejorando la modularidad.
 *
 * @subsection Melhorias Futuras
 * 1. **Título Dinámico**: ((Vigente)) El componente podría aceptar una prop `titleOverride?: string` para permitir que el título sea dinámico (ej. "Sitios en 'Mi Workspace'"), haciéndolo aún más reutilizable. Propondré esta mejora en la siguiente fase de refactorización de la UI.
 *
 * =====================================================================
 */
// src/components/sites/SitesPageTitle.tsx
