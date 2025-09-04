// src/components/feedback/CommandNavigationGroup.tsx
/**
@file CommandNavigationGroup.tsx
@description Componente atómico y puro para el grupo de comandos de navegación.
@author @author RaZ Podestá - MetaShark Tech
@version 1.0.0
@see .docs-espejo/components/feedback/CommandNavigationGroup.tsx.md
*/
import React from "react";
import { type useTranslations } from "next-intl";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { type FeatureModule } from "@/lib/data/modules";
interface CommandNavigationGroupProps {
  mainNavLinks: FeatureModule[];
  runCommand: (action: () => void, commandName: string) => void;
  t: ReturnType<typeof useTranslations>;
}
export function CommandNavigationGroup({
  mainNavLinks,
  runCommand,
  t,
}: CommandNavigationGroupProps): React.ReactElement {
  return (
    <CommandGroup heading={t("navigation_group_heading")}>
      {mainNavLinks.map((link) => (
        <CommandItem
          key={link.href}
          onSelect={() => runCommand(() => {}, link.title)}
          value={t("go_to", { title: link.title })}
          className="cursor-pointer"
        >
          <DynamicIcon name={link.icon as any} className="mr-2 h-4 w-4" />
          <span>{link.title}</span>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
// src/components/feedback/CommandNavigationGroup.tsx
