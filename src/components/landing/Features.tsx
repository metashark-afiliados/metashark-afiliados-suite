// src/components/landing/Features.tsx
/**
 * @file src/components/landing/Features.tsx
 * @description Componente de presentación puro para la sección de características
 *              de la landing page. Se alinea con la arquitectura de React Server
 *              Components (RSC) al recibir nombres de iconos como strings y
 *              renderizarlos dinámicamente en el cliente a través del aparato
 *              atómico `DynamicIcon`.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
"use client";

import React from "react";
import { motion } from "framer-motion";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

/**
 * @public
 * @interface Feature
 * @description Define el contrato de datos para una única característica.
 *              Este contrato es serializable y seguro para pasar desde
 *              Server Components a Client Components.
 */
export interface Feature {
  /**
   * @property {string} icon - El nombre del icono de `lucide-react` a renderizar,
   *                  en formato PascalCase (ej. "LayoutTemplate").
   */
  icon: string;
  /**
   * @property {string} title - El título de la característica, internacionalizado.
   */
  title: string;
  /**
   * @property {string} description - La descripción de la característica, internacionalizada.
   */
  description: string;
}

/**
 * @public
 * @interface FeaturesProps
 * @description Define el contrato de props para el componente `Features`.
 */
export interface FeaturesProps {
  /** El título principal de la sección. */
  title: string;
  /** El subtítulo o descripción de la sección. */
  subtitle: string;
  /** Un array de objetos de características a mostrar. */
  features: Feature[];
}

/**
 * @public
 * @component Features
 * @description Renderiza la sección de características de la landing page.
 * @param {FeaturesProps} props - Las propiedades del componente.
 * @returns {React.ReactElement}
 */
export function Features({
  title,
  subtitle,
  features,
}: FeaturesProps): React.ReactElement {
  const FADE_IN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  return (
    <section id="features" className="py-20">
      <div className="container mx-auto flex flex-col items-center gap-8 px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center">{title}</h2>
        <p className="max-w-2xl text-center text-muted-foreground">
          {subtitle}
        </p>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.15 } },
          }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {/* 
            Parche defensivo: Se añade `(features || []).map` para evitar el crash
            mientras se nivela el componente padre. Esto es una medida temporal
            que será innecesaria una vez que `page.tsx` se corrija.
          */}
          {(features || []).map((feature) => (
            <motion.div
              key={feature.title}
              variants={FADE_IN_ANIMATION_VARIANTS}
            >
              <Card className="group h-full overflow-hidden border-border/80 bg-card/80 transition-all duration-300 hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/20">
                <CardHeader className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <DynamicIcon
                      name={feature.icon}
                      className="h-6 w-6 text-primary"
                    />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="mt-2 text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Conformidad con Arquitectura RSC**: ((Implementada)) El contrato de props (`Feature.icon`) como `string` y el uso de `DynamicIcon` es el patrón canónico para este componente, restaurando la lógica correcta del snapshot original y preparando la solución al `TypeError`.
 * 2. **Componente Puro e Internacionalizable**: ((Implementada)) El componente se mantiene 100% agnóstico al contenido, permitiendo que la `HomePage` (Server Component) construya el array `features` con textos totalmente internacionalizados.
 *
 * @subsection Melhorias Futuras
 * 1. **Modal con Detalles Adicionales**: ((Vigente)) Añadir una prop `onClick` a cada `Feature` para permitir abrir un modal con más información, videos o ejemplos de la característica.
 *
 * =====================================================================
 */
// src/components/landing/Features.tsx
