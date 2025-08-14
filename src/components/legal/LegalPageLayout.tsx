// src/components/legal/LegalPageLayout.tsx
/**
 * @file LegalPageLayout.tsx
 * @description Layout de presentación atómico y reutilizable para todas las páginas legales.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

import { DynamicIcon } from "@/components/ui/DynamicIcon";

interface LegalPageLayoutProps {
  icon: string | LucideIcon;
  title: string;
  content: {
    title: string;
    body: string[];
  }[];
}

export function LegalPageLayout({
  icon,
  title,
  content,
}: LegalPageLayoutProps) {
  const FADE_UP = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={FADE_UP}
      className="container mx-auto max-w-3xl py-12 px-4"
    >
      <header className="flex items-center gap-4 mb-8 pb-4 border-b">
        <DynamicIcon name={icon as string} className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-extrabold tracking-tight">{title}</h1>
      </header>
      <div className="prose prose-invert max-w-none">
        {content.map((section) => (
          <section key={section.title} className="mb-8">
            <h2>{section.title}</h2>
            {section.body.map((paragraph, pIndex) => (
              <p key={pIndex}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
    </motion.main>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Reutilización y DRY**: ((Implementada)) Crea un template único para todas las páginas legales.
 * =====================================================================
 */
// src/components/legal/LegalPageLayout.tsx
