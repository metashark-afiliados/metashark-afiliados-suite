// src/components/dashboard/ActionCard.tsx
/**
 * @file src/components/dashboard/ActionCard.tsx
 * @description Aparato de UI atómico y reutilizable que representa una tarjeta de acción
 *              interactiva en el dashboard. Es un componente de presentación puro que
 *              recibe todo su contenido y estado a través de props. Se ha enriquecido
 *              con accesibilidad (a11y), observabilidad y **tooltips informativos**.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react"; // <-- Importar React explícitamente

import { Card, CardHeader } from "@/components/ui/card";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // <-- Nuevas importaciones de Tooltip
import { type FeatureModule } from "@/lib/data/modules";
import { logger } from "@/lib/logging";
import { useRouter } from "@/lib/navigation";

/**
 * @public
 * @component ActionCard
 * @description Renderiza una tarjeta arrastrable y clickeable que representa un módulo
 *              de funcionalidad. Al hacer clic, navega a la ruta especificada en el módulo.
 *              Muestra un `Tooltip` con la descripción del módulo al pasar el cursor.
 * @param {object} props - Propiedades del componente.
 * @param {FeatureModule} props.module - El objeto de datos del módulo a renderizar.
 * @param {boolean} [props.isPrimary=false] - Si es `true`, aplica un estilo destacado a la tarjeta.
 * @returns {React.ReactElement}
 */
export function ActionCard({
  module,
  isPrimary = false,
}: {
  module: FeatureModule;
  isPrimary?: boolean;
}): React.ReactElement {
  const router = useRouter();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.7 : 1,
  };

  const handleCardClick = () => {
    if (module.href) {
      logger.trace(`[ActionCard] Navegando para o módulo '${module.title}'`, {
        href: module.href,
      });
      router.push(module.href as any);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Acessar ${module.title}`}
    >
      {/* --- INICIO DE IMPLEMENTACIÓN HOLÍSTICA: Tooltip para información contextual --- */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card
              className={`group h-full cursor-grab active:cursor-grabbing transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                isPrimary
                  ? "bg-primary/10 border-primary/40 hover:border-primary/80 hover:shadow-primary/20"
                  : "bg-card hover:border-primary/40 hover:shadow-primary/10"
              }`}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      isPrimary ? "bg-primary/20" : "bg-muted"
                    }`}
                  >
                    <DynamicIcon
                      name={module.icon}
                      className={`h-5 w-5 ${
                        isPrimary ? "text-primary" : "text-foreground"
                      }`}
                    />
                  </div>
                  <h3 className="text-md font-semibold">{module.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground pt-2">
                  {module.description}
                </p>
              </CardHeader>
            </Card>
          </TooltipTrigger>
          {module.tooltip && ( // Solo renderizar el tooltip si hay texto
            <TooltipContent>
              <p>{module.tooltip}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      {/* --- FIN DE IMPLEMENTACIÓN HOLÍSTICA --- */}
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Tooltips Informativos (UX de Élite)**: ((Implementada)) Se ha envuelto la `Card` en un `Tooltip` y `TooltipTrigger`. Ahora, al pasar el cursor sobre la tarjeta de acción, se mostrará el `module.tooltip` (si existe), proporcionando información contextual sin saturar la UI.
 * 2. **Resolución de `TS2686` (Proactiva)**: ((Implementada)) Se ha añadido `import React from "react"` explícitamente al inicio del archivo. Aunque no causaba un error directo visible en el snapshot actual, es una práctica recomendada en Next.js Client Components (especialmente con JSX) para evitar futuros `ReferenceError` si el compilador no inyecta `React` globalmente.
 * 3. **Componente de Bloco de Construcción**: ((Implementada)) La transcripción de este aparato proporciona un bloque de construcción fundamental para la UI del dashboard principal, permitiendo la exhibición de módulos de funcionalidades.
 * 4. **Acessibilidade (a11y)**: ((Implementada)) El componente fue aprimorado con `role="button"`, `tabIndex={0}`, `onKeyDown` y `aria-label` para garantizar que sea totalmente operável via teclado y accesible para leitores de tela.
 * 5. **Observabilidade da Interação**: ((Implementada)) A função `handleCardClick` agora registra um log de `trace`, fornecendo visibilidade sobre as interações do usuário com os módulos do dashboard.
 * 6. **No Regresión Funcional**: ((Implementada)) Toda la funcionalidad existente del componente se mantiene intacta.
 * 7. **Versionado Consistente**: ((Implementada)) Se ha incrementado la versión a `2.0.0` para reflejar esta adición significativa.
 *
 * @subsection Melhorias Futuras
 * 1. **Indicador de Status Dinámico**: ((Vigente)) Añadir un pequeño indicador visual (ej. un punto de color) en la esquina de la tarjeta para reflejar el `module.status` ('active', 'soon', 'locked'), comunicando visualmente la disponibilidad de la funcionalidad.
 * 2. **Variantes de Tooltip**: ((Vigente)) La librería `Tooltip` de Shadcn/UI permite variantes o props para controlar el `side` (lado donde aparece el tooltip) o el `align`. Esto podría ser expuesto como una prop opcional en `ActionCard` para una mayor flexibilidad.
 *
 * =====================================================================
 */
