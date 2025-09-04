// src/components/dashboard/ActionDock.tsx
/**
 * @file ActionDock.tsx
 * @description Orquestador de UI de presentación puro para el "Hub Creativo".
 *              Ha sido refactorizado a un estándar de élite para consumir la
 *              API estable de su hook soberano y para manejar de forma robusta
 *              el estado en que los servicios aún no están disponibles,
 *              renderizando un esqueleto de carga.
 * @author Raz Podestá - MetaShark Tech
 * @version 13.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

import {
  ActionDockButton,
  type ActionDockButtonProps,
} from "@/components/dashboard/ActionDockButton";
import { useActionDock } from "@/lib/hooks/useActionDock";
import { clientLogger } from "@/lib/logger";

/**
 * @public
 * @component ActionDock
 * @description Ensambla la cuadrícula interactiva del "Hub Creativo". Es un
 *              componente de presentación puro que recibe todo su estado y
 *              lógica del hook soberano `useActionDock`.
 * @returns {React.ReactElement}
 */
export function ActionDock(): React.ReactElement {
  clientLogger.trace(
    "[ActionDock] Renderizando orquestador de UI de presentación puro."
  );

  const { formAction, services, animationVariants } = useActionDock();
  const formRef = useRef<HTMLFormElement>(null);
  const { STAGGER_CONTAINER, FADE_UP } = animationVariants;

  if (services.length === 0) {
    // Si los servicios no están disponibles (error de i18n o carga inicial),
    // se renderiza un esqueleto de carga para mantener el layout y la UX.
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-x-4 gap-y-6">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className="w-20 h-[104px] bg-muted rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={STAGGER_CONTAINER}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-x-4 gap-y-6"
    >
      {services.map((service, index) => (
        <motion.div key={service.id} variants={FADE_UP}>
          <form action={formAction} ref={formRef}>
            <input type="hidden" name="name" value={service.label} />
            <ActionDockButton
              {...(service as ActionDockButtonProps)}
              isEven={index % 2 === 0}
            />
          </form>
        </motion.div>
      ))}
    </motion.div>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Botón "Ver Más"**: Implementar un botón que revele servicios adicionales (los placeholders actuales) en lugar de mostrarlos siempre, manteniendo la UI inicial más limpia y enfocada en las acciones principales.
 * 2. **Personalización del Dock por el Usuario**: Permitir a los usuarios reordenar los `ActionDockButton` mediante drag-and-drop. El nuevo orden (un array de `service.id`) se persistiría en `profiles.dashboard_layout` a través de una nueva Server Action.
 * 3. **Estado de Carga Visual**: Integrar el estado `isPending` del `useActionDock` hook para mostrar un feedback visual (ej. un overlay con spinner) sobre toda la cuadrícula mientras se procesa una creación, previniendo clics duplicados.
 * 4. **Accesibilidad de Formularios Múltiples**: La estructura actual crea múltiples formularios. Para una accesibilidad de élite, se podría refactorizar a un solo formulario que envuelva toda la cuadrícula, y cada botón pasaría su `type` a través de su `value` y `name`, con un `input hidden` que se actualice `onClick`.
 * 5. **Estado Vacío Explícito**: Añadir un componente `EmptyState` con un mensaje claro si la carga de servicios falla y el array `services` está vacío, en lugar del esqueleto de carga.
 * =====================================================================
 */
// src/components/dashboard/ActionDock.tsx
