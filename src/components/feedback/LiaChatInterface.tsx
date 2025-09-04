// src/components/feedback/LiaChatInterface.tsx
/**
 * @file LiaChatInterface.tsx
 * @description Ensamblador de UI de élite para la interfaz de chat. Consume el
 *              hook soberano `useLiaChat` y compone los átomos de UI puros
 *              `LiaMessageList` y `LiaInputForm`.
 * @author L.I.A. Legacy
 * @version 2.0.0
 * @see .docs-espejo/components/feedback/LiaChatInterface.tsx.md
 */
"use client";

import { Bot } from "lucide-react";
import React from "react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLiaChat } from "@/lib/hooks/useLiaChat";
import { LiaInputForm } from "./LiaInputForm";
import { LiaMessageList } from "./LiaMessageList";

interface LiaChatInterfaceProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

/**
 * @public
 * @component LiaChatInterface
 * @description Ensambla la interfaz de chat modal completa.
 * @param {LiaChatInterfaceProps} props - Propiedades para controlar el diálogo.
 * @returns {React.ReactElement}
 */
export function LiaChatInterface({
  isOpen,
  onOpenChange,
}: LiaChatInterfaceProps): React.ReactElement {
  const { t, messages, isSending, messagesEndRef, form, processSubmit } =
    useLiaChat(isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 border-0 max-w-2xl bg-transparent shadow-2xl">
        <Card className="flex h-[70vh] flex-col text-card-foreground bg-popover rounded-lg">
          <DialogHeader className="p-4 border-b border-border">
            <DialogTitle className="flex items-center gap-3">
              <Bot className="h-6 w-6 text-primary" />
              {t("interface_title")}
            </DialogTitle>
            <DialogDescription>{t("interface_subtitle")}</DialogDescription>
          </DialogHeader>

          <LiaMessageList
            messages={messages}
            isSending={isSending}
            messagesEndRef={messagesEndRef}
            texts={{
              userRole: t("message_user_role"),
              assistantRole: t("message_assistant_role"),
              thinkingMessage: t("thinking_message"),
            }}
          />

          <CardFooter className="border-t border-border p-4">
            <LiaInputForm
              form={form}
              onSubmit={processSubmit}
              isSending={isSending}
              texts={{
                inputPlaceholder: t("input_placeholder"),
                sendButtonAriaLabel: t("send_button_aria_label"),
              }}
            />
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
// src/components/feedback/LiaChatInterface.tsx
