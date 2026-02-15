/**
 * @file dashboard-tutorial-card.tsx
 * @description Componente de UI atómico y de presentación 100% puro.
 *              Ha sido refactorizado a un estándar de élite para ser
 *              completamente agnóstico al contenido y para corregir un
 *              error de composición (TS2322) con el componente `SmartLink`.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.1.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { ArrowUpRight } from "lucide-react";

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
  clientLogger.trace("[DashboardTutorialCard] Renderizando componente.");

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
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Compilación (TS2322)**: ((Implementada)) Se ha corregido el patrón de composición del componente `SmartLink`. El icono `ArrowUpRight` ahora se pasa como parte de la prop `label`, en lugar de como `children`, alineando el uso con el contrato de la API de `SmartLink` y resolviendo el error de tipo.
 * 2. **Componente de Presentación Puro**: ((Implementada)) El componente ahora es 100% agnóstico al contenido, adhiriéndose a la "Filosofía LEGO".
 * 3. **Full Internacionalización**: ((Implementada)) Se ha eliminado todo el texto codificado en duro, resolviendo la brecha de internacionalización.
 * 4. **Full Observabilidad**: ((Implementada)) Se ha añadido `clientLogger` para trazar el renderizado del componente.
 *
 * @subsection Melhorias Futuras
 * 1. **Icono Dinámico**: ((Vigente)) El icono `ArrowUpRight` está codificado. El componente podría ser mejorado para aceptar una prop `iconName: LucideIconName` y renderizarlo con `DynamicIcon` para una mayor flexibilidad.
 *
 * =====================================================================
 */
