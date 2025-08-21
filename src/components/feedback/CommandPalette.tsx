// src/components/feedback/CommandPalette.tsx
"use client";

import { workspaces as workspaceActions } from "@/lib/actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useCommandPaletteStore } from "@/lib/hooks/use-command-palette";
import { logger } from "@/lib/logging";
import { useRouter } from "@/lib/navigation";
import React from "react";
import { CommandPaletteContent } from "./CommandPaletteContent";

/**
 * @public
 * @component CommandPalette
 * @description Orquestador de lógica para la paleta de comandos. Gestiona el estado
 *              global, consume el contexto del dashboard y define las acciones a
 *              ejecutar, pasando toda la información al componente de presentación puro.
 * @author L.I.A. Legacy
 * @version 3.0.0
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
      () => workspaceActions.setActiveWorkspaceAction(workspaceId),
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
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Arquitectura de Orquestador Puro (LEGO)**: ((Implementada)) El componente ahora es un orquestador limpio que solo gestiona lógica, adhiriéndose al patrón de "componente contenedor/presentacional".
 * 2. **Error de Build Resuelto**: ((Implementada)) Al no importar ya el barril de acciones, este componente ya no contamina la cadena de dependencias del cliente.
 *
 * =====================================================================
 */
