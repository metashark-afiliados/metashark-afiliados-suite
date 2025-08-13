// src/components/landing/SupportCTA.tsx
/**
 * @file src/components/landing/SupportCTA.tsx
 * @description Componente de presentación para la sección de "Llamada a la Acción de Soporte"
 *              de la landing page. Anima a los usuarios a contactar con soporte o
 *              consultar la documentación. Es un componente de cliente puro, animado
 *              y completamente agnóstico al contenido.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import React from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente de Conversión Secundario**: ((Implementada)) Se ha creado un nuevo aparato que proporciona una ruta de conversión secundaria para usuarios que necesitan más información, una práctica de diseño de landing page de élite.
 * 2. **Componente Puro e Internacionalizable**: ((Implementada)) El componente es 100% agnóstico al contenido.
 * 3. **Estilo Sofisticado**: ((Implementada)) El uso de un fondo con gradiente sutil se alinea con la estética moderna del diseño de referencia.
 *
 * @subsection Melhorias Futuras
 * 1. **Integración con Widget de Chat**: ((Vigente)) El botón "Contactar Soporte" podría, en lugar de navegar, abrir directamente un widget de chat en vivo (como el futuro `LiaChatWidget`), proporcionando una asistencia más inmediata.
 *
 * =====================================================================
 */
// src/components/landing/SupportCTA.tsx
