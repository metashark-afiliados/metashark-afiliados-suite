// src/lib/hooks/ui/useDialogState.ts
/**
 * @file src/lib/hooks/ui/useDialogState.ts
 * @description Hook de UI atómico y reutilizable que encapsula la lógica de
 *              estado para un componente modal o de diálogo.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import { useState, useCallback } from "react";
import { logger } from "@/lib/logging";

/**
 * @public
 * @function useDialogState
 * @description Gestiona el estado booleano de un diálogo (abierto/cerrado).
 * @param {boolean} [initialState=false] - El estado inicial del diálogo.
 * @returns {{
 *   isOpen: boolean;
 *   open: () => void;
 *   close: () => void;
 *   toggle: () => void;
 *   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
 * }} Una API semántica para controlar el estado del diálogo.
 */
export const useDialogState = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => {
    logger.trace("[useDialogState] Abriendo diálogo.");
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    logger.trace("[useDialogState] Cerrando diálogo.");
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    logger.trace("[useDialogState] Alternando diálogo.");
    setIsOpen((prev) => !prev);
  }, []);

  return { isOpen, open, close, toggle, setIsOpen };
};
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (Lógica de UI)**: ((Implementada)) Este nuevo aparato encapsula perfectamente una única responsabilidad: gestionar el estado de un diálogo.
 * 2. **API Semántica**: ((Implementada)) Proporciona una API clara y semántica (`open`, `close`, `toggle`) que mejora la legibilidad del código consumidor en comparación con el uso directo de `useState`.
 * 3. **Full Observabilidad**: ((Implementada)) Cada cambio de estado es registrado, proporcionando visibilidad sobre las interacciones del usuario con los modales.
 *
 * @subsection Melhorias Futuras
 * 1. **Callbacks Opcionales**: ((Vigente)) Las funciones `open` y `close` podrían aceptar un callback opcional (`onOpen`, `onClose`) para ejecutar lógica adicional cuando el estado del diálogo cambia.
 *
 * =====================================================================
 */
// src/lib/hooks/ui/useDialogState.ts
