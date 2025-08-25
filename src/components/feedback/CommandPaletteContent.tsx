// src/components/feedback/CommandPaletteContent.tsx
/**
 * @file CommandPaletteContent.tsx
 * @description Componente de presentación puro para la UI de la paleta de comandos.
 *              Refactorizado a un estándar de élite, ahora es 100% agnóstico a la
 *              internacionalización, recibiendo la función de traducción `t`
 *              a través de su contrato de props.
 * @author L.I.A. Legacy
 * @version 2.0.0
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 * @date 2025-08-25
 */
import React from "react";
import { LayoutDashboard, LogOut, User, LayoutGrid } from "lucide-react";
import { type useTranslations } from "next-intl";

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
import { signOutAction } from "@/lib/actions/session.actions";
import { type FeatureModule } from "@/lib/data/modules";
import { type Workspace } from "@/lib/data/workspaces";

/**
 * @public
 * @interface CommandPaletteContentProps
 * @description El contrato de props para el componente de presentación.
 */
interface CommandPaletteContentProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  search: string;
  onSearchChange: (search: string) => void;
  pages: "root" | "workspaces";
  setPages: (page: "root" | "workspaces") => void;
  mainNavLinks: FeatureModule[];
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  runCommand: (action: () => void, commandName: string) => void;
  handleWorkspaceSelect: (workspaceId: string) => void;
  /**
   * @property {function} t - La función de traducción (`useTranslations`) inyectada
   *                          por el componente orquestador padre.
   */
  t: ReturnType<typeof useTranslations>;
}

export function CommandPaletteContent({
  isOpen,
  onOpenChange,
  search,
  onSearchChange,
  pages,
  setPages,
  mainNavLinks,
  workspaces,
  activeWorkspaceId,
  runCommand,
  handleWorkspaceSelect,
  t, // <-- Se recibe la prop
}: CommandPaletteContentProps) {
  // Ya no se llama a useTranslations aquí.

  return (
    <CommandDialog open={isOpen} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder={t("search_placeholder")}
        value={search}
        onValueChange={onSearchChange}
      />
      <CommandList>
        <CommandEmpty>{t("empty_results")}</CommandEmpty>
        {pages === "root" && (
          <>
            <CommandGroup heading={t("navigation_group_heading")}>
              {mainNavLinks.map((link) => (
                <CommandItem
                  key={link.href}
                  onSelect={() => runCommand(() => {}, link.title)}
                  value={t("go_to", { title: link.title })}
                >
                  <DynamicIcon
                    name={link.icon as any}
                    className="mr-2 h-4 w-4"
                  />
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
                  runCommand(() => {}, t("my_profile_command_name"))
                }
                value={t("my_profile_command_value")}
              >
                <User className="mr-2 h-4 w-4" />
                <span>{t("my_profile")}</span>
              </CommandItem>
              <form action={signOutAction} className="w-full">
                <button type="submit" className="w-full text-left">
                  <CommandItem
                    onSelect={() =>
                      runCommand(() => {}, t("sign_out_command_name"))
                    }
                    value={t("sign_out_command_value")}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("sign_out")}</span>
                  </CommandItem>
                </button>
              </form>
            </CommandGroup>
          </>
        )}
        {pages === "workspaces" && (
          <CommandGroup heading={t("workspaces_group_heading")}>
            {workspaces
              .filter((ws) =>
                ws.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((ws) => (
                <CommandItem
                  key={ws.id}
                  onSelect={() => handleWorkspaceSelect(ws.id)}
                  value={ws.name}
                  disabled={ws.id === activeWorkspaceId}
                >
                  <LayoutGrid className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{ws.name}</span>
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
 * 1. **Resolución de Error de Compilación (TS2322)**: ((Implementada)) Se ha actualizado la interfaz `CommandPaletteContentProps` para incluir la prop `t`. Esto sincroniza el contrato del componente con su orquestador y resuelve el error de tipo.
 * 2. **Componente de Presentación 100% Puro**: ((Implementada)) Al recibir `t` como prop, este componente ya no tiene ninguna dependencia de hooks de i18n, lo que lo convierte en un aparato de UI completamente puro, más simple y fácil de probar.
 *
 * @subsection Melhorias Futuras
 * 1. **Componente `CommandItemWithIcon`**: ((Vigente)) El patrón `<CommandItem><Icon />...</CommandItem>` se repite. Podría ser abstraído a un componente atómico `CommandItemWithIcon` para reducir la verbosidad y aplicar el principio DRY.
 *
 * =====================================================================
 */
// src/components/feedback/CommandPaletteContent.tsx
