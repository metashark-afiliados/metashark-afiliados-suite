// src/components/layout/sidebar/UserProfileWidget.tsx
/**
 * @file UserProfileWidget.tsx
 * @description Aparato de UI atómico. Ha sido refactorizado a un componente
 *              soberano que consume sus propias traducciones y contexto de datos,
 *              desacoplándolo de su componente padre.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 4.0.0
 */
"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useDashboardTranslations } from "@/lib/hooks/useDashboardTranslations";
import { useDashboardUIStore } from "@/lib/hooks/useDashboardUIStore";
import { clientLogger } from "@/lib/logger";

/**
 * @public
 * @component UserProfileWidget
 * @description Renderiza un widget flotante con la información del perfil del usuario.
 *              Es un componente soberano.
 * @returns {React.ReactElement}
 */
export function UserProfileWidget() {
  const { user } = useDashboard();
  const { setProfileWidgetOpen } = useDashboardUIStore();
  const { tSidebar } = useDashboardTranslations();

  clientLogger.trace(
    "[UserProfileWidget] Renderizando widget de perfil soberano."
  );

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
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="flex items-center gap-3 rounded-lg bg-card p-3 shadow-lg border w-64"
    >
      <Avatar className="h-10 w-10">
        <AvatarImage
          src={user?.user_metadata?.avatar_url}
          alt={tSidebar("userMenu_avatar_alt", {
            username: user?.user_metadata?.full_name || "usuario",
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
        aria-label={tSidebar("userMenu_close_widget_aria_label")}
      >
        <X className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}
// src/components/layout/sidebar/UserProfileWidget.tsx
