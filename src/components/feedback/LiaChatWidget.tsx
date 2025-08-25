/**
 * @file LiaChatWidget.tsx
 * @description Botón de acción flotante. Ha sido refactorizado a un estándar
 *              de élite para consumir el store de Zustand `useLiaChatStore` y el
 *              namespace de i18n canónico, resolviendo un error de build en Vercel.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Bot } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLiaChatStore } from "@/lib/hooks/useLiaChatStore";
import { logger } from "@/lib/logging";

import { LiaChatInterface } from "./LiaChatInterface";

/**
 * @public
 * @component LiaChatWidget
 * @description Renderiza el botón de acción flotante para el chat de L.I.A. y
 *              orquesta la visibilidad del modal de la interfaz de chat.
 * @returns {React.ReactElement}
 */
export function LiaChatWidget(): React.ReactElement {
  // --- INICIO DE CORRECCIÓN ARQUITECTÓNICA (I18N Namespace) ---
  const t = useTranslations("components.feedback.LiaChatWidget");
  // --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---

  // --- INICIO DE MEJORA ARQUITECTÓNICA (Estado Global) ---
  const { isOpen, openChat, closeChat } = useLiaChatStore();
  // --- FIN DE MEJORA ARQUITECTÓNICA ---

  const handleOpenChat = () => {
    logger.info("[LiaChatWidget] El usuario ha abierto la interfaz de chat.");
    openChat();
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="rounded-full h-16 w-16 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-transform hover:scale-110"
          onClick={handleOpenChat}
          aria-label={t("aria_label")}
        >
          <Bot className="h-8 w-8" />
          <span className="sr-only">{t("aria_label")}</span>
        </Button>
      </div>
      <LiaChatInterface isOpen={isOpen} onOpenChange={closeChat} />
    </>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Blocker de Build**: ((Implementada)) Se ha corregido la llamada a `useTranslations` con el namespace canónico, resolviendo otra instancia del error `MISSING_MESSAGE`.
 * 2. **Gestión de Estado de Élite**: ((Implementada)) Se ha reemplazado el `useState` local por el store global `useLiaChatStore`. Esto desacopla completamente el estado de la UI del componente, permitiendo que otros aparatos (como la paleta de comandos) puedan abrir el chat programáticamente.
 *
 * @subsection Melhorias Futuras
 * 1. **Animación de Entrada**: ((Vigente)) El botón del widget podría tener una animación de entrada sutil (`framer-motion`) cuando la página carga, para atraer la atención del usuario sin ser intrusivo.
 *
 * =====================================================================
 */
