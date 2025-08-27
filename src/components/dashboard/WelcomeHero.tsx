/**
 * @file WelcomeHero.tsx
 * @description Componente de UI "Hero" soberano para el Hub Creativo. Ha sido
 *              refactorizado a un estándar de élite para consumir su propio
 *              namespace de i18n (`useTypedTranslations`), desacoplándolo del
 *              hook genérico y de la página principal del dashboard.
 * @author Raz Podestá - MetaShark Tech
 * @version 6.0.0
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
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logging";

export function WelcomeHero(): React.ReactElement {
  clientLogger.trace("[WelcomeHero] Renderizando componente soberano.");

  const { user } = useDashboard();
  const t = useTypedTranslations("components.dashboard.WelcomeHero");
  const openCommandPalette = useCommandPaletteStore((state) => state.open);

  const username =
    user.user_metadata?.full_name?.split(" ")[0] || user.email || "User";

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
        {t("title", { username })}
      </h1>
      <Tabs defaultValue="templates" className="mt-6">
        <TabsList>
          <TabsTrigger value="my-designs">{t("tabs.myDesigns")}</TabsTrigger>
          <TabsTrigger value="templates">{t("tabs.templates")}</TabsTrigger>
          <TabsTrigger value="ai-tools">{t("tabs.aiTools")}</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="relative mt-6 w-full max-w-lg">
        <SearchInput
          placeholder={t("searchPlaceholder")}
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
 * 1. **Soberanía de Internacionalización (SRP)**: ((Implementada)) El componente ahora consume su propio namespace `components.dashboard.WelcomeHero` a través de `useTypedTranslations`, desacoplándolo del hook genérico. Esto mejora la modularidad y la mantenibilidad.
 * 2. **Simplificación de Claves**: ((Implementada)) Las claves de traducción ahora son directas (`t("title")`) en lugar de anidadas (`t("welcomeHero.title")`), lo que hace el código más limpio.
 * 3. **Observabilidad Mejorada**: ((Implementada)) Se ha añadido `clientLogger.trace` para registrar el renderizado del componente.
 * 4. **UX Mejorada**: ((Implementada)) El saludo ahora utiliza solo el primer nombre del usuario para un tono más personal.
 *
 * @subsection Melhorias Futuras
 * 1. **Pestañas Funcionales**: ((Vigente)) Las pestañas son actualmente decorativas. Podrían conectarse al `useCommandPaletteStore` para establecer un contexto inicial y filtrar los resultados de la paleta de comandos.
 * 2. **Saludo Contextual**: ((Vigente)) El saludo podría ser sensible a la hora del día (ej. "Buenas tardes, {username}").
 * 3. **Internacionalización Completa**: ((Pendiente)) El `clearAriaLabel` para el `SearchInput` está actualmente codificado. Debería ser añadido al schema y al archivo de mensajes para una internacionalización completa.
 *
 * =====================================================================
 */
