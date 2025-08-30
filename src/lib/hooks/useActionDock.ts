// src/lib/hooks/useActionDock.ts
/**
 * @file src/lib/hooks/useActionDock.ts
 * @description Hook Soberano que encapsula la lógica de negocio y de estado
 *              para el componente `ActionDock`. Ha sido refactorizado a un
 *              estándar de élite para garantizar un contrato de retorno de API
 *              estable y predecible, resolviendo un error de tipo crítico.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";

import { createCreationAction } from "@/lib/actions/creations";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { useRouter } from "@/lib/navigation";
import { clientLogger } from "@/lib/logging";
import { isActionError } from "@/lib/validators";

/**
 * @public
 * @function useActionDock
 * @description Hook que provee toda la lógica y estado necesarios para el `ActionDock`.
 * @returns Un objeto con la acción del formulario, los datos de los servicios
 *          y las variantes de animación para ser consumidos por un componente de
 *          presentación puro. Su forma de retorno es siempre consistente.
 */
export function useActionDock() {
  clientLogger.trace("[useActionDock] Hook soberano inicializado.");

  const tActionDock = useTypedTranslations("shared.ActionDock");
  const tErrors = useTypedTranslations("shared.ValidationErrors");
  const router = useRouter();

  const [state, formAction] = useFormState(createCreationAction, {
    success: false,
    error: "",
  });

  useEffect(() => {
    if (state.success && state.data?.id) {
      toast.success(
        tErrors("workspaces.create_success", {
          defaultValue: "Creation started successfully!",
        })
      );
      router.push({
        pathname: "/builder/[creationId]",
        params: { creationId: state.data.id },
      });
    } else if (isActionError(state)) {
      const errorMessage = tErrors(state.error as any, {
        defaultValue: state.error,
      });
      toast.error(errorMessage);
    }
  }, [state, router, tErrors]);

  const services = tActionDock.raw("services");

  // Definir las variantes de animación una vez para garantizar la consistencia.
  const animationVariants = {
    STAGGER_CONTAINER: {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
        },
      },
    },
    FADE_UP: {
      hidden: { opacity: 0, y: 10 },
      show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    },
  };

  if (!Array.isArray(services)) {
    clientLogger.error(
      "[useActionDock] Error de tipo: la clave 'services' de i18n no es un array."
    );
    // Devolver un array de servicios vacío pero mantener la forma del objeto.
    return {
      formAction,
      services: [],
      animationVariants,
    };
  }

  return { formAction, services, animationVariants };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Manejo de Foco Post-Redirección**: Implementar una estrategia para que, después de la redirección al "Builder", el foco se establezca automáticamente en el canvas o en el primer elemento editable, mejorando la accesibilidad y el flujo de usuario.
 * 2. **Feedback de Carga en Botones**: Extender el hook para que devuelva el estado `isPending` de `useTransition` y un `submittingType: string | null`. Esto permitiría a `ActionDock.tsx` mostrar un spinner solo en el `ActionDockButton` que fue clickeado.
 * 3. **Filtrado de Servicios por Plan**: El hook podría consumir el `useDashboard` context para obtener el `plan_type` del usuario y filtrar el array `services` para mostrar u ocultar herramientas premium.
 * 4. **Creación de `CreationsErrors.schema.ts`**: Crear un schema de errores atómico para el dominio `creations` y añadir una clave `create_success` para eliminar el uso de la clave de `workspaces` en el toast de éxito.
 * 5. **Tipado de Errores con `isActionError`**: La aserción de tipo `as any` en `tErrors(state.error as any)` es pragmática. Refinar el tipo `ActionResult` para que la propiedad `error` sea un genérico `TErrorKey extends keyof ValidationErrors` proporcionaría una seguridad de tipos aún mayor.
 * 6. **Centralización de Variantes de Animación**: Las variantes de `framer-motion` podrían ser exportadas desde un manifiesto de animaciones (`src/config/animations.config.ts`) para su reutilización en otros componentes.
 * =====================================================================
 */
// src/lib/hooks/useActionDock.ts
