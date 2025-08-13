// src/components/feedback/CommandPalette.tsx
/**
 * @file src/components/feedback/CommandPalette.tsx
 * @description Componente de paleta de comandos global. Proporciona una interfaz
 *              de búsqueda para navegar rápidamente por la aplicación y ejecutar
 *              acciones contextuales. Consume datos del `DashboardContext` y
 *              gestiona su estado con el store `useCommandPaletteStore`.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import React from "react";
import { LayoutDashboard, LogOut, User } from "lucide-react";

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
        placeholder="Escribe un comando o busca..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
        {pages === "root" && (
          <>
            <CommandGroup heading="Navegación">
              {mainNavLinks.map((link) => (
                <CommandItem
                  key={link.href}
                  onSelect={() =>
                    runCommand(() => router.push(link.href as any), link.title)
                  }
                  value={`Ir a ${link.title}`}
                >
                  <DynamicIcon name={link.icon} className="mr-2 h-4 w-4" />
                  <span>{link.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Workspaces">
              <CommandItem onSelect={() => setPages("workspaces")}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Buscar y cambiar de workspace...
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Cuenta">
              <CommandItem
                onSelect={() =>
                  runCommand(
                    () => router.push("/dashboard/settings"),
                    "Go to Settings"
                  )
                }
                value="Ajustes de Cuenta"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Mi Perfil</span>
              </CommandItem>
              <CommandItem
                onSelect={() =>
                  runCommand(sessionActions.signOutAction, "Sign Out")
                }
                value="Cerrar Sesión"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </CommandItem>
            </CommandGroup>
          </>
        )}
        {pages === "workspaces" && (
          <CommandGroup heading="Workspaces">
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
                      `Switch to ${workspace.name}`
                    )
                  }
                  value={workspace.name}
                  disabled={workspace.id === activeWorkspace?.id}
                >
                  <span className="mr-2 text-lg">{workspace.icon || "🏢"}</span>
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
 * @subsection Melhorias Futuras
 * 1. **Internacionalización**: ((Vigente)) Todos los textos estáticos ("Navegación", "Workspaces", "Cerrar Sesión", etc.) están codificados en duro y deben ser movidos a la capa de i18n y consumidos con `useTranslations`.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Cascada de Errores**: ((Implementada)) La reconstrucción de este aparato resuelve la última dependencia faltante, eliminando todos los errores de compilación `TS2307` y estabilizando completamente el `DashboardLayout`.
 * 2. **Funcionalidad de Productividad Clave**: ((Implementada)) Restaura una de las características de UX más importantes de la aplicación, proporcionando a los usuarios una forma rápida de navegar y ejecutar acciones.
 * 3. **Full Observabilidad**: ((Implementada)) La ejecución de comandos se registra con `logger.trace`, proporcionando visibilidad sobre el uso de esta funcionalidad.
 *
 * =====================================================================
 */
// src/components/feedback/CommandPalette.tsx
