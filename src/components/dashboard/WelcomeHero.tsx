// src/components/dashboard/WelcomeHero.tsx
/**
 * @file WelcomeHero.tsx
 * @description Componente de UI "Hero" de presentación puro para el Hub Creativo.
 *              Ha sido refactorizado a un estándar de élite para ser un
 *              ensamblador 100% agnóstico a la lógica de negocio, consumiendo
 *              el hook soberano `useWelcomeHero` para obtener todo su estado y
 *              contenido.
 * @author Raz Podestá - MetaShark Tech
 * @version 8.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { motion } from "framer-motion";
import React from "react";

import { SearchInput } from "@/components/ui/SearchInput";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWelcomeHero } from "@/lib/hooks/useWelcomeHero";
import { clientLogger } from "@/lib/logger";

/**
 * @public
 * @component WelcomeHero
 * @description Ensambla la sección de bienvenida del "Hub Creativo". Es un
 *              componente de presentación puro que delega toda su lógica al
 *              hook `useWelcomeHero`.
 * @returns {React.ReactElement}
 */
export function WelcomeHero(): React.ReactElement {
  clientLogger.trace(
    "[WelcomeHero] Renderizando componente de presentación puro."
  );

  const { t, username, openCommandPalette } = useWelcomeHero();

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
          clearAriaLabel={t("search.clear_aria")}
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
 * @subsection Melhorias Futuras
 * 1. **Pestañas (Tabs) Funcionales**: Conectar los `TabsTrigger` a una función expuesta por `useWelcomeHero` que establezca un contexto inicial en la `CommandPalette` al abrirla (ej. al hacer clic en "Templates", la paleta se abre mostrando solo plantillas).
 * 2. **Esqueleto de Carga (Skeleton)**: Si `useWelcomeHero` llegara a implementar un estado de carga, este componente debería renderizar un esqueleto de UI (`<Skeleton>`) para el título y las pestañas, mejorando la UX percibida.
 * 3. **Animación de Pestañas**: Añadir una animación sutil con `framer-motion` (`layoutId`) al indicador de la pestaña activa en `TabsList` para una transición más fluida.
 * 4. **Pruebas Unitarias Aisladas**: Este componente ahora es fácilmente testeable con Vitest y React Testing Library, mockeando el hook `useWelcomeHero` para proveer diferentes estados (diferentes nombres de usuario, idiomas, etc.) y haciendo aserciones sobre la UI renderizada.
 * 5. **Componente `HeroSearch` Atómico**: La `div` que contiene el `SearchInput` podría ser extraída a su propio componente atómico (`HeroSearch.tsx`) si este patrón de búsqueda se reutilizara en otras secciones "Hero" de la aplicación.
 * =====================================================================
 */
// src/components/dashboard/WelcomeHero.tsx
