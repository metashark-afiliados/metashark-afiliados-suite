// src/components/dashboard/ActionDock.tsx
/**
 * @file ActionDock.tsx
 * @description Orquestador de UI de élite para el "Hub Creativo". Refactorizado
 *              para renderizar las acciones en una cuadrícula 3x7 y con una
 *              animación escalonada de `framer-motion` mejorada.
 * @author Raz Podestá - MetaShark Tech
 * @version 9.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useFormState } from "react-dom";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { createCreationAction } from "@/lib/actions/creations";
import { useRouter } from "@/lib/navigation";
import { logger } from "@/lib/logging";
import {
  ActionDockButton,
  type ActionDockButtonProps,
} from "@/components/dashboard/ActionDockButton";

export function ActionDock(): React.ReactElement {
  const t = useTranslations("shared.ActionDock");
  const tErrors = useTranslations("ValidationErrors");
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction] = useFormState(createCreationAction, {
    success: false,
    error: "",
  });

  useEffect(() => {
    if (state.success && state.data?.id) {
      toast.success(
        tErrors("success_creation_toast", { defaultValue: "Creation started!" })
      );
      router.push({
        pathname: "/builder/[creationId]",
        params: { creationId: state.data.id },
      });
    } else if (!state.success && state.error) {
      toast.error(tErrors(state.error as any, { defaultValue: state.error }));
    }
  }, [state, router, tErrors]);

  const services = t.raw("services");
  if (!Array.isArray(services)) {
    logger.error(
      "[ActionDock] TypeError: La clave 'services' de i18n no devolvió un array.",
      { receivedValue: services, type: typeof services }
    );
    return (
      <div className="text-destructive text-center p-4 border border-dashed border-destructive rounded-md">
        Error al cargar los servicios. Verifique la configuración de i18n.
      </div>
    );
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
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } },
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
 * 1. **Layout de Cuadrícula 3x7**: ((Implementada)) El layout ha sido refactorizado a una cuadrícula CSS (`grid grid-cols-7`), alineándose con el blueprint del "Hub Creativo" y mejorando la densidad de información.
 * 2. **Animación Escalonada de Élite**: ((Implementada)) Se ha corregido y mejorado la implementación de `framer-motion` para aplicar una verdadera animación escalonada, donde cada botón aparece individualmente, proporcionando una experiencia visual superior.
 * 3. **Layout Responsivo**: ((Implementada)) La cuadrícula ahora es responsiva (`grid-cols-3 sm:grid-cols-4 md:grid-cols-7`), asegurando una visualización óptima en todos los tamaños de pantalla.
 *
 * @subsection Melhorias Futuras
 * 1. **Botón "Ver Más"**: ((Vigente)) Para mantener la UI limpia, se podría mostrar inicialmente solo una fila (7 items) y un botón "Ver Más" que expanda la cuadrícula para revelar las demás opciones.
 * 2. **Personalización del Dock**: ((Vigente)) Una mejora de élite sería permitir a los usuarios reordenar los botones del `ActionDock` mediante D&D y guardar su layout preferido en la tabla `profiles`.
 *
 * =====================================================================
 */
// src/components/dashboard/ActionDock.tsx
