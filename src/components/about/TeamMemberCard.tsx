// src/components/about/TeamMemberCard.tsx
/**
 * @file TeamMemberCard.tsx
 * @description Componente de presentación puro para una tarjeta de miembro de equipo.
 *              Como Server Component por defecto, optimiza el envío de JS al cliente.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
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
 * @description Renderiza una tarjeta para un miembro del equipo.
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
 * 1. **Alineación con Arquitectura RSC**: ((Implementada)) Se ha eliminado la directiva `"use client"` innecesaria. El componente ahora es un Server Component puro por defecto, lo que reduce la carga de JavaScript en el cliente.
 *
 * @subsection Melhorias Futuras
 * 1. **Animación Delegada**: ((Vigente)) Para añadir animaciones de entrada, este componente debe ser envuelto en un tag `<motion.div>` dentro de su componente padre de cliente (`TeamSection.tsx`), manteniendo este aparato puro.
 *
 * =====================================================================
 */
// src/components/about/TeamMemberCard.tsx
