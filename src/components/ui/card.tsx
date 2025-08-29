// src/components/ui/card.tsx
/**
 * @file src/components/ui/card.tsx
 * @description Componente de Tarjeta y sus sub-componentes. Ha sido refactorizado
 *              holísticamente para incluir un componente `CardSkeleton` de alta
 *              fidelidad para estados de carga, resolviendo un error de importación.
 * @author L.I.A. Legacy (Reconstrucción fiel de Shadcn/UI)
 * @version 2.0.0
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

const CardSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-lg border bg-card p-6 animate-pulse", className)}
    {...props}
  >
    <div className="flex items-center space-x-4">
      <div className="rounded-full bg-muted h-12 w-12"></div>
      <div className="space-y-2">
        <div className="h-4 w-[250px] bg-muted rounded"></div>
        <div className="h-4 w-[200px] bg-muted rounded"></div>
      </div>
    </div>
  </div>
));
CardSkeleton.displayName = "CardSkeleton";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardSkeleton,
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 *
 * @subsection Melhorias Futuras
 * 1. **Variantes de Esqueleto**: ((Vigente)) El `CardSkeleton` podría ser mejorado para aceptar una prop `variant` que altere su layout interno para simular diferentes tipos de tarjetas (ej. `variant="profile"` vs `variant="article"`), proporcionando un feedback de carga aún más fiel.
 * 2. **Composición de Esqueleto**: ((Vigente)) Crear componentes `Skeleton` atómicos (ej. `<Skeleton className="h-4 w-full" />`) para permitir la composición de esqueletos personalizados dentro de un `Card` vacío, ofreciendo máxima flexibilidad.
 *
 * =====================================================================
 */
// src/components/ui/card.tsx