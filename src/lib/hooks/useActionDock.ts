// src/lib/hooks/useActionDock.ts
/**
 * @file useActionDock.ts
 * @description Hook Soberano que encapsula la lógica para el `ActionDock`.
 *              Refactorizado para utilizar el guardián de tipo genérico
 *              `isActionSuccess`, resolviendo la cascada de errores de tipo.
 * @author RaZ Podestá - MetaShark Tech
 * @version 3.0.0
 * @see .docs-espejo/lib/hooks/useActionDock.ts.md
 */
"use client";

import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import { createCreationAction } from "@/lib/actions/creations";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logger";
import { useRouter } from "@/lib/navigation";
import {
  isActionError,
  isActionSuccess,
  type ActionResult,
} from "@/lib/validators";

type ActionDockState = ActionResult<{ id: string }>;

const initialState: ActionDockState = {
  success: false,
  error: "generic.error_unexpected",
};

/**
 * @public
 * @function useActionDock
 * @description Hook que provee toda la lógica y estado necesarios para el `ActionDock`.
 * @returns Un objeto con la acción del formulario, los datos de los servicios
 *          y las variantes de animación.
 */
export function useActionDock() {
  clientLogger.trace("[useActionDock] Hook soberano inicializado.");

  const tActionDock = useTypedTranslations("shared.ActionDock");
  const tErrors = useTypedTranslations("shared.ValidationErrors");
  const router = useRouter();

  const [state, formAction] = useFormState(createCreationAction, initialState);

  useEffect(() => {
    if (isActionSuccess<{ id: string }>(state)) {
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
      const errorMessage = tErrors(state.error, {
        defaultValue: state.error,
      });
      toast.error(errorMessage);
    }
  }, [state, router, tErrors]);

  const services = tActionDock.raw("services");

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
    return {
      formAction,
      services: [],
      animationVariants,
    };
  }

  return { formAction, services, animationVariants };
}
// src/lib/hooks/useActionDock.ts
