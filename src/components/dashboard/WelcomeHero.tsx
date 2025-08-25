// src/components/dashboard/WelcomeHero.tsx
/**
 * @file WelcomeHero.tsx
 * @description Componente de UI "Hero" del dashboard. Refactorizado a un
 *              estándar de élite inspirado en Canva para la v13.0.
 * @author Raz Podestá
 * @version 4.0.0
 */
"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { SearchInput } from "@/components/ui/SearchInput";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface WelcomeHeroProps {
  username: string;
  searchPlaceholder: string;
}

export function WelcomeHero({
  username,
  searchPlaceholder,
}: WelcomeHeroProps): React.ReactElement {
  const t = useTranslations("app.[locale].dashboard.page.welcomeHero");
  const firstName = username.split(" ")[0];

  const FADE_UP = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={FADE_UP}
      // --- INICIO DE REFACTORIZACIÓN VISUAL ---
      className="relative flex flex-col items-center justify-center text-center p-4 pt-8 pb-6 rounded-lg overflow-hidden"
      // --- FIN DE REFACTORIZACIÓN VISUAL ---
    >
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% -20%, hsl(var(--primary)/0.15), transparent 60%)",
        }}
      />
      {/* --- INICIO DE REFACTORIZACIÓN VISUAL --- */}
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/80">
        {t.rich("title_rich", {
          firstName: firstName,
          italic: (chunks) => (
            <i className="text-primary not-italic">{chunks}</i>
          ),
        })}
      </h1>
      {/* --- FIN DE REFACTORIZACIÓN VISUAL --- */}

      <Tabs defaultValue="templates" className="mt-6">
        <TabsList>
          <TabsTrigger value="my-designs">{t("tabs.myDesigns")}</TabsTrigger>
          <TabsTrigger value="templates">{t("tabs.templates")}</TabsTrigger>
          <TabsTrigger value="ai-tools">{t("tabs.aiTools")}</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* --- INICIO DE REFACTORIZACIÓN VISUAL --- */}
      <div className="relative mt-6 w-full max-w-lg">
        <SearchInput
          placeholder={searchPlaceholder}
          value=""
          onChange={() => {}}
          clearAriaLabel="Clear search"
          className="h-12 text-base rounded-full pl-12"
        />
      </div>
      {/* --- FIN DE REFACTORIZACIÓN VISUAL --- */}
    </motion.section>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Alineación Visual con Canva**: ((Implementada)) Se ha ajustado la tipografía, el espaciado y el estilo de la barra de búsqueda para un mayor alineamiento con el diseño de referencia.
 * 2. **Personalización Mejorada**: ((Implementada)) El saludo ahora es más personal y estilizado, utilizando solo el primer nombre en itálica.
 *
 * =====================================================================
 */
// src/components/dashboard/WelcomeHero.tsx
