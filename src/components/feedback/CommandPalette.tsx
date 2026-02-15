// src/components/feedback/CommandPalette.tsx
/**
 * @file CommandPalette.tsx
 * @description Orquestador de lógica para la paleta de comandos. Sincronizado
 *              para consumir el namespace de i18n canónico y completo,
 *              resolviendo el error `MISSING_MESSAGE`.
 * @author L.I.A. Legacy
 * @version 4.1.0
 */
"use client";

import React from "react";
import { useRouter } from "next/navigation";
// --- INICIO DE CORRECCIÓN: Namespace explícito ---
import { useTranslations } from "next-intl";
// --- FIN DE CORRECCIÓN ---

import { setActiveWorkspaceAction } from "@/lib/actions/workspaces.actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useCommandPaletteStore } from "@/lib/hooks/use-command-palette";
import { logger } from "@/lib/logging";
import { CommandPaletteContent } from "./CommandPaletteContent";

export function CommandPalette() {
  const { user, workspaces, activeWorkspace, modules } = useDashboard();
  const { isOpen, close, toggle } = useCommandPaletteStore();
  const router = useRouter(); // Se usa el de 'next/navigation' ya que no hay rutas parametrizadas.
  const [search, setSearch] = React.useState("");
  const [pages, setPages] = React.useState<"root" | "workspaces">("root");

  // --- INICIO DE CORRECCIÓN: Consumo de namespace completo ---
  const t = useTranslations("components.feedback.CommandPalette");
  // --- FIN DE CORRECCIÓN ---

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPages("root");
        toggle();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  React.useEffect(() => {
    if (!isOpen) setSearch("");
  }, [isOpen]);

  const runCommand = React.useCallback(
    (action: () => void, commandName: string) => {
      logger.trace("[CommandPalette] Ejecutando comando.", {
        userId: user.id,
        command: commandName,
      });
      close();
      action();
    },
    [close, user.id]
  );

  const handleNavCommand = (href: any, title: string) => {
    runCommand(() => router.push(href), title);
  };

  const handleWorkspaceSelect = (workspaceId: string) => {
    runCommand(
      () => setActiveWorkspaceAction(workspaceId),
      `Switch to ${workspaceId}`
    );
  };

  const mainNavLinks = modules.filter((module) => module.status === "active");

  return (
    <CommandPaletteContent
      isOpen={isOpen}
      onOpenChange={close}
      search={search}
      onSearchChange={setSearch}
      pages={pages}
      setPages={setPages}
      mainNavLinks={mainNavLinks}
      workspaces={workspaces}
      activeWorkspaceId={activeWorkspace?.id || null}
      runCommand={handleNavCommand}
      handleWorkspaceSelect={handleWorkspaceSelect}
      t={t} // Se pasa la función 't' al componente de presentación
    />
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error `MISSING_MESSAGE`**: ((Implementada)) Se ha corregido la llamada a `useTranslations` para que utilice el namespace completo y canónico, resolviendo la causa raíz del error en tiempo de ejecución.
 * 2. **Desacoplamiento de i18n**: ((Implementada)) La función `t` ahora se pasa como prop a `CommandPaletteContent`, convirtiendo a este último en un componente de presentación aún más puro y desacoplado, que ya no necesita conocer la estructura de namespaces.
 *
 * @subsection Melhorias Futuras
 * 1. **Comandos de Acción Directa**: ((Vigente)) El `CommandPalette` podría ser extendido para ejecutar Server Actions que no son de navegación, como "Crear Nuevo Sitio".
 *
 * =====================================================================
 */
// src/components/feedback/CommandPalette.tsx
