// src/lib/hooks/use-subdomain-availability.ts
/**
 * @file use-subdomain-availability.ts
 * @description Hook de React atómico y de élite para la validación asíncrona de
 *              disponibilidad de subdominios. Utiliza `useReducer` para una
 *              gestión de máquina de estados robusta y predecible.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @see .docs-espejo/lib/hooks/use-subdomain-availability.ts.md
 */
"use client";

import { useCallback, useEffect, useReducer } from "react";

import { sites as sitesActions } from "@/lib/actions";
import { debounce } from "@/lib/utils";
import { clientLogger } from "@/lib/logger";

export type AvailabilityStatus =
  | "idle"
  | "checking"
  | "available"
  | "unavailable";

type State = { status: AvailabilityStatus };
type Action =
  | { type: "CHECK_START" }
  | { type: "CHECK_SUCCESS"; isAvailable: boolean }
  | { type: "CHECK_ERROR" }
  | { type: "RESET" };

const initialState: State = { status: "idle" };

function availabilityReducer(state: State, action: Action): State {
  switch (action.type) {
    case "CHECK_START":
      return { status: "checking" };
    case "CHECK_SUCCESS":
      return { status: action.isAvailable ? "available" : "unavailable" };
    case "CHECK_ERROR":
      return { status: "unavailable" };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

/**
 * @public
 * @function useSubdomainAvailability
 * @description Gestiona la lógica para verificar la disponibilidad de un subdominio.
 * @param {string} subdomainValue - El valor del subdominio a verificar.
 * @param {boolean} isDirty - Si el campo ha sido modificado.
 * @param {boolean} hasErrors - Si el campo tiene errores de validación síncrona.
 * @returns {{ availability: AvailabilityStatus }} El estado actual de disponibilidad.
 */
export function useSubdomainAvailability(
  subdomainValue: string,
  isDirty: boolean,
  hasErrors: boolean
) {
  const [state, dispatch] = useReducer(availabilityReducer, initialState);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedCheck = useCallback(
    debounce(async (subdomain: string) => {
      dispatch({ type: "CHECK_START" });
      const result =
        await sitesActions.checkSubdomainAvailabilityAction(subdomain);
      if (result.success) {
        dispatch({
          type: "CHECK_SUCCESS",
          isAvailable: result.data.isAvailable,
        });
      } else {
        dispatch({ type: "CHECK_ERROR" });
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (!isDirty || hasErrors || subdomainValue.length < 3) {
      if (state.status !== "idle") {
        dispatch({ type: "RESET" });
      }
      return;
    }
    debouncedCheck(subdomainValue);
  }, [subdomainValue, isDirty, hasErrors, debouncedCheck, state.status]);

  return { availability: state.status };
}
// src/lib/hooks/use-subdomain-availability.ts
