/**
 * @file dashboard-usage-card-group.tsx
 * @description Componente de UI atómico y de presentación 100% puro.
 *              Ha sido refactorizado a un estándar de élite para ser
 *              completamente agnóstico al contenido, recibiendo un array
 *              de tarjetas de métricas a través de props.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clientLogger } from "@/lib/logging";

/**
 * @public
 * @interface UsageCardData
 * @description Define el contrato de datos para una única tarjeta de métrica.
 */
export interface UsageCardData {
  title: string;
  icon: React.ReactNode;
  value: string | number;
  change: string;
}

/**
 * @public
 * @interface DashboardUsageCardGroupProps
 * @description Contrato de props para el componente.
 */
export interface DashboardUsageCardGroupProps {
  cards: UsageCardData[];
}

/**
 * @public
 * @component DashboardUsageCardGroup
 * @description Renderiza un grupo de tarjetas con métricas de uso clave.
 * @param {DashboardUsageCardGroupProps} props - Propiedades para configurar el componente.
 * @returns {React.ReactElement}
 */
export function DashboardUsageCardGroup({
  cards,
}: DashboardUsageCardGroupProps): React.ReactElement {
  clientLogger.trace("[DashboardUsageCardGroup] Renderizando componente.");

  return (
    <div className={"grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2"}>
      {cards.map((card) => (
        <Card
          key={card.title}
          className={"bg-background/50 backdrop-blur-[24px] border-border p-6"}
        >
          <CardHeader className="p-0 space-y-0">
            <CardTitle className="flex justify-between items-center mb-6">
              <span className={"text-base leading-4"}>{card.title}</span>
              {card.icon}
            </CardTitle>
          </CardHeader>
          <CardContent className={"p-0"}>
            <p className={"text-[32px] leading-[32px] text-primary"}>
              {card.value}
            </p>
            <div className="text-sm leading-[14px] pt-2 text-muted-foreground">
              {card.change}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente de Presentación Puro**: ((Implementada)) El componente ahora es 100% agnóstico al contenido, adhiriéndose a la "Filosofía LEGO". El componente padre (`dashboard-client.tsx`) es ahora responsable de ensamblar los datos.
 * 2. **Full Internacionalización**: ((Implementada)) Se ha eliminado todo el texto codificado en duro, resolviendo la brecha de internacionalización.
 *
 * @subsection Melhorias Futuras
 * 1. **Animación de Contador**: ((Vigente)) El valor numérico de la tarjeta podría ser animado usando `framer-motion` para "contar hacia arriba" cuando la tarjeta se hace visible, similar al componente `Metrics`.
 * 2. **Tooltips Explicativos**: ((Vigente)) Se podría añadir un `Tooltip` a cada tarjeta que ofrezca una explicación más detallada de lo que significa cada métrica.
 *
 * =====================================================================
 */
