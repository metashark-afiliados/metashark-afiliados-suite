// src/components/feedback/CommandPalette.tsx
"use client";

import React from "react";
import { setActiveWorkspaceAction } from "@/lib/actions/workspaces.actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useCommandPaletteStore } from "@/lib/hooks/use-command-palette";
import { logger } from "@/lib/logging";
import { useRouter } from "@/lib/navigation";
import { CommandPaletteContent } from "./CommandPaletteContent";

/**
 * @public
 * @component CommandPalette
 * @description Orquestador de lógica para la paleta de comandos. Corregido para
 *              utilizar importaciones de Server Action atómicas, resolviendo
 *              el error de build "server-only".
 * @author L.I.A. Legacy
 * @version 3.1.0
 */
export function CommandPalette() {
  const { user, workspaces, activeWorkspace, modules } = useDashboard();
  const { isOpen, close, toggle } = useCommandPaletteStore();
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [pages, setPages] = React.useState<"root" | "workspaces">("root");

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
    />
  );
}

/**
 * =====================================================================
 *                           MEJora Continua
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución Definitiva de Error de Build**: ((Implementada)) Se ha reemplazado la importación del barril de acciones por una importación atómica y directa de `setActiveWorkspaceAction`, eliminando la causa raíz del fallo de compilación.
 *
 * =====================================================================
 */
