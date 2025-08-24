// src/components/feedback/LiaChatWidget.tsx
/**
 * @file LiaChatWidget.tsx
 * @description Botón de acción flotante. Refactorizado para tener un estilo
 *              visual más prominente y alineado con la nueva directiva de diseño.
 * @author L.I.A. Legacy
 * @version 4.0.0
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Bot } from "lucide-react";

import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logging";

import { LiaChatInterface } from "./LiaChatInterface";

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
        {/* --- INICIO DE REFACTORIZACIÓN VISUAL --- */}
        <Button
          size="lg"
          className="rounded-full h-16 w-16 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-transform hover:scale-110"
          onClick={handleOpenChat}
          aria-label={t("aria_label")}
        >
          <Bot className="h-8 w-8" />
          <span className="sr-only">{t("aria_label")}</span>
        </Button>
        {/* --- FIN DE REFACTORIZACIÓN VISUAL --- */}
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
 * @subsection Melhorias Adicionadas
 * 1. **Estilo Visual Prominente**: ((Implementada)) El botón ahora utiliza el color `primary`, es más grande y tiene un efecto de `hover` más notorio, cumpliendo con la directiva visual.
 *
 * =====================================================================
 */
// src/components/feedback/LiaChatWidget.tsx
