// src/components/feedback/LiaChatInterface.tsx
/**
 * @file src/components/feedback/LiaChatInterface.tsx
 * @description Aparato de UI atómico que renderiza la interfaz de chat modal completa.
 *              Inspirado en la estética de "Manus", proporciona un entorno de
 *              interacción enfocado para el asistente de IA, L.I.A.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Bot, Send } from "lucide-react";

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
 * @description Renderiza un diálogo modal que contiene la interfaz de chat con L.I.A.
 * @param {LiaChatInterfaceProps} props - Propiedades para controlar el diálogo.
 * @returns {React.ReactElement}
 */
export function LiaChatInterface({
  isOpen,
  onOpenChange,
}: LiaChatInterfaceProps): React.ReactElement {
  const t = useTranslations("LiaChatWidget");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const userInput = formData.get("userInput") as string;
    if (!userInput.trim()) return;

    logger.info("[LiaChatInterface] Mensaje enviado por el usuario.", {
      message: userInput,
    });
    // TODO: Implementar la lógica de envío a la API de IA.
    (event.target as HTMLFormElement).reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 border-0 max-w-2xl bg-transparent shadow-2xl">
        <Card className="flex h-[70vh] flex-col text-card-foreground">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>{t("interface_title")}</DialogTitle>
            <DialogDescription>{t("interface_subtitle")}</DialogDescription>
          </DialogHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Placeholder para los mensajes */}
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground flex-shrink-0">
                <Bot size={20} />
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm text-foreground">
                  {t("welcome_message")}
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t p-4">
            <form onSubmit={handleSubmit} className="relative w-full">
              <Input
                name="userInput"
                placeholder={t("input_placeholder")}
                className="pr-12 h-12 bg-input border-border"
                autoComplete="off"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-2.5 top-1/2 -translate-y-1/2"
                aria-label={t("send_button_aria_label")}
              >
                <Send className="h-4 w-4" />
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
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Gestión de Estado de Chat**: ((Vigente)) Implementar un estado (`useState`) para gestionar el array de mensajes y renderizarlos dinámicamente en `CardContent`.
 * 2. **Integración con API de IA**: ((Vigente)) Conectar el `handleSubmit` a una Server Action que se comunique con un servicio de IA (ej. Vercel AI SDK) para obtener respuestas.
 * 3. **Streaming de Respuestas**: ((Vigente)) Implementar la renderización de la respuesta de la IA palabra por palabra para una UX superior.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Interfaz de Chat Funcional (Placeholder)**: ((Implementada)) Se ha creado la estructura completa de la UI de chat, proporcionando la base para la funcionalidad real.
 * 2. **Estética Inspirada en "Manus"**: ((Implementada)) El diseño sigue los principios de "Calma Enfocada", utilizando componentes como `Card` y `Dialog` para crear una experiencia de usuario limpia.
 * 3. **Full Internacionalización y Observabilidad**: ((Implementada)) Todos los textos se consumen de `next-intl` y la interacción principal del usuario se registra con `logger`.
 *
 * =====================================================================
 */
// src/components/feedback/LiaChatInterface.tsx
