// src/app/[locale]/auth/auth-layout-client.tsx
/**
 * @file src/app/[locale]/auth/auth-layout-client.tsx
 * @description Componente de cliente que provee la capa de animación y UI
 *              para el layout de autenticación. Este aparato es un componente
 *              de presentación puro que recibe todo su contenido a través de props.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { Link } from "@/lib/navigation";

interface AuthLayoutClientProps {
  children: React.ReactNode;
  ariaLabel: string;
}

/**
 * @public
 * @component AuthLayoutClient
 * @description Renderiza el contenedor principal para las páginas de autenticación,
 *              aplicando una animación de entrada y mostrando el logo de la marca.
 * @param {AuthLayoutClientProps} props - Propiedades para configurar el layout.
 * @returns {React.ReactElement}
 */
export function AuthLayoutClient({
  children,
  ariaLabel,
}: AuthLayoutClientProps): React.ReactElement {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background p-4"
    >
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at top, hsl(var(--color-primary)/0.05), transparent 30%)",
        }}
      />
      <Link href="/" className="absolute top-8 left-8" aria-label={ariaLabel}>
        <Image
          src="/images/logo.png"
          alt="Logo de ConvertiKit"
          width={40}
          height={40}
          priority
        />
      </Link>
      {children}
    </motion.main>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Animación de Entrada**: ((Implementada)) El uso de `framer-motion` proporciona una transición de entrada suave, mejorando la calidad percibida de la UI.
 * 2. **Componente Puro**: ((Implementada)) Este componente es puramente de presentación, recibiendo su `ariaLabel` del Server Component padre, lo que lo hace testeable y reutilizable.
 *
 * @subsection Melhorias Futuras
 * 1. **Animaciones de Salida**: ((Vigente)) Se podría envolver el `{children}` en un `<AnimatePresence>` para permitir que las páginas de `login` y `signup` tengan sus propias animaciones de salida al navegar entre ellas.
 *
 * =====================================================================
 */
// src/app/[locale]/auth/auth-layout-client.tsx
