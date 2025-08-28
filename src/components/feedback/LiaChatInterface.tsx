// src/components/feedback/LiaChatInterface.tsx
/**
 * @file src/components/feedback/LiaChatInterface.tsx
 * @description Aparato de UI atómico que renderiza la interfaz de chat modal completa.
 *              Ha sido refactorizado holísticamente a un estándar de élite:
 *              ahora gestiona su propio estado de mensajes (`useState`), se conecta
 *              a la `Server Action` `sendMessageToLiaAction`, y muestra dinámicamente
 *              el historial de conversación con feedback de carga y errores,
 *              siendo completamente internacionalizado.
 * @author Raz Podestá - MetaShark Tech, Florianópolis/SC, Brazil, raz.metashark.tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Bot, Loader2, Send, User } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { logger } from "@/lib/logging";
import {
  type LiaChatMessage,
  sendMessageToLiaAction,
} from "@/lib/actions/lia.actions"; // Importar la nueva acción
import { type ActionResult, isActionError } from "@/lib/validators"; // Importar isActionError

interface LiaChatInterfaceProps {
  /**
   * Controla la visibilidad del diálogo modal.
   */
  isOpen: boolean;
  /**
   * Callback que se invoca cuando el estado de apertura del diálogo cambia.
   */
  onOpenChange: (isOpen: boolean) => void;
}

/**
 * @public
 * @component LiaChatInterface
 * @description Renderiza un diálogo modal que contiene la interfaz de chat con L.I.A.,
 *              gestionando la conversación con un asistente de IA.
 * @param {LiaChatInterfaceProps} props - Propiedades para controlar el diálogo.
 * @returns {React.ReactElement}
 */
export function LiaChatInterface({
  isOpen,
  onOpenChange,
}: LiaChatInterfaceProps): React.ReactElement {
  const t = useTranslations("components.feedback.LiaChatWidget");
  const tErrors = useTranslations("shared.ValidationErrors");
  const [messages, setMessages] = useState<LiaChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isSending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null); // Referencia para scroll automático

  // Mensaje de bienvenida inicial (solo si no hay historial)
  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      setMessages([{ role: "assistant", content: t("welcome_message") }]);
    }
  }, [messages.length, t, isOpen]);

  // Scroll automático al final de los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentMessage.trim() || isSending) return;

    const userMessage: LiaChatMessage = {
      role: "user",
      content: currentMessage,
    };
    setMessages((prev) => [...prev, userMessage]);
    setCurrentMessage(""); // Limpiar el input inmediatamente
    logger.info("[LiaChatInterface] Mensaje enviado por el usuario.", {
      message: userMessage.content,
    });

    startTransition(async () => {
      // Pasa el mensaje actual a la Server Action
      const formData = new FormData();
      formData.append("message", userMessage.content);

      const result: ActionResult<LiaChatMessage> =
        await sendMessageToLiaAction(formData);

      if (result.success) {
        setMessages((prev) => [...prev, result.data]);
        logger.info("[LiaChatInterface] Respuesta de L.I.A. recibida.", {
          response: result.data.content,
        });
      } else {
        const errorMessage = isActionError(result)
          ? tErrors(result.error as any, {
              defaultValue: t("error_api_message"),
            })
          : t("error_internal_message");
        toast.error(errorMessage);
        logger.error(
          "[LiaChatInterface] Fallo al obtener respuesta de L.I.A.",
          { error: result.error }
        );
        // Opcional: añadir un mensaje de error en el chat
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: t("error_internal_message") },
        ]);
      }
    });
  };

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

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground flex-shrink-0">
                    <Bot size={20} />
                  </div>
                )}
                <div
                  className={`rounded-lg p-3 max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm font-semibold mb-1">
                    {msg.role === "user"
                      ? t("message_user_role")
                      : t("message_assistant_role")}
                  </p>
                  <p className="text-sm text-foreground">{msg.content}</p>
                </div>
                {msg.role === "user" && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground flex-shrink-0">
                    <User size={20} />
                  </div>
                )}
              </div>
            ))}
            {isSending && (
              <div className="flex items-start gap-3 justify-start">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground flex-shrink-0">
                  <Bot size={20} />
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm text-foreground flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />{" "}
                    {t("thinking_message")}
                  </p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} /> {/* Elemento para scroll */}
          </CardContent>

          <CardFooter className="border-t border-border p-4">
            <form onSubmit={handleSubmit} className="relative w-full">
              <Input
                name="message" // Cambio de `userInput` a `message` para el Server Action
                placeholder={t("input_placeholder")}
                className="pr-12 h-12 bg-input border-border"
                autoComplete="off"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                disabled={isSending}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-2.5 top-1/2 -translate-y-1/2"
                aria-label={t("send_button_aria_label")}
                disabled={!currentMessage.trim() || isSending}
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Gestión de Estado de Conversación**: ((Implementada)) Se ha implementado `useState<LiaChatMessage[]>` para gestionar el historial de mensajes, lo que permite una conversación dinámica en la UI.
 * 2. **Integración con Server Action de IA**: ((Implementada)) `handleSubmit` ahora invoca `sendMessageToLiaAction`, conectando el frontend con el backend de IA simulado.
 * 3. **Visualización Dinámica de Burbujas de Chat**: ((Implementada)) El `CardContent` mapea el array `messages` para renderizar burbujas de chat para el usuario y el asistente, con estilos diferenciados.
 * 4. **Feedback de Carga de IA**: ((Implementada)) Muestra un mensaje "L.I.A. está pensando..." con un spinner (`Loader2`) mientras se espera la respuesta de la IA.
 * 5. **Internacionalización Completa del Chat**: ((Implementada)) Todos los textos, roles y mensajes de error se consumen de `useTypedTranslations("components.feedback.LiaChatWidget")` y `tErrors("shared.ValidationErrors")`.
 * 6. **Scroll Automático**: ((Implementada)) Se ha añadido `messagesEndRef` y un `useEffect` para asegurar que el chat siempre se desplace automáticamente al último mensaje.
 * 7. **Manejo de Errores en la UI**: ((Implementada)) La UI muestra `toast.error` si la Server Action falla, utilizando claves de i18n y el guardián `isActionError`.
 * 8. **Limpieza de Input y Disablement**: ((Implementada)) El input se limpia después de enviar y el botón de enviar se deshabilita mientras se está enviando el mensaje.
 * 9. **Mensaje de Bienvenida Inicial**: ((Implementada)) El chat ahora inicia con un mensaje de bienvenida de L.I.A. cuando se abre el modal por primera vez en la sesión.
 *
 * @subsection Melhorias Futuras
 * 1. **Streaming de Respuestas de IA**: ((Vigente)) Para una UX de élite, se podría implementar el streaming de la respuesta de la IA, mostrando las palabras a medida que se generan, en lugar de esperar la respuesta completa. Esto requeriría que `sendMessageToLiaAction` use una API de streaming y que el frontend maneje la adición incremental de texto.
 * 2. **Integración Real de AI SDK**: ((Vigente)) Reemplazar la simulación de la IA en `sendMessageToLiaAction` con una integración real (ej. Vercel AI SDK, OpenAI, Gemini).
 * 3. **Contexto de Conversación Persistente**: ((Vigente)) La conversación podría persistir en la base de datos para que el usuario pueda retomar el chat en cualquier momento y desde cualquier dispositivo.
 *
 * =====================================================================
 */
