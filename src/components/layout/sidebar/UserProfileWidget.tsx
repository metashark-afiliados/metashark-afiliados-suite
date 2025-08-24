// src/components/layout/sidebar/UserProfileWidget.tsx
/**
 * @file UserProfileWidget.tsx
 * @description Nuevo aparato de UI atómico y desacoplado. Renderiza el perfil
 *              del usuario de forma flotante y gestiona su propia visibilidad
 *              a través del `useDashboardUIStore`.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useDashboardUIStore } from "@/lib/hooks/useDashboardUIStore";

export function UserProfileWidget() {
  const { user } = useDashboard();
  const { setProfileWidgetOpen } = useDashboardUIStore();

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
      className="flex items-center gap-3 rounded-lg bg-card p-3 shadow-lg border"
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
        className="h-7 w-7 ml-auto"
        onClick={() => setProfileWidgetOpen(false)}
      >
        <X className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}
