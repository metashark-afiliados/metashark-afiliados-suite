// src/lib/hooks/useLocalStorage.ts
/**
 * @file useLocalStorage.ts
 * @description Hook de UI de élite para gestionar el estado en localStorage.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-26
 */
"use client";

import { clientLogger } from "@/lib/logger";
import { useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      clientLogger.error(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      clientLogger.error(`Error setting localStorage key “${key}”:`, error);
    }
  };

  return [storedValue, setValue];
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Persistencia Segura y Reactiva:** Proporciona una SSoT reutilizable para interactuar con `localStorage`, manejando de forma segura el entorno SSR.
 * 2. ((Implementada)) **Full Observabilidad:** Incluye logging para la lectura y escritura, facilitando la depuración del estado del cliente.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Sincronización Multi-Pestaña:** El hook podría ser mejorado para escuchar el evento `storage` de la ventana (`window.addEventListener('storage', ...)`). Esto permitiría que el estado se sincronice automáticamente entre múltiples pestañas abiertas de la aplicación si el valor cambia en una de ellas, una característica de UX de élite.
 * 2. ((Vigente)) **Manejo de Expiración:** Podría aceptar una prop `ttl` (Time To Live) para almacenar el valor junto con una marca de tiempo de expiración.
 *
 * =====================================================================
 */
// src/lib/hooks/useLocalStorage.ts
