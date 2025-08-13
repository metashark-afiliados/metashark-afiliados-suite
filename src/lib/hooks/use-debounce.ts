// src/lib/hooks/use-debounce.ts
/**
 * @file src/lib/hooks/use-debounce.ts
 * @description Hook de React de élite para retrasar la actualización de un valor.
 *              Ha sido optimizado para no ejecutar el temporizador en el montaje
 *              inicial, mejorando el rendimiento y previniendo efectos secundarios
 *              innecesarios.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";

import { useEffect, useRef, useState } from "react";

/**
 * @public
 * @function useDebounce
 * @description Retrasa la propagación de un valor que cambia rápidamente.
 * @template T - El tipo del valor a "debouncear".
 * @param {T} value - El valor del estado que se desea retrasar.
 * @param {number} delay - El tiempo de espera en milisegundos.
 * @returns {T} El valor "debounced".
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // --- INICIO DE OPTIMIZACIÓN DE ÉLITE ---
    // Si es el montaje inicial del componente, no hacemos nada.
    // Solo queremos que el debounce se active en *cambios* posteriores.
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    // --- FIN DE OPTIMIZACIÓN DE ÉLITE ---

    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Optimización de Renderizado Inicial**: ((Implementada)) Se ha introducido un `useRef` para rastrear el montaje inicial. El `useEffect` ahora se salta en el primer render, previniendo la ejecución innecesaria del temporizador y de cualquier efecto secundario dependiente del valor "debounced".
 *
 * @subsection Melhorias Futuras
 * 1. **Callback de Debounce**: ((Vigente)) Se podría extender el hook para aceptar un callback opcional que se ejecute cuando el valor "debounced" cambie, proporcionando más flexibilidad.
 *
 * =====================================================================
 */
// src/lib/hooks/use-debounce.ts
