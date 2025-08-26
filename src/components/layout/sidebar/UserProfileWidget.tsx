// src/components/layout/sidebar/UserProfileWidget.tsx
/**
 * @file UserProfileWidget.tsx
 * @description Aparato de UI atómico y de presentación puro. Renderiza el perfil del usuario
 *              de forma flotante y es 100% agnóstico a la lógica de i18n, recibiendo
 *              la función `t` como una dependencia inyectada.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { type useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useDashboardUIStore } from "@/lib/hooks/useDashboardUIStore";
import { clientLogger } from "@/lib/logging";

interface UserProfileWidgetProps {
  t: ReturnType<typeof useTranslations>;
}

export function UserProfileWidget({ t }: UserProfileWidgetProps) {
  const { user } = useDashboard();
  const { setProfileWidgetOpen } = useDashboardUIStore();

  clientLogger.trace("[UserProfileWidget] Renderizando widget de perfil puro.");

  const userInitials = (user?.user_metadata?.full_name || user?.email || "U")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-center gap-3 rounded-lg bg-card p-3 shadow-lg border w-64"
    >
      <Avatar className="h-10 w-10">
        <AvatarImage
          src={user?.user_metadata?.avatar_url}
          alt={t("userMenu_avatar_alt", {
            username: user?.user_metadata?.full_name,
          })}
        />
        <AvatarFallback>{userInitials}</AvatarFallback>
      </Avatar>
      <div className="overflow-hidden">
        <p className="truncate text-sm font-semibold">
          {user?.user_metadata?.full_name}
        </p>
        <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 ml-auto flex-shrink-0"
        onClick={() => setProfileWidgetOpen(false)}
        aria-label={t("userMenu_close_widget_aria_label")}
      >
        <X className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) Componente de Presentación Puro: Se ha eliminado la llamada interna a `useTranslations`. El componente ahora es 100% agnóstico al contenido, lo que mejora su reutilización y testabilidad.
 * 2. ((Implementada)) Resolución de Error de Compilación (TS2322): Al aceptar la prop `t`, se sincroniza el contrato con su padre (`PrimarySidebar`) y se resuelve el error de tipo.
 * 3. ((Implementada)) Experiencia de Usuario de Élite: La integración con `framer-motion` proporciona una animación de entrada/salida fluida, alineándose con la estética del "Workspace Creativo".
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) Acciones Rápidas: Se podría añadir un menú contextual (`DropdownMenu`) al hacer clic en el widget para acciones rápidas como "Ver Perfil" o "Cerrar Sesión", recibiendo los textos y callbacks como props.
 *
 * =====================================================================
 */
