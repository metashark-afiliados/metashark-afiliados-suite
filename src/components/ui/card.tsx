// src/components/ui/card.tsx
/**
 * @file src/components/ui/card.tsx
 * @description Componente de Tarjeta y sus sub-componentes. Proporciona una
 *              estructura semántica y estilizada para agrupar contenido relacionado.
 *              Es la base para la mayoría de los bloques de UI de la aplicación.
 * @author L.I.A. Legacy (Reconstrucción fiel de Shadcn/UI)
 * @version 1.0.0
 */
import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente Estructural**: ((Implementada)) La migración de este componente proporciona el primitivo de layout esencial para construir interfaces basadas en tarjetas, como las secciones de `Features` y `Testimonials`.
 *
 * @subsection Melhorias Futuras
 * 1. **Variantes de Estilo (CVA)**: ((Vigente)) Al igual que el componente `Button`, el `Card` podría ser mejorado con `class-variance-authority` para soportar diferentes variantes de estilo (ej. `variant="outline"`, `variant="ghost"`) que alteren sutilmente su apariencia.
 *
 * =====================================================================
 */
// src/components/ui/card.tsx
