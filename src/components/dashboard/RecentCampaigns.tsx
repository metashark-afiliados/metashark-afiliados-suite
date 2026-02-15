/**
 * @file src/components/dashboard/RecentCampaigns.tsx
 * @description Aparato de UI atómico que renderiza la sección de campañas recientes.
 *              Ha sido refactorizado a un estándar de élite para alinearse con
 *              la SSoT de enrutamiento canónica (`navigation.ts`), utilizando
 *              el `pathname` y los `params` correctos para la navegación.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useFormatter, useTranslations } from "next-intl";
import { Plus, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { clientLogger } from "@/lib/logging";
import { useRouter } from "@/lib/navigation";
import { type Tables } from "@/lib/types/database";

/**
 * @public
 * @component RecentCampaigns
 * @description Renderiza una cuadrícula con las campañas modificadas recientemente
 *              o un estado vacío si no hay campañas. Las tarjetas de campaña son
 *              interactivas y navegan al constructor al hacer clic.
 * @param {object} props - Propiedades del componente.
 * @param {Tables<"campaigns">[]} props.campaigns - Un array de objetos de campaña.
 * @returns {React.ReactElement}
 */
export function RecentCampaigns({
  campaigns,
}: {
  campaigns: Tables<"campaigns">[];
}) {
  const format = useFormatter();
  const router = useRouter();
  const t = useTranslations("DashboardPage.RecentCampaigns");

  const handleNavigate = (campaign: Tables<"campaigns">) => {
    clientLogger.trace(
      `[RecentCampaigns] Navegando al builder para la campaña: ${campaign.name}`,
      { creationId: campaign.id }
    );
    // --- INICIO DE CORRECCIÓN DE ENRUTAMIENTO (TS2820) ---
    router.push({
      pathname: "/builder/[creationId]",
      params: { creationId: campaign.id },
    });
    // --- FIN DE CORRECCIÓN DE ENRUTAMIENTO (TS2820) ---
  };

  if (campaigns.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">{t("emptyState.title")}</h2>
        <Card className="border-primary/40 border-dashed bg-primary/5">
          <CardHeader className="flex-row items-center gap-4">
            <Zap className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-bold">{t("emptyState.ctaTitle")}</h3>
              <p className="text-muted-foreground text-sm">
                {t("emptyState.ctaDescription")}
              </p>
            </div>
            <Button
              className="ml-auto"
              onClick={() => {
                router.push("/dashboard/sites");
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("emptyState.ctaButton")}
            </Button>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{t("title")}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {campaigns.map((campaign) => (
          <Card
            key={campaign.id}
            className="group cursor-pointer hover:border-primary/40"
            onClick={() => handleNavigate(campaign)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleNavigate(campaign);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Continuar trabajando en ${campaign.name}`}
          >
            <CardHeader>
              <h3 className="font-semibold truncate">{campaign.name}</h3>
              <p className="text-sm text-muted-foreground">
                {t("lastEdited")}:{" "}
                {format.relativeTime(
                  new Date(campaign.updated_at || campaign.created_at)
                )}
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-24 bg-muted rounded-md flex items-center justify-center">
                <span className="text-xs text-muted-foreground">
                  {t("preview")}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Enrutamiento**: ((Implementada)) Se han corregido el `pathname` y los `params` en la llamada a `router.push`, alineando el componente con la SSoT de `navigation.ts` y resolviendo los errores de tipo `TS2820`.
 * 2. **Abstracción de Lógica**: ((Implementada)) La lógica de navegación se ha extraído a una función `handleNavigate` para adherirse al principio DRY.
 * 3. **Observabilidad Mejorada**: ((Implementada)) Se ha añadido `clientLogger.trace` para registrar la interacción del usuario, mejorando la visibilidad del flujo de navegación.
 *
 * @subsection Melhorias Futuras
 * 1. **Previsualizaciones de Campañas**: ((Vigente)) La `CardContent` podría mostrar una miniatura real de la campaña en lugar de un placeholder, requiriendo una Server Action para generar y almacenar una captura de pantalla del `content`.
 *
 * =====================================================================
 */
