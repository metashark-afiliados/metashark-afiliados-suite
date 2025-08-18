// src/components/dashboard/WelcomeHero.tsx
/**
 * @file src/components/dashboard/WelcomeHero.tsx
 * @description Componente de UI "Hero" del dashboard. Refactorizado a la
 *              arquitectura "Hub Creativo" v12.0, ahora es un componente
 *              de presentación puro, enfocado en dar la bienvenida al usuario
 *              y proporcionar una herramienta de búsqueda central.
 * @author Raz Podestá
 * @version 3.0.0
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

/**
 * @public
 * @component WelcomeHero
 * @description Renderiza la sección de bienvenida y búsqueda del dashboard.
 * @param {WelcomeHeroProps} props - Propiedades para configurar el componente.
 * @returns {React.ReactElement}
 */
export function WelcomeHero({
  username,
  searchPlaceholder,
}: WelcomeHeroProps): React.ReactElement {
  const t = useTranslations("DashboardPage.welcomeHero");
  const title = t("title", { username });

  const FADE_UP = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={FADE_UP}
      className="relative flex flex-col items-center justify-center text-center p-8 md:pt-16 md:pb-12 rounded-lg overflow-hidden"
    >
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% -20%, hsl(var(--color-primary)/0.15), transparent 60%)",
        }}
      />
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/80">
        {title}
      </h1>

      <Tabs defaultValue="templates" className="mt-6">
        <TabsList>
          <TabsTrigger value="my-designs">{t("tabs.myDesigns")}</TabsTrigger>
          <TabsTrigger value="templates">{t("tabs.templates")}</TabsTrigger>
          <TabsTrigger value="ai-tools">{t("tabs.aiTools")}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="relative mt-8 w-full max-w-2xl">
        <SearchInput
          placeholder={searchPlaceholder}
          value=""
          onChange={() => {}}
          clearAriaLabel="Clear search"
          className="h-14 text-lg pl-12"
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
 * 1. **Atomicidad y SRP**: ((Implementada)) Se ha eliminado el `ActionDock` de este componente. `WelcomeHero` ahora tiene la única responsabilidad de dar la bienvenida y proporcionar la búsqueda principal, adhiriéndose a la "Filosofía LEGO".
 * 2. **Componente Puro**: ((Implementada)) El componente es ahora 100% de presentación y agnóstico al estado, recibiendo todo su contenido a través de props.
 *
 * @subsection Melhorias Futuras
 * 1. **Funcionalidad de Búsqueda**: ((Vigente)) Conectar el `SearchInput` a un hook que realice una búsqueda global en plantillas, campañas y sitios del usuario.
 * 2. **Funcionalidad de Pestañas (Tabs)**: ((Vigente)) Implementar la lógica para que las pestañas filtren el contenido mostrado debajo (ej. mostrar una galería de plantillas o diseños del usuario).
 *
 * =====================================================================
 */
// src/components/dashboard/WelcomeHero.tsx
