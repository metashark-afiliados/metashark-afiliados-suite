// src/components/feedback/CommandPalette.tsx
/**
 * @file CommandPalette.tsx
 * @description Orquestador de lógica para la paleta de comandos. Consume
 *              stores y contextos para proveer de estado al componente de
 *              presentación `CommandPaletteContent`.
 * @author L.I.A. Legacy
 * @version 6.0.0
 * @see .docs-espejo/components/feedback/CommandPalette.tsx.md
 */
"use client";

import { useRouter } from "next/navigation";
import React from "react";

import { setActiveWorkspaceAction } from "@/lib/actions/workspaces.actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useCommandPaletteStore } from "@/lib/hooks/use-command-palette";
import { useLiaChatStore } from "@/lib/hooks/useLiaChatStore";
import { logger } from "@/lib/logger";
import { CommandPaletteContent } from "./CommandPaletteContent";

export function CommandPalette() {
  const { user, workspaces, activeWorkspace, modules } = useDashboard();
  const { isOpen, close, toggle } = useCommandPaletteStore();
  const openLiaChat = useLiaChatStore((state) => state.openChat);
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
      const context = { userId: user.id, command: commandName };
      logger.trace(context, "[CommandPalette] Ejecutando comando.");
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

  const handleOpenLiaChat = () => {
    openLiaChat();
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
      handleOpenLiaChat={handleOpenLiaChat}
    />
  );
}
// src/components/feedback/CommandPalette.tsx