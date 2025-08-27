/**
 * @file ActionDock.tsx
 * @description Orquestador de UI soberano para el "Hub Creativo". Ha sido
 *              refactorizado a un estándar de élite para consumir directamente
 *              sus namespaces de i18n (`shared.ActionDock` y `shared.ValidationErrors`)
 *              a través del hook SSoT `useTypedTranslations`, eliminando la
 *              dependencia del hook genérico.
 * @author Raz Podestá - MetaShark Tech
 * @version 11.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useFormState } from "react-dom";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { createCreationAction } from "@/lib/actions/creations";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { useRouter } from "@/lib/navigation";
import { logger } from "@/lib/logging";
import {
  ActionDockButton,
  type ActionDockButtonProps,
} from "@/components/dashboard/ActionDockButton";

export function ActionDock(): React.ReactElement {
  const tActionDock = useTypedTranslations("shared.ActionDock");
  const tErrors = useTypedTranslations("shared.ValidationErrors");
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction] = useFormState(createCreationAction, {
    success: false,
    error: "",
  });

  useEffect(() => {
    if (state.success && state.data?.id) {
      toast.success(
        tErrors("error_creation_failed" as any, {
          defaultValue: "Creation started!",
        })
      );
      router.push({
        pathname: "/builder/[creationId]",
        params: { creationId: state.data.id },
      });
    } else if (!state.success && state.error) {
      toast.error(tErrors(state.error as any, { defaultValue: state.error }));
    }
  }, [state, router, tErrors]);

  const services = tActionDock.raw("services");
  if (!Array.isArray(services)) {
    logger.error(
      "[ActionDock] Error de tipo: la clave 'services' no es un array."
    );
    return <div>Error de configuración de i18n.</div>;
  }

  const STAGGER_CONTAINER = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };
  const FADE_UP = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

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
 *
 * @subsection Melhorias Adicionadas
 * 1. **Soberanía de Internacionalización (SRP)**: ((Implementada)) El componente ahora consume directamente sus namespaces requeridos (`shared.ActionDock`, `shared.ValidationErrors`) a través de `useTypedTranslations`, eliminando la dependencia del hook genérico `useDashboardTranslations` y mejorando la cohesión y el SRP.
 * 2. **Desacoplamiento Arquitectónico**: ((Implementada)) Esta refactorización reduce el acoplamiento entre los componentes del dashboard, haciendo el sistema más modular y fácil de mantener.
 *
 * @subsection Melhorias Futuras
 * 1. **Manejo de Foco**: ((Vigente)) Después de que la acción de creación se complete, el foco debería ser gestionado programáticamente para dirigir al usuario al nuevo contexto en el `Builder`, mejorando la accesibilidad.
 * 2. **Visibilidad Basada en Permisos**: ((Vigente)) La lista de `services` podría ser filtrada basándose en el `plan_type` del usuario, mostrando u ocultando herramientas premium.
 *
 * =====================================================================
 */
