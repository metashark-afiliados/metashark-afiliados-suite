// src/components/dashboard/landing/components/dashboard-tutorial-card.tsx
/**
 * @file dashboard-tutorial-card.tsx
 * @description Componente de UI atómico y de presentación 100% puro.
 *              Ha sido refactorizado a un estándar de élite para ser
 *              completamente agnóstico al contenido y para corregir un
 *
 *              error de composición (TS2322) con el componente `SmartLink`.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.1.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { ArrowUpRight } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SmartLink } from "@/components/ui/SmartLink";
import { clientLogger } from "@/lib/logging";

/**
 * @public
 * @interface DashboardTutorialCardProps
 * @description Contrato de props para el componente. Define todo el contenido
 *              necesario para renderizar la tarjeta.
 */
export interface DashboardTutorialCardProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: any; // `any` para compatibilidad con el `Link` de next-intl
}

/**
 * @public
 * @component DashboardTutorialCard
 * @description Renderiza una tarjeta estática con un llamado a la acción para
 *              ver tutoriales o documentación.
 * @param {DashboardTutorialCardProps} props - Propiedades para configurar la tarjeta.
 * @returns {React.ReactElement}
 */
export function DashboardTutorialCard({
  title,
  description,
  buttonText,
  buttonHref,
}: DashboardTutorialCardProps): React.ReactElement {
  clientLogger.trace(
    "[DashboardTutorialCard] Renderizando componente de presentación puro."
  );

  return (
    <Card className={"bg-background/50 backdrop-blur-[24px] border-border p-6"}>
      <CardHeader className="p-0 space-y-0">
        <CardTitle className="flex justify-between items-center text-xl mb-2 font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={"p-0 flex flex-col gap-6"}>
        <div className="text-base leading-6 text-muted-foreground">
          {description}
        </div>
        <div>
          <Button
            asChild={true}
            size={"sm"}
            variant={"outline"}
            className={"flex gap-2 text-sm rounded-sm border-border"}
          >
            <SmartLink
              href={buttonHref}
              label={
                <>
                  {buttonText}
                  <ArrowUpRight
                    size={16}
                    className={"ml-2 text-muted-foreground"}
                  />
                </>
              }
            />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 2.1.0
 * @date 2025-08-29
 *
 * @section Melhorias Futuras
 * 1. ((Vigente)) **Icono Dinámico:** El icono `ArrowUpRight` está codificado en duro. El componente podría ser mejorado para aceptar una prop `buttonIconName: LucideIconName` y renderizarlo con `DynamicIcon` para una mayor flexibilidad y consistencia con el resto de la UI.
 *
 * =====================================================================
 */
// src/components/dashboard/landing/components/dashboard-tutorial-card.tsx
