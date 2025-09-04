// src/components/dashboard/landing/components/dashboard-subscription-card-group.tsx
/**
 * @file dashboard-subscription-card-group.tsx
 * @description Orquestador de UI de élite. Ha sido refactorizado a un componente
 *              de presentación 100% puro que consume el hook soberano
 *              `useSubscriptionData`, delegando toda la lógica de estado y
 *              adaptación de datos, y cumpliendo con el SRP al más alto nivel.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import Link from "next/link";

import { ErrorContent } from "@/components/dashboard/layout/error-content";
import { SubscriptionCards } from "@/components/dashboard/subscriptions/components/subscription-cards";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardSkeleton,
  CardTitle,
} from "@/components/ui/card";
import { useSubscriptionData } from "@/lib/hooks/useSubscriptionData";
import { clientLogger } from "@/lib/logger";

/**
 * @public
 * @component DashboardSubscriptionCardGroup
 * @description Orquesta la UI para la sección de suscripciones del dashboard.
 *              Es un componente de presentación puro que delega toda su lógica
 *              al hook `useSubscriptionData`.
 * @returns {React.ReactElement}
 */
export function DashboardSubscriptionCardGroup() {
  clientLogger.trace(
    "[DashboardSubscriptionCardGroup] Renderizando componente de presentación puro."
  );

  const { subscriptions, t, isLoading } = useSubscriptionData();

  if (isLoading) {
    return <CardSkeleton className="p-6 h-48" />;
  }

  if (!subscriptions.length) {
    return <ErrorContent />;
  }

  return (
    <Card className={"bg-background/50 backdrop-blur-[24px] border-border p-6"}>
      <CardHeader className="p-0 space-y-0">
        <CardTitle className="flex justify-between items-center pb-6 border-border border-b">
          <span className={"text-xl font-medium"}>{t("title")}</span>
          <Button
            asChild={true}
            size={"sm"}
            variant={"outline"}
            className={"text-sm rounded-sm border-border"}
          >
            <Link href={"/dashboard/subscriptions"}>
              {t("view_all_button")}
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className={"p-0 pt-6 @container"}>
        <SubscriptionCards
          className={"grid-cols-1 gap-6 @[600px]:grid-cols-2"}
          subscriptions={subscriptions}
        />
      </CardContent>
    </Card>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Estado Vacío Específico**: En lugar de `ErrorContent`, crear un componente `EmptyState` específico para cuando un usuario no tiene suscripciones, con un CTA claro para "Ver Planes" o "Actualizar Plan".
 * 2. **Pruebas Unitarias Aisladas**: Este componente ahora es ideal para pruebas unitarias. Se puede mockear el hook `useSubscriptionData` para devolver diferentes escenarios (cargando, sin suscripciones, con suscripción Pro) y verificar que la UI se renderiza correctamente en cada caso.
 * 3. **Animación de Entrada**: Envolver la `Card` principal en `motion.div` de Framer Motion para añadir una animación de entrada sutil, en línea con el resto de los componentes del "Hub Creativo".
 * 4. **Componente `CardHeaderAction` Atómico**: El `CardTitle` con el botón "Ver Todo" es un patrón reutilizable. Podría ser extraído a un componente `CardHeaderAction` que acepte `title` y `actionSlot` como props.
 * 5. **Accesibilidad de Enlace**: El `Link` de "Ver Todo" debería tener un `aria-label` más descriptivo, ej. "Ver todas las suscripciones", que podría ser provisto por el hook.
 * =====================================================================
 */
// src/components/dashboard/landing/components/dashboard-subscription-card-group.tsx
