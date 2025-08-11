// src/components/landing/Features.tsx
/**
 * @file src/components/landing/Features.tsx
 * @description Componente de presentación puro para la sección de características
 *              de la landing page. Se alinea con la arquitectura de React Server
 *              Components (RSC) al recibir nombres de iconos como strings y
 *              renderizarlos dinámicamente en el cliente a través del aparato
 *              atómico `DynamicIcon`.
 * @author L.I.A. Legacy
 * @version 1.0.0
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
 */
export interface Feature {
  /**
   * @property {string} icon - El nombre del icono de `lucide-react` a renderizar,
   *                  en formato PascalCase.
   */
  icon: string;
  /**
   * @property {string} title - El título de la característica.
   */
  title: string;
  /**
   * @property {string} description - La descripción de la característica.
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
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => (
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
 * @subsection Melhorias Futuras
 * 1. **Modal com Detalhes Adicionais**: ((Vigente)) Adicionar uma prop `onClick` a cada `Feature` para permitir abrir um modal com mais informações, vídeos ou exemplos da característica.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Conformidade com Arquitetura RSC**: ((Implementada)) O contrato de props (`Feature.icon`) como `string` e o uso de `DynamicIcon` fazem deste componente um exemplo canônico da arquitetura de Server/Client Components.
 * 2. **Componente Puro e Internacionalizável**: ((Implementada)) O componente é 100% agnóstico ao conteúdo, o que permite que a `HomePage` (Server Component) construa o array `features` com textos totalmente internacionalizados.
 *
 * =====================================================================
 */
// src/components/landing/Features.tsx
