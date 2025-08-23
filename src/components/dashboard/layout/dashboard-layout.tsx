// src/components/dashboard/layout/dashboard-layout.tsx
/**
 * @file dashboard-layout.tsx
 * @description Componente de cliente que actúa como el ensamblador principal para
 *              la estructura visual del dashboard. Define la rejilla de layout y
 *              compone los componentes de la barra lateral para vistas de escritorio y móvil.
 * @author Raz Podestá (adaptado de paddle-nextjs-starter-kit)
 * @version 1.0.0
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode } from "react";

import { DashboardGradient } from "@/components/gradients/dashboard-gradient";
import { Sidebar } from "@/components/dashboard/layout/sidebar";
import { SidebarUserInfo } from "@/components/dashboard/layout/sidebar-user-info";
import "@/styles/dashboard.css";

interface Props {
  children: ReactNode;
}

export function DashboardLayout({ children }: Props) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] relative overflow-hidden">
      <DashboardGradient />

      {/* --- Sidebar para Escritorio --- */}
      <div className="hidden border-r bg-card/50 backdrop-blur-sm md:flex md:flex-col">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <Image
                src="/images/logo.png"
                alt="ConvertiKit Logo"
                width={32}
                height={32}
                priority
              />
              <span className="text-lg font-bold text-foreground">
                ConvertiKit
              </span>
            </Link>
          </div>
          <div className="flex flex-col grow overflow-y-auto">
            <Sidebar />
            <SidebarUserInfo />
          </div>
        </div>
      </div>

      {/* --- Contenido Principal --- */}
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Arquitectura de Ensamblaje (LEGO)**: ((Implementada)) Este componente es un ejemplo canónico de un ensamblador, componiendo múltiples átomos (`Sidebar`, `SidebarUserInfo`) en una estructura cohesiva.
 * 2. **Layout Responsivo**: ((Implementada)) Utiliza clases de Tailwind (`hidden`, `md:flex`) para renderizar la barra lateral solo en vistas de escritorio. La `MobileSidebar` será añadida en el `DashboardPageHeader`.
 *
 * @subsection Melhorias Futuras
 * 1. **Sidebar Colapsable**: ((Vigente)) Se podría introducir un estado (`isCollapsed`) en este componente y pasarlo a `Sidebar` para que renderice una versión compacta (solo iconos).
 *
 * =====================================================================
 */
