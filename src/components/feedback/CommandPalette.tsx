// src/components/feedback/CommandPalette.tsx
/**
 * @file src/components/feedback/CommandPalette.tsx
 * @description Componente de paleta de comandos global. Ha sido refactorizado
 *              para eliminar una referencia a la propiedad obsoleta `workspace.icon`,
 *              resolviendo un error de compilación crítico (TS2339).
 * @author L.I.A. Legacy
 * @version 2.0.1
 */
"use client";

import React from "react";
import { LayoutDashboard, LogOut, User, LayoutGrid } from "lucide-react"; // Añadido LayoutGrid
import { useTranslations } from "next-intl";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import {
  session as sessionActions,
  workspaces as workspaceActions,
} from "@/lib/actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useCommandPaletteStore } from "@/lib/hooks/use-command-palette";
import { logger } from "@/lib/logging";
import { useRouter } from "@/lib/navigation";

export function CommandPalette() {
  const { user, workspaces, activeWorkspace, modules } = useDashboard();
  const { isOpen, close, toggle } = useCommandPaletteStore();
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [pages, setPages] = React.useState<"root" | "workspaces">("root");

  const t = useTranslations("CommandPalette");

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

  const mainNavLinks = modules.filter((module) => module.status === "active");

  return (
    <CommandDialog open={isOpen} onOpenChange={close}>
      <CommandInput
        placeholder={t("search_placeholder")}
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>{t("empty_results")}</CommandEmpty>
        {pages === "root" && (
          <>
            <CommandGroup heading={t("navigation_group_heading")}>
              {mainNavLinks.map((link) => (
                <CommandItem
                  key={link.href}
                  onSelect={() =>
                    runCommand(() => router.push(link.href as any), link.title)
                  }
                  value={t("go_to", { title: link.title })}
                >
                  <DynamicIcon name={link.icon} className="mr-2 h-4 w-4" />
                  <span>{link.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading={t("workspaces_group_heading")}>
              <CommandItem onSelect={() => setPages("workspaces")}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                {t("search_workspaces_command")}
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading={t("account_group_heading")}>
              <CommandItem
                onSelect={() =>
                  runCommand(
                    () => router.push("/dashboard/settings"),
                    t("my_profile_command_name")
                  )
                }
                value={t("my_profile_command_value")}
              >
                <User className="mr-2 h-4 w-4" />
                <span>{t("my_profile")}</span>
              </CommandItem>
              <CommandItem
                onSelect={() =>
                  runCommand(
                    sessionActions.signOutAction,
                    t("sign_out_command_name")
                  )
                }
                value={t("sign_out_command_value")}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t("sign_out")}</span>
              </CommandItem>
            </CommandGroup>
          </>
        )}
        {pages === "workspaces" && (
          <CommandGroup heading={t("workspaces_group_heading")}>
            {workspaces
              .filter((workspace) =>
                workspace.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((workspace) => (
                <CommandItem
                  key={workspace.id}
                  onSelect={() =>
                    runCommand(
                      () =>
                        workspaceActions.setActiveWorkspaceAction(workspace.id),
                      t("switch_to_workspace", {
                        workspaceName: workspace.name,
                      })
                    )
                  }
                  value={workspace.name}
                  disabled={workspace.id === activeWorkspace?.id}
                >
                  {/* --- INICIO DE CORRECCIÓN (TS2339) --- */}
                  {/* La propiedad 'icon' fue eliminada del tipo 'Workspace'. Se utiliza un icono genérico como fallback. */}
                  <span className="mr-2 text-lg">
                    <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                  </span>
                  {/* --- FIN DE CORRECCIÓN --- */}
                  <span>{workspace.name}</span>
                </CommandItem>
              ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error Crítico (TS2339)**: ((Implementada)) Se ha eliminado la referencia a la propiedad obsoleta `workspace.icon`, resolviendo el error de compilación.
 * 2. **Sincronización de Contrato**: ((Implementada)) El componente ahora refleja correctamente el contrato de datos del tipo `Workspace`, eliminando la deuda técnica de sincronización.
 * 3. **Fallback Visual Consistente**: ((Implementada)) Se ha sustituido el emoji codificado por un icono `LayoutGrid` de `lucide-react`, manteniendo la consistencia visual con el resto de la aplicación.
 *
 * @subsection Melhorias Futuras
 * 1. **Reintroducción de Iconos**: ((Vigente)) Si la funcionalidad de iconos por workspace es un requisito de negocio, el plan de acción correcto es reintroducir el campo `icon` en la tabla `workspaces` (y su tipo correspondiente) a través de una migración de base de datos controlada.
 *
 * =====================================================================
 */
