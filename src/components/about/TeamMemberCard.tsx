// src/components/about/TeamMemberCard.tsx
/**
 * @file TeamMemberCard.tsx
 * @description Componente de presentación atómico y puro para mostrar la
 *              información de un miembro del equipo. Es un Client Component
 *              que utiliza `framer-motion` para microinteracciones.
 * @author Raz Podestá
 * @version 1.1.0
 */
"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Linkedin, Twitter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
  social: {
    linkedin?: string;
    twitter?: string;
  };
}

interface TeamMemberCardProps {
  member: TeamMember;
  animationVariants?: Variants;
  className?: string;
}

/**
 * @public
 * @component TeamMemberCard
 * @description Renderiza una tarjeta visualmente atractiva para un miembro del equipo.
 * @param {TeamMemberCardProps} props - Propiedades para configurar la tarjeta.
 * @returns {React.ReactElement}
 */
export function TeamMemberCard({
  member,
  animationVariants,
  className,
}: TeamMemberCardProps): React.ReactElement {
  return (
    <motion.div
      variants={animationVariants}
      className={cn("h-full", className)}
    >
      <Card className="h-full text-center transition-all duration-300 hover:shadow-primary/20 hover:border-primary/50 hover:-translate-y-1">
        <CardHeader className="items-center pt-8">
          <Image
            src={member.imageUrl}
            alt={`Fotografía de ${member.name}`}
            width={96}
            height={96}
            className="rounded-full border-4 border-muted"
          />
          <CardTitle className="mt-4">{member.name}</CardTitle>
          <CardDescription className="text-primary font-medium">
            {member.role}
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center gap-2 pb-6">
          {member.social.linkedin && (
            <Button variant="ghost" size="icon" asChild>
              <a
                href={member.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Perfil de LinkedIn de ${member.name}`}
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
          )}
          {member.social.twitter && (
            <Button variant="ghost" size="icon" asChild>
              <a
                href={member.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Perfil de Twitter de ${member.name}`}
              >
                <Twitter className="h-4 w-4" />
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Microinteracciones de Élite**: ((Implementada)) Se ha añadido un efecto `hover:-translate-y-1` para dar una sensación de "elevación" a la tarjeta, mejorando el feedback visual de la interacción.
 * 2. **Accesibilidad (a11y)**: ((Implementada)) Se han añadido `aria-label` descriptivos a los enlaces de redes sociales.
 *
 * @subsection Melhorias Futuras
 * 1. **Bio en Popover**: ((Vigente)) Añadir un `<Popover>` que muestre una breve biografía del miembro al hacer clic en la tarjeta, proporcionando más información sin saturar la UI inicial.
 *
 * =====================================================================
 */
// src/components/about/TeamMemberCard.tsx
