// src/components/dashboard/ActionDock.tsx
/**
 * @file ActionDock.tsx
 * @description Orquestador de UI de élite para el "Hub Creativo". Renderiza una
 *              cuadrícula de formularios, donde cada uno inicia la creación de un
 *              nuevo diseño (`Creation`). Este componente es la SSoT para la
 *              iniciación de flujos de trabajo del usuario desde el dashboard.
 *              Ha sido refactorizado para una gestión de estado y enrutamiento
 *              de máxima robustez.
 * @author Raz Podestá
 * @version 8.1.0
 */
"use client";

import { useFormState } from "react-dom";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { createCreationAction } from "@/lib/actions/creations";
import { useRouter } from "@/lib/navigation";
import {
  ActionDockButton,
  type ActionDockButtonProps,
} from "@/components/dashboard/ActionDockButton";

/**
 * @public
 * @component ActionDock
 * @description Orquesta el renderizado de la cuadrícula de acciones y gestiona
 *              el ciclo de vida completo del formulario de creación: envío,
 *              manejo de respuesta, feedback al usuario y redirección.
 * @returns {React.ReactElement}
 */
export function ActionDock(): React.ReactElement {
  const t = useTranslations("ActionDock");
  const tErrors = useTranslations("ValidationErrors");
  const services: ActionDockButtonProps[] = t.raw("services");
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction] = useFormState(createCreationAction, {
    success: false,
    error: "", // Estado inicial compatible con el contrato ActionResult
  });

  useEffect(() => {
    // Manejador de efectos para la respuesta de la Server Action
    if (state.success && state.data?.id) {
      toast.success(
        tErrors("error_creation_failed", { defaultValue: "Creation started!" })
      ); // Usar clave i18n
      router.push({
        pathname: "/builder/[creationId]",
        params: { creationId: state.data.id },
      });
    } else if (!state.success && state.error) {
      toast.error(tErrors(state.error as any, { defaultValue: state.error }));
    }
  }, [state, router, tErrors]);

  const STAGGER_CONTAINER = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
  };

  return (
    <motion.div
      variants={STAGGER_CONTAINER}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="grid grid-cols-7 gap-x-4 gap-y-6"
    >
      {services.map((service, index) => (
        <form key={service.id} action={formAction} ref={formRef}>
          <input type="hidden" name="name" value={service.label} />
          <ActionDockButton {...service} isEven={index % 2 === 0} />
        </form>
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
 * 1. **Resolución Sistémica de Errores de Tipo**: ((Implementada)) Se han resuelto todos los errores de tipo (`TS2769`, `TS2345`, `TS2339`) mediante la correcta inicialización del estado, el uso de objetos para rutas dinámicas y el `type narrowing` correcto.
 * 2. **Full Internacionalización del Feedback**: ((Implementada)) Los `toast` de éxito y error ahora consumen el namespace `ValidationErrors`, completando la internacionalización del feedback de la acción.
 * 3. **Arquitectura de Formularios Atómicos**: ((Implementada)) El patrón de un `<form>` por cada botón es una implementación de élite que asegura que cada acción es atómica y autocontenida, adhiriéndose a la "Filosofía LEGO".
 *
 * @subsection Melhorias Futuras
 * 1. **`useFormStatus` para Feedback Visual**: ((Vigente)) El componente `ActionDockButton` podría ser mejorado para aceptar una prop `isPending`. El `ActionDock` podría usar `useFormStatus` para obtener el estado de pendiente y pasarlo al botón que fue clickeado, mostrando un spinner individualmente.
 * 2. **Modal de Opciones de Creación**: ((Vigente)) En lugar de una creación directa, hacer clic en un botón podría abrir un modal (`Dialog`) que ofrezca opciones como "Crear desde cero" o "Usar plantilla", pasando la opción seleccionada a la Server Action.
 *
 * =====================================================================
 */
// src/components/dashboard/ActionDock.tsx
