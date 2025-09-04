// src/components/landing/FAQ.tsx
/**
 * @file src/components/landing/FAQ.tsx
 * @description Componente de presentación para la sección "Preguntas Frecuentes".
 *              Es un componente de cliente puro que gestiona una UI compleja con
 *              búsqueda, filtrado, sincronización con URL y un acordeón interactivo.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 7.1.0
 */
"use client";

import { motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SearchInput } from "@/components/ui/SearchInput";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { clientLogger } from "@/lib/logger";

/**
 * @private
 * @component HighlightedText
 * @description Sub-componente que resalta una subcadena dentro de un texto.
 * @param {{ text: string, highlight: string }} props - Texto y subcadena a resaltar.
 * @returns {React.ReactElement}
 */
const HighlightedText = ({
  text,
  highlight,
}: {
  text: string;
  highlight: string;
}) => {
  if (!highlight.trim()) {
    return <>{text}</>;
  }
  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark
            key={i}
            className="bg-primary/20 text-primary-foreground rounded px-1"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

export interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

export interface FaqProps {
  tag: string;
  title: string;
  subtitle: string;
  items: FaqItem[];
  searchPlaceholder: string;
  noResultsText: string;
  clearSearchAriaLabel: string;
}

/**
 * @public
 * @component FAQ
 * @description Orquesta el renderizado de la sección de preguntas frecuentes.
 * @param {FaqProps} props - Propiedades para configurar la sección.
 * @returns {React.ReactElement}
 */
export function FAQ({
  tag,
  title,
  subtitle,
  items,
  searchPlaceholder,
  noResultsText,
  clearSearchAriaLabel,
}: FaqProps): React.ReactElement {
  clientLogger.trace("[FAQ] Renderizando componente de presentación puro.");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [activeAccordionItem, setActiveAccordionItem] = useState<
    string | undefined
  >(undefined);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const accordionContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (debouncedSearchTerm) {
      params.set("q", debouncedSearchTerm);
    } else {
      params.delete("q");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [debouncedSearchTerm, pathname, router]);

  const filteredItems = useMemo(() => {
    const safeItems = items || [];
    if (!debouncedSearchTerm.trim()) return safeItems;
    const lowercasedTerm = debouncedSearchTerm.toLowerCase();
    return safeItems.filter(
      (item) =>
        item.question.toLowerCase().includes(lowercasedTerm) ||
        (typeof item.answer === "string" &&
          item.answer.toLowerCase().includes(lowercasedTerm))
    );
  }, [items, debouncedSearchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm.trim() && filteredItems.length > 0) {
      const newActiveItem = "item-0";
      setActiveAccordionItem(newActiveItem);
      setTimeout(() => {
        const firstTrigger =
          accordionContainerRef.current?.querySelector<HTMLButtonElement>(
            '[data-radix-collection-item][role="button"]'
          );
        firstTrigger?.focus();
      }, 100);
    } else {
      setActiveAccordionItem(undefined);
    }
  }, [filteredItems, debouncedSearchTerm]);

  const FADE_UP_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-20 bg-muted/50" aria-labelledby="faq-title">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={FADE_UP_VARIANTS}
        className="container mx-auto flex flex-col items-center gap-4 px-4 text-center md:px-6"
      >
        <span className="rounded-full bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary">
          {tag}
        </span>
        <h2 id="faq-title" className="text-3xl font-bold">
          {title}
        </h2>
        <p className="max-w-2xl text-muted-foreground">{subtitle}</p>
      </motion.div>

      <div className="container mx-auto mt-12 max-w-3xl px-4 md:px-6">
        <div className="relative mb-8">
          <SearchInput
            id="faq-search"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            clearAriaLabel={clearSearchAriaLabel}
          />
        </div>

        <motion.div
          ref={accordionContainerRef}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
          aria-live="polite"
        >
          <Accordion
            type="single"
            collapsible
            className="w-full"
            value={activeAccordionItem}
            onValueChange={setActiveAccordionItem}
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <motion.div key={item.question} variants={FADE_UP_VARIANTS}>
                  <AccordionItem value={`item-${index}`}>
                    <AccordionTrigger>
                      <HighlightedText
                        text={item.question}
                        highlight={debouncedSearchTerm}
                      />
                    </AccordionTrigger>
                    <AccordionContent>
                      {typeof item.answer === "string" ? (
                        <HighlightedText
                          text={item.answer}
                          highlight={debouncedSearchTerm}
                        />
                      ) : (
                        item.answer
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-muted-foreground pt-4">
                {noResultsText}
              </p>
            )}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
// src/components/landing/FAQ.tsx
