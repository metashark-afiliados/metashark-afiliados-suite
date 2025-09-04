// src/components/feedback/CommandAssistantGroup.tsx
/**
 * @file CommandAssistantGroup.tsx
 * @description Componente atómico y puro para el grupo de comandos del Asistente de IA.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 1.0.0
 * @see .docs-espejo/components/feedback/CommandAssistantGroup.tsx.md
 */
import React from "react";
import { type useTranslations } from "next-intl";
import { Bot } from "lucide-react";

import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";

interface CommandAssistantGroupProps {
  handleOpenLiaChat: () => void;
  runCommand: (action: () => void, commandName: string) => void;
  t: ReturnType<typeof useTranslations>;
}

export function CommandAssistantGroup({
  handleOpenLiaChat,
  runCommand,
  t,
}: CommandAssistantGroupProps): React.ReactElement {
  return (
    <>
      <CommandSeparator />
      <CommandGroup heading={t("ai_assistant_group_heading")}>
        <CommandItem
          onSelect={() => runCommand(handleOpenLiaChat, "Chat con L.I.A.")}
          className="cursor-pointer"
        >
          <Bot className="mr-2 h-4 w-4" />
          <span>{t("lia_chat_command")}</span>
        </CommandItem>
      </CommandGroup>
    </>
  );
}
// src/components/feedback/CommandAssistantGroup.tsx
