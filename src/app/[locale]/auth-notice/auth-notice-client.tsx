// src/app/[locale]/auth-notice/auth-notice-client.tsx
/**
 * @file auth-notice-client.tsx
 * @description Componente de cliente que encapsula la lógica que depende de
 *              `useSearchParams`, permitiendo que la página sea envuelta
 *              en un Suspense Boundary.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { MailCheck, ShieldCheck } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type MessageKey = "check-email-for-confirmation" | "check-email-for-reset";

const noticeConfig: Record<
  MessageKey,
  { icon: React.ElementType; titleKey: string; descriptionKey: string }
> = {
  "check-email-for-confirmation": {
    icon: MailCheck,
    titleKey: "confirmation.title",
    descriptionKey: "confirmation.description",
  },
  "check-email-for-reset": {
    icon: ShieldCheck,
    titleKey: "reset.title",
    descriptionKey: "reset.description",
  },
};

export function AuthNoticeClient() {
  const t = useTranslations("pages.AuthNoticePage");
  const searchParams = useSearchParams();
  const messageKey = searchParams.get("message") as MessageKey;

  const config = noticeConfig[messageKey] || {
    icon: MailCheck,
    titleKey: "default.title",
    descriptionKey: "default.description",
  };

  const IconComponent = config.icon;

  return (
    <div className="w-full max-w-md">
      <Card className="border-border/60 bg-card/50 backdrop-blur-lg">
        <CardHeader className="text-center items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <IconComponent className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {t(config.titleKey as any)}
          </CardTitle>
          <CardDescription>{t(config.descriptionKey as any)}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Futuro: Añadir un botón de "Reenviar email" con temporizador */}
        </CardContent>
      </Card>
    </div>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad**: ((Implementada)) Este nuevo componente aísla la lógica de cliente, permitiendo la implementación de Suspense.
 *
 * =====================================================================
 */
// src/app/[locale]/auth-notice/auth-notice-client.tsx
