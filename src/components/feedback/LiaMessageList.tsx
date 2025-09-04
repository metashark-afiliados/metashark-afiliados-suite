// src/components/feedback/LiaMessageList.tsx
/**
 * @file LiaMessageList.tsx
 * @description Componente de UI atómico y de presentación puro. Renderiza la
 *              lista de mensajes y el indicador de "está escribiendo" para el
 *              chat de L.I.A.
 * @author L.I.A. Legacy
 * @version 1.0.0
 * @see .docs-espejo/components/feedback/LiaMessageList.tsx.md
 */
"use client";

import { Bot, Loader2 } from "lucide-react";
import React from "react";

import { type LiaChatMessage } from "@/lib/actions/lia.actions";
import { LiaMessage } from "./LiaMessage";

interface LiaMessageListProps {
  messages: LiaChatMessage[];
  isSending: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  texts: {
    userRole: string;
    assistantRole: string;
    thinkingMessage: string;
  };
}

/**
 * @public
 * @component LiaMessageList
 * @description Renderiza la lista de mensajes de la conversación.
 * @param {LiaMessageListProps} props - Propiedades para configurar la lista de mensajes.
 * @returns {React.ReactElement}
 */
export function LiaMessageList({
  messages,
  isSending,
  messagesEndRef,
  texts,
}: LiaMessageListProps): React.ReactElement {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg, index) => (
        <LiaMessage key={index} message={msg} texts={texts} />
      ))}
      {isSending && (
        <div className="flex items-start gap-3 justify-start">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground flex-shrink-0">
            <Bot size={20} />
          </div>
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm text-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {texts.thinkingMessage}
            </p>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
// src/components/feedback/LiaMessageList.tsx
