// src/components/ui/CursorTrail.tsx
/**
 * @file src/components/ui/CursorTrail.tsx
 * @description Componente de cliente que renderiza una estela visual brillante que
 *              sigue el cursor del ratón del usuario. Ha sido corregido para incluir
 *              la importación explícita de React, resolviendo el error de compilación TS2686.
 * @author L.I.A. Legacy
 * @version 1.0.1
 */
"use client";

import React, { useEffect, useState } from "react"; // <-- IMPORTACIÓN CORREGIDA
import {
  motion,
  type MotionValue,
  useMotionValue,
  useSpring,
} from "framer-motion";

/**
 * @public
 * @component CursorTrail
 * @description Renderiza un `div` que sigue al cursor con una animación de resorte.
 *              No renderiza nada si el usuario está en un dispositivo que probablemente
 *              no tenga un cursor (táctil).
 * @returns {React.ReactElement | null} El elemento de la estela o null.
 */
export function CursorTrail(): React.ReactElement | null {
  const [isClient, setIsClient] = useState(false);
  const [hasPointer, setHasPointer] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Infiere la presencia de un cursor fino. Desactiva el efecto en móviles/tabletas.
    setHasPointer(window.matchMedia("(pointer: fine)").matches);
  }, []);

  const mouse: { x: MotionValue<number>; y: MotionValue<number> } = {
    x: useMotionValue(0),
    y: useMotionValue(0),
  };

  const smoothOptions = {
    damping: 20,
    stiffness: 300,
    mass: 0.5,
  };

  const smoothMouse = {
    x: useSpring(mouse.x, smoothOptions),
    y: useSpring(mouse.y, smoothOptions),
  };

  useEffect(() => {
    if (!hasPointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x.set(e.clientX);
      mouse.y.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouse.x, mouse.y, hasPointer]);

  if (!isClient || !hasPointer) {
    return null;
  }

  return (
    <motion.div
      style={{
        left: smoothMouse.x,
        top: smoothMouse.y,
        translateX: "-50%",
        translateY: "-50%",
      }}
      className="pointer-events-none fixed z-50 h-8 w-8 rounded-full bg-primary/50 blur-lg"
    />
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Corrección de Referencia de Módulo**: ((Implementada)) Se ha añadido `import React from "react"`, que resuelve el error `TS2686` al importar explícitamente el módulo en lugar de depender de una referencia UMD global.
 *
 * @subsection Melhorias Futuras
 * 1. **Reactividad al Contexto**: ((Vigente)) La estela podría cambiar de color o forma dinámicamente cuando el cursor pasa sobre diferentes tipos de elementos.
 *
 * =====================================================================
 */
// src/components/ui/CursorTrail.tsx
