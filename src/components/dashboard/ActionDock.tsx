// src/components/dashboard/ActionDock.tsx
/**
 * @file ActionDock.tsx
 * @description Orquestador de UI soberano para el "Hub Creativo". Corregido
 *              para consumir la SSoT de i18n correcta.
 * @author Raz Podestá - MetaShark Tech
 * @version 10.1.0
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
import { useDashboardTranslations } from "@/lib/hooks/useDashboardTranslations";
import { useRouter } from "@/lib/navigation";
import { logger } from "@/lib/logging";
import {
  ActionDockButton,
  type ActionDockButtonProps,
} from "@/components/dashboard/ActionDockButton";

export function ActionDock(): React.ReactElement {
  const { tActionDock, tErrors } = useDashboardTranslations();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction] = useFormState(createCreationAction, {
    success: false,
    error: "",
  });

  useEffect(() => {
    if (state.success && state.data?.id) {
      toast.success(
        tErrors("success_creation_toast" as any, {
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
    /* ... */
  };
  const FADE_UP = {
    /* ... */
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
 * 1. ((Implementada)) **Sincronización de Contratos:** Resuelve `TS2339` y `TS2345` al consumir las SSoT de i18n correctas.
 *
 * =====================================================================
 */
// src/components/dashboard/ActionDock.tsx
