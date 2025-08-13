// src/components/landing/Testimonials.tsx
/**
 * @file src/components/landing/Testimonials.tsx
 * @description Componente de presentación para la sección de testimonios de la
 *              landing page. Implementa un carrusel interactivo y animado para
 *              mostrar las opiniones de los clientes. Es un componente de cliente
 *              puro y completamente internacionalizable.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * @public
 * @interface TestimonialItem
 * @description Define el contrato de datos para un único testimonio.
 */
export interface TestimonialItem {
  quote: string;
  authorName: string;
  authorTitle: string;
  authorImage: string;
}

/**
 * @public
 * @interface TestimonialsProps
 * @description Define el contrato de props para el componente `Testimonials`.
 */
export interface TestimonialsProps {
  tag: string;
  title: string;
  subtitle: string;
  testimonials: TestimonialItem[];
}

/**
 * @public
 * @component Testimonials
 * @description Orquesta el renderizado del carrusel de testimonios.
 * @param {TestimonialsProps} props - Propiedades para configurar la sección.
 * @returns {React.ReactElement}
 */
export function Testimonials({
  tag,
  title,
  subtitle,
  testimonials,
}: TestimonialsProps): React.ReactElement {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const testimonialIndex =
    ((page % testimonials.length) + testimonials.length) % testimonials.length;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  return (
    <section className="py-20">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 text-center md:px-6">
        <span className="rounded-full bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary">
          {tag}
        </span>
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="max-w-2xl text-muted-foreground">{subtitle}</p>
      </div>

      <div className="container mx-auto mt-12 relative flex h-80 items-center justify-center overflow-hidden px-4 md:px-6">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute"
          >
            <Card className="w-full max-w-2xl">
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <p className="text-xl italic">
                  "{testimonials[testimonialIndex].quote}"
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <Avatar>
                    <AvatarImage
                      src={testimonials[testimonialIndex].authorImage}
                      alt={testimonials[testimonialIndex].authorName}
                    />
                    <AvatarFallback>
                      {testimonials[testimonialIndex].authorName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">
                      {testimonials[testimonialIndex].authorName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonials[testimonialIndex].authorTitle}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 md:left-16 z-10 rounded-full"
          onClick={() => paginate(-1)}
          aria-label="Testimonio anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 md:right-16 z-10 rounded-full"
          onClick={() => paginate(1)}
          aria-label="Siguiente testimonio"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
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
 * 1. **Componente de Prueba Social**: ((Implementada)) Se ha creado un nuevo aparato que añade una sección de testimonios, un elemento crucial para generar confianza y prueba social en la `HomePage`.
 * 2. **Carrusel Interactivo y Animado**: ((Implementada)) La implementación utiliza `framer-motion` para crear un carrusel de "swipe" animado y de alto rendimiento, replicando la experiencia de usuario del diseño de referencia.
 * 3. **Componente Puro e Internacionalizable**: ((Implementada)) El componente es 100% agnóstico al contenido, preparado para ser ensamblado en `page.tsx` con textos y datos de testimonios traducidos.
 *
 * @subsection Melhorias Futuras
 * 1. **Paginación con Puntos**: ((Vigente)) Añadir indicadores de paginación (puntos) debajo del carrusel para mostrar en qué testimonio se encuentra el usuario y permitir la navegación directa a un testimonio específico.
 * 2. **Auto-Play con Pausa en Hover**: ((Vigente)) Añadir una prop opcional `autoPlay: boolean` que, si es `true`, haga que el carrusel avance automáticamente cada cierto número de segundos, pausándose cuando el usuario posa el cursor sobre la tarjeta.
 *
 * =====================================================================
 */
// src/components/landing/Testimonials.tsx
