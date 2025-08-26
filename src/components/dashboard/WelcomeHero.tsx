// src/components/dashboard/WelcomeHero.tsx
/**
 * @file WelcomeHero.tsx
 * @description Componente de UI "Hero" soberano. Sincronizado con la SSoT
 *              de traducciones y el contrato de SearchInput.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.1.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { motion } from "framer-motion";
import React from "react";

import { SearchInput } from "@/components/ui/SearchInput";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useCommandPaletteStore } from "@/lib/hooks/use-command-palette";
import { useDashboardTranslations } from "@/lib/hooks/useDashboardTranslations";
import { clientLogger } from "@/lib/logging";

export function WelcomeHero(): React.ReactElement {
  clientLogger.trace("[WelcomeHero] Renderizando componente soberano.");

  const { user } = useDashboard();
  const { tDashboardPage } = useDashboardTranslations();
  const openCommandPalette = useCommandPaletteStore((state) => state.open);

  const username = user.user_metadata?.full_name || user.email || "User";

  const FADE_UP = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={FADE_UP}
      className="relative flex flex-col items-center justify-center text-center p-4 pt-8 pb-6 rounded-lg overflow-hidden"
    >
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% -20%, hsl(var(--primary)/0.15), transparent 60%)",
        }}
      />
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/80">
        {tDashboardPage("welcomeHero.title", { username })}
      </h1>
      <Tabs defaultValue="templates" className="mt-6">
        <TabsList>
          <TabsTrigger value="my-designs">
            {tDashboardPage("welcomeHero.tabs.myDesigns")}
          </TabsTrigger>
          <TabsTrigger value="templates">
            {tDashboardPage("welcomeHero.tabs.templates")}
          </TabsTrigger>
          <TabsTrigger value="ai-tools">
            {tDashboardPage("welcomeHero.tabs.aiTools")}
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="relative mt-6 w-full max-w-lg">
        <SearchInput
          placeholder={tDashboardPage("welcomeHero.searchPlaceholder")}
          value=""
          onChange={() => {}}
          readOnly
          onClick={openCommandPalette}
          clearAriaLabel="Clear search"
          className="h-12 text-base rounded-full pl-12 cursor-pointer"
        />
      </div>
    </motion.section>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Sincronización de Contratos:** Resuelve los errores `TS2339` y `TS2741` al consumir la SSoT de i18n correcta y cumplir con el contrato de `SearchInput`. Se elimina el uso de `t.rich` en favor de una clave simple para evitar complejidad de tipos.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Búsqueda Real:** Conectar el `onChange` a una lógica de búsqueda real.
 *
 * =====================================================================
 */
// src/components/dashboard/WelcomeHero.tsx