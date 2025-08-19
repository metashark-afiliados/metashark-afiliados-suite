// src/components/about/TeamMemberCard.tsx
"use client";

import Image from "next/image";
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
  className?: string;
}

/**
 * @public
 * @component TeamMemberCard
 * @description Renderiza una tarjeta para un miembro del equipo. Ha sido refactorizado
 *              para ser un Client Component explícito, resolviendo una violación
 *              de reglas de React Server Components que impedía el build.
 * @param {TeamMemberCardProps} props - Propiedades para configurar la tarjeta.
 * @returns {React.ReactElement}
 */
export function TeamMemberCard({
  member,
  className,
}: TeamMemberCardProps): React.ReactElement {
  return (
    <div className={cn("h-full", className)}>
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
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Blocker de Build**: ((Implementada)) Se ha añadido la directiva `"use client"`. Esto lo declara como un Client Component, permitiendo que `TeamSection.tsx` (que también será un Client Component) lo importe y renderice correctamente, resolviendo la cascada de violaciones de RSC.
 *
 * @subsection Melhorias Futuras
 * 1. **Animación de Entrada**: ((Vigente)) Reintroducir `framer-motion` para animar la entrada de la tarjeta, mejorando el dinamismo de la página.
 *
 * =====================================================================
 */
// src/components/about/TeamMemberCard.tsx
