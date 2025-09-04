// src/components/dashboard/landing/components/dashboard-tutorial-card.tsx
/**
 * @file dashboard-tutorial-card.tsx
 * @description Componente de UI de presentación puro. Ha sido refactorizado a un
 *              estándar de élite para ser un ensamblador 100% agnóstico al
 *              contenido, consumiendo el hook soberano `useTutorialCard`
 *              para obtener todos sus textos y cumplir con el protocolo de
 *              "Full Internacionalización".
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
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
import { useTutorialCard } from "@/lib/hooks/useTutorialCard";
import { clientLogger } from "@/lib/logger";

/**
 * @public
 * @component DashboardTutorialCard
 * @description Renderiza una tarjeta estática con un llamado a la acción para
 *              ver tutoriales o documentación. Es un componente de presentación
 *              puro que delega toda su lógica al hook `useTutorialCard`.
 * @returns {React.ReactElement}
 */
export function DashboardTutorialCard(): React.ReactElement {
  clientLogger.trace(
    "[DashboardTutorialCard] Renderizando componente de presentación puro."
  );

  const { title, description, buttonText, buttonHref } = useTutorialCard();

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
 * @subsection Melhorias Futuras
 * 1. **Icono Dinámico**: El icono `ArrowUpRight` está codificado en duro. El componente podría ser mejorado para aceptar una prop `buttonIconName: LucideIconName` desde el hook `useTutorialCard` y renderizarlo con `DynamicIcon` para una mayor flexibilidad y consistencia.
 * 2. **Esqueleto de Carga (Skeleton)**: Si el hook `useTutorialCard` implementara un estado `isLoading`, este componente debería renderizar un `CardSkeleton` para mejorar la UX de carga.
 * 3. **Pruebas Unitarias**: Este componente, ahora puro, es un candidato ideal para pruebas unitarias con Vitest y React Testing Library. Se puede mockear el hook `useTutorialCard` para proveer diferentes textos y verificar que la UI se renderiza correctamente.
 * 4. **Animación de Entrada**: Envolver la `Card` en `motion.div` de Framer Motion para añadir una animación de entrada sutil, mejorando la estética y el dinamismo del "Hub Creativo".
 * 5. **Componente `CardAction` Atómico**: El `div` que contiene el `Button` con el `SmartLink` podría ser extraído a un componente `CardAction.tsx` si este patrón de "botón con enlace" se repite en otras tarjetas del dashboard.
 * =====================================================================
 */
// src/components/dashboard/landing/components/dashboard-tutorial-card.tsx
