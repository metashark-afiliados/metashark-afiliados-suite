// src/app/[locale]/contact/contact-page-client.tsx
/**
 * @file contact-page-client.tsx
 * @description Orquestador de cliente principal que ensambla las secciones de
 *              la página de Contacto.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import { motion } from "framer-motion";

import {
  ContactCard,
  type ContactInfo,
} from "@/components/contact/ContactCard";
import { ContactForm } from "@/components/contact/ContactForm";
import { Separator } from "@/components/ui/separator";

export interface ContactPageData {
  hero: {
    title: string;
    subtitle: string;
  };
  form: {
    title: string;
  };
  contactInfo: {
    title: string;
    cards: ContactInfo[];
  };
}

export function ContactPageClient({ data }: { data: ContactPageData }) {
  const STAGGER_CONTAINER = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const FADE_UP = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <main className="container mx-auto max-w-6xl py-12 px-4 space-y-16">
      <motion.header
        initial="hidden"
        animate="show"
        variants={FADE_UP}
        className="text-center py-16"
      >
        <h1 className="text-5xl font-extrabold tracking-tighter text-primary">
          {data.hero.title}
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          {data.hero.subtitle}
        </p>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={FADE_UP}
        >
          <h2 className="text-3xl font-bold mb-6">{data.form.title}</h2>
          <ContactForm />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="space-y-8"
        >
          <h2 className="text-3xl font-bold">{data.contactInfo.title}</h2>
          {data.contactInfo.cards.map((card) => (
            <motion.div key={card.title} variants={FADE_UP}>
              <ContactCard info={card} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Ensamblaje Puro**: ((Implementada)) Componente de cliente que solo ensambla, sin lógica de negocio.
 * 2. **Animación Dinámica**: ((Implementada)) Utiliza `framer-motion` para animaciones de entrada fluidas y profesionales.
 * =====================================================================
 */
// src/app/[locale]/contact/contact-page-client.tsx
