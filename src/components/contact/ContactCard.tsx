// src/components/contact/ContactCard.tsx
/**
 * @file ContactCard.tsx
 * @description Componente de presentación puro para mostrar una vía de contacto.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

import { DynamicIcon } from "@/components/ui/DynamicIcon";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface ContactInfo {
  icon: string | LucideIcon;
  title: string;
  description: string;
  value: string;
  href?: string;
}

export function ContactCard({ info }: { info: ContactInfo }) {
  const content = (
    <>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
        <DynamicIcon
          name={info.icon as string}
          className="h-6 w-6 text-primary"
        />
      </div>
      <CardTitle>{info.title}</CardTitle>
      <CardDescription>{info.description}</CardDescription>
      <p className="mt-4 font-semibold">{info.value}</p>
    </>
  );

  return (
    <motion.div whileHover={{ y: -5 }} className="h-full">
      <Card className="h-full text-center items-center justify-center flex flex-col p-6">
        {info.href ? (
          <a
            href={info.href}
            target="_blank"
            rel="noopener noreferrer"
            className="focus:outline-none focus:ring-2 focus:ring-ring rounded-lg"
          >
            {content}
          </a>
        ) : (
          content
        )}
      </Card>
    </motion.div>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Componente Puro y Atómico**: ((Implementada)) Presenta una única vía de contacto.
 * =====================================================================
 */
// src/components/contact/ContactCard.tsx
