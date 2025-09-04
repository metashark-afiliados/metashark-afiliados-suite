// src/components/landing/SupportCTA.tsx
/**
 * @file src/components/landing/SupportCTA.tsx
 * @description Componente de presentación para la sección de "Llamada a la Acción de Soporte".
 *              Es un componente de cliente puro, animado y completamente agnóstico al contenido.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
"use client";

import { motion } from "framer-motion";
import React from "react";

import { Button } from "@/components/ui/button";
import { clientLogger } from "@/lib/logger";
import { Link } from "@/lib/navigation";

/**
 * @public
 * @interface SupportCTAProps
 * @description Define el contrato de props para el componente `SupportCTA`.
 */
export interface SupportCTAProps {
  title: string;
  description: string;
  contactButtonText: string;
  docsButtonText: string;
}

/**
 * @public
 * @component SupportCTA
 * @description Orquesta el renderizado de la sección de CTA de soporte.
 * @param {SupportCTAProps} props - Propiedades para configurar la sección.
 * @returns {React.ReactElement}
 */
export function SupportCTA({
  title,
  description,
  contactButtonText,
  docsButtonText,
}: SupportCTAProps): React.ReactElement {
  clientLogger.trace(
    "[SupportCTA] Renderizando componente de presentación puro."
  );

  const FADE_UP_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="py-20">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        variants={FADE_UP_VARIANTS}
        className="container mx-auto max-w-2xl rounded-xl bg-gradient-to-br from-muted/50 to-muted/20 p-8 text-center"
      >
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
          {description}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/support">{contactButtonText}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/docs">{docsButtonText}</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
// src/components/landing/SupportCTA.tsx
