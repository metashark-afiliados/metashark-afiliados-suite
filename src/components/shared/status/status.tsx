// src/components/shared/status/status.tsx
/**
 * @file status.tsx
 * @description Componente de UI atómico y de presentación puro. Renderiza una
 *              insignia visualmente consistente para diferentes tipos de estado.
 * @author Raz Podestá (adaptado de paddle-nextjs-starter-kit)
 * @version 1.0.0
 */
"use client";

import { Check, CircleMinus, Clock4, Pause, SquarePen } from "lucide-react";
import { type ReactNode } from "react";
import { useTranslations } from "next-intl"; // Usaremos i18n

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge"; // Usaremos nuestro Badge de Shadcn

interface StatusInfo {
  [key: string]: {
    colorClasses: string;
    icon: ReactNode;
    textKey: string; // Clave para i18n
  };
}

// Mapa de configuración que asocia estados con sus propiedades visuales y de texto.
const StatusConfig: StatusInfo = {
  active: {
    colorClasses: "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400",
    icon: <Check size={16} />,
    textKey: "active",
  },
  paid: {
    colorClasses: "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400",
    icon: <Check size={16} />,
    textKey: "paid",
  },
  completed: {
    colorClasses: "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400",
    icon: <Check size={16} />,
    textKey: "completed",
  },
  trialing: {
    colorClasses: "border-sky-500/50 bg-sky-500/10 text-sky-700 dark:text-sky-400",
    icon: <Clock4 size={16} />,
    textKey: "trialing",
  },
  draft: {
    colorClasses: "border-border bg-muted text-muted-foreground",
    icon: <SquarePen size={16} />,
    textKey: "draft",
  },
  canceled: {
    colorClasses: "border-border bg-muted text-muted-foreground",
    icon: <CircleMinus size={16} />,
    textKey: "canceled",
  },
  past_due: {
    colorClasses: "border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400",
    icon: <Clock4 size={16} />,
    textKey: "past_due",
  },
  paused: {
    colorClasses: "border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    icon: <Pause size={16} />,
    textKey: "paused",
  },
  // Añadir un estado por defecto
  default: {
    colorClasses: "border-border bg-muted text-muted-foreground",
    icon: <CircleMinus size={16} />,
    textKey: "unknown",
  }
};

interface Props {
  status: string;
}

export function Status({ status }: Props) {
  const t = useTranslations("Status"); // Asume un nuevo namespace 'Status'
  const { colorClasses, icon, textKey } = StatusConfig[status] || StatusConfig.default;
  
  return (
    <Badge
      variant="outline"
      className={cn("flex items-center gap-2 w-fit", colorClasses)}
    >
      {icon}
      <span>{t(textKey as any)}</span>
    </Badge>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Dependencia**: ((Implementada)) La creación de este aparato resuelve la última dependencia de UI de `SubscriptionCards`.
 * 2. **Consistencia Visual**: ((Implementada)) Proporciona un componente reutilizable para mostrar estados, asegurando que se vean iguales en toda la aplicación.
 * 3. **Full Internacionalización**: ((Implementada)) Los textos de los estados son gestionados a través de `next-intl`, permitiendo traducciones.
 * 4. **Adaptación a `Shadcn/UI`**: ((Implementada)) Utiliza nuestro componente `Badge` como base, integrándose perfectamente en nuestro sistema de diseño.
 *
 * @subsection Melhorias Futuras
 * 1. **Manejo de Casos Desconocidos**: ((Vigente)) El fallback actual es útil. Se podría mejorar para que registre una advertencia (`logger.warn`) cuando se encuentre un `status` no definido en `StatusConfig`, facilitando la depuración.
 *
 * =====================================================================
 */