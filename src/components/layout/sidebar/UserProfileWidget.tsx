// src/components/layout/sidebar/UserProfileWidget.tsx
/**
 * @file UserProfileWidget.tsx
 * @description Aparato de UI atómico y desacoplado. Renderiza el perfil
 *              del usuario de forma flotante y gestiona su propia visibilidad
 *              a través del `useDashboardUIStore`. Es una pieza clave de la
 *              nueva arquitectura de layout "Workspace Creativo".
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useDashboardUIStore } from "@/lib/hooks/useDashboardUIStore";
import { clientLogger } from "@/lib/logging";

export function UserProfileWidget() {
  const { user } = useDashboard();
  const { setProfileWidgetOpen } = useDashboardUIStore();

  clientLogger.trace("[UserProfileWidget] Renderizando widget de perfil.");

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
          alt={`Avatar de ${user?.user_metadata?.full_name}`}
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
        aria-label="Cerrar widget de perfil"
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
 * 1. **Componente de UI Desacoplado**: ((Implementada)) Este aparato aísla la UI del perfil de usuario, controlando su estado a través de un store global, lo que permite una mayor flexibilidad en el layout.
 * 2. **Animación de Élite**: ((Implementada)) Utiliza `framer-motion` para una animación de entrada/salida fluida, mejorando la calidad percibida de la interfaz.
 *
 * @subsection Melhorias Futuras
 * 1. **Internacionalización de ARIA Label**: ((Vigente)) El `aria-label` del botón de cierre está codificado. Debería consumir un namespace de i18n para una accesibilidad completa.
 * 2. **Acciones Rápidas**: ((Vigente)) Se podría añadir un menú contextual (`DropdownMenu`) al hacer clic en el widget para acciones rápidas como "Ver Perfil" o "Cerrar Sesión".
 *
 * =====================================================================
 */
// src/components/layout/sidebar/UserProfileWidget.tsx
