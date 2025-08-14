// src/components/about/TeamMemberCard.tsx
/**
 * @file TeamMemberCard.tsx
 * @description Componente de presentación atómico y puro para mostrar la
 *              información de un miembro del equipo de forma visualmente atractiva.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Linkedin, Twitter } from "lucide-react";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  animationVariants: Variants;
}

export function TeamMemberCard({
  member,
  animationVariants,
}: TeamMemberCardProps) {
  return (
    <motion.div variants={animationVariants}>
      <Card className="text-center transition-all hover:shadow-primary/20 hover:border-primary/50">
        <CardHeader className="items-center">
          <Image
            src={member.imageUrl}
            alt={`Fotografía de ${member.name}`}
            width={96}
            height={96}
            className="rounded-full border-4 border-muted"
          />
          <CardTitle className="mt-4">{member.name}</CardTitle>
          <CardDescription className="text-primary">
            {member.role}
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center gap-2">
          {member.social.linkedin && (
            <Button variant="ghost" size="icon" asChild>
              <a
                href={member.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
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
 * @subsection Melhorias Adicionadas
 * 1. **Componente Puro y Atómico**: ((Implementada)) Encapsula la presentación de un miembro del equipo.
 * @subsection Melhorias Futuras
 * 1. **Bio en Popover**: ((Vigente)) Añadir un `<Popover>` que muestre una breve biografía del miembro al hacer clic.
 * =====================================================================
 */
// src/components/about/TeamMemberCard.tsx
