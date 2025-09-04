// src/lib/hooks/useLiaChat.ts
/**
 * @file useLiaChat.ts
 * @description Hook Soberano que encapsula toda la lógica de estado y de negocio
 *              para la interfaz de chat con L.I.A. Es el "cerebro" del ecosistema
 *              de chat, adhiriéndose estrictamente al patrón de "Hook Soberano /
 *              Componente de Presentación Puro".
 * @author L.I.A. Legacy
 * @version 1.0.0
 * @see .docs-espejo/lib/hooks/useLiaChat.ts.md
 */
"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  type LiaChatMessage,
  sendMessageToLiaAction,
} from "@/lib/actions/lia.actions";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logger";
import { isActionError, type ActionResult } from "@/lib/validators";

const ChatInputSchema = z.object({
  message: z.string().min(1),
});

type ChatFormData = z.infer<typeof ChatInputSchema>;

/**
 * @public
 * @function useLiaChat
 * @description Hook que provee toda la lógica y estado necesarios para la interfaz de chat.
 * @param {boolean} isOpen - Indica si el modal del chat está abierto.
 * @returns Un objeto con la API completa para gestionar el chat.
 */
export function useLiaChat(isOpen: boolean) {
  const t = useTypedTranslations("components.feedback.LiaChatWidget");
  const tErrors = useTypedTranslations("shared.ValidationErrors");

  const [messages, setMessages] = useState<LiaChatMessage[]>([]);
  const [isSending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const form = useForm<ChatFormData>({
    resolver: zodResolver(ChatInputSchema),
    defaultValues: { message: "" },
  });
  const { reset } = form;

  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      setMessages([{ role: "assistant", content: t("welcome_message") }]);
    }
  }, [messages.length, t, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const processSubmit: SubmitHandler<ChatFormData> = (data) => {
    const userMessage: LiaChatMessage = { role: "user", content: data.message };
    setMessages((prev) => [...prev, userMessage]);
    reset();
    clientLogger.info(
      { message: userMessage.content },
      "[useLiaChat] Mensaje enviado por el usuario."
    );

    startTransition(async () => {
      const formData = new FormData();
      formData.append("message", userMessage.content);
      const result: ActionResult<LiaChatMessage> =
        await sendMessageToLiaAction(formData);

      if (result.success) {
        setMessages((prev) => [...prev, result.data]);
        clientLogger.info(
          { response: result.data.content },
          "[useLiaChat] Respuesta de L.I.A. recibida."
        );
      } else if (isActionError(result)) {
        const errorMessage = tErrors(result.error as any, {
          defaultValue: t("error_api_message"),
        });
        toast.error(errorMessage);
        clientLogger.error(
          { error: result.error },
          "[useLiaChat] Fallo al obtener respuesta de L.I.A."
        );
      }
    });
  };

  return {
    t,
    messages,
    isSending,
    messagesEndRef,
    form,
    processSubmit,
  };
}
// src/lib/hooks/useLiaChat.ts
