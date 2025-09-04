// src/components/feedback/LiaMessage.tsx
/**
 * @file LiaMessage.tsx
 * @description Componente de UI atómico y de presentación puro. Renderiza una
 *              única "burbuja" de mensaje en la interfaz de chat.
 * @author L.I.A. Legacy
 * @version 1.0.0
 * @see .docs-espejo/components/feedback/LiaMessage.tsx.md
 */
"use client";

import { Bot, User } from "lucide-react";
import React from "react";

import { type LiaChatMessage } from "@/lib/actions/lia.actions";
import { cn } from "@/lib/utils";

interface LiaMessageProps {
  message: LiaChatMessage;
  texts: {
    userRole: string;
    assistantRole: string;
  };
}

/**
 * @public
 * @component LiaMessage
 * @description Renderiza una única burbuja de mensaje de chat.
 * @param {LiaMessageProps} props - Propiedades para configurar el mensaje.
 * @returns {React.ReactElement}
 */
export function LiaMessage({
  message,
  texts,
}: LiaMessageProps): React.ReactElement {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex items-start gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground flex-shrink-0">
          <Bot size={20} />
        </div>
      )}
      <div
        className={cn(
          "rounded-lg p-3 max-w-[80%]",
          isUser
            ? "bg-secondary text-secondary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        <p className="text-sm font-semibold mb-1">
          {isUser ? texts.userRole : texts.assistantRole}
        </p>
        <p className="text-sm text-foreground">{message.content}</p>
      </div>
      {isUser && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground flex-shrink-0">
          <User size={20} />
        </div>
      )}
    </div>
  );
}
// src/components/feedback/LiaMessage.tsx
