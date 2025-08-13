// src/components/feedback/LiaChatWidget.tsx
/**
 * @file src/components/feedback/LiaChatWidget.tsx
 * @description Botón de acción flotante que actúa como ensamblador para la
 *              interfaz de chat modal. Gestiona el estado de visibilidad del
 *              diálogo y compone el componente `LiaChatInterface`.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Bot } from "lucide-react";

import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logging";

import { LiaChatInterface } from "./LiaChatInterface";

/**
 * @public
 * @component LiaChatWidget
 * @description Renderiza un botón flotante y gestiona la apertura y cierre del
 *              modal de la interfaz de chat con L.I.A.
 * @returns {React.ReactElement}
 */
export function LiaChatWidget(): React.ReactElement {
  const t = useTranslations("LiaChatWidget");
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  const handleOpenChat = () => {
    logger.info("[LiaChatWidget] El usuario ha abierto la interfaz de chat.");
    setIsChatOpen(true);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg bg-card border border-border/60 text-foreground hover:bg-muted"
          onClick={handleOpenChat}
          aria-label={t("aria_label")}
        >
          <Bot className="h-7 w-7" />
          <span className="sr-only">{t("aria_label")}</span>
        </Button>
      </div>
      <LiaChatInterface isOpen={isChatOpen} onOpenChange={setIsChatOpen} />
    </>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Estado Persistente**: ((Vigente)) El estado `isChatOpen` podría ser gestionado por un store de Zustand si otros componentes necesitaran abrir o cerrar el chat programáticamente.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Ensamblaje Funcional**: ((Implementada)) El widget ahora gestiona el estado del modal y compone la `LiaChatInterface`, creando una funcionalidad completa (aunque con lógica de chat de placeholder).
 * 2. **Principio de Responsabilidad Única (SRP)**: ((Implementada)) El `LiaChatWidget` se enfoca en ser el disparador, mientras que `LiaChatInterface` contiene la UI del chat, manteniendo una separación clara de responsabilidades.
 *
 * =====================================================================
 */
// src/components/feedback/LiaChatWidget.tsx
