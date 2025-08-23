// src/components/dashboard/layout/sidebar.tsx
/**
 * @file sidebar.tsx
 * @description Componente de cliente atómico que renderiza la lista de
 *              navegación principal en la barra lateral del dashboard.
 *              Utiliza `usePathname` para resaltar activamente la ruta actual.
 * @author Raz Podestá (adaptado de paddle-nextjs-starter-kit)
 * @version 1.0.0
 */
"use client";

import { Album, CreditCard, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    titleKey: "dashboard",
    icon: <Home className="h-6 w-6" />,
    href: "/dashboard",
  },
  {
    titleKey: "subscriptions",
    icon: <Album className="h-6 w-6" />,
    href: "/dashboard/subscriptions",
  },
  {
    titleKey: "payments",
    icon: <CreditCard className="h-6 w-6" />,
    href: "/dashboard/payments",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations("DashboardSidebar"); // Usaremos nuestro namespace existente

  return (
    <nav className="flex flex-col grow justify-between items-start px-2 text-sm font-medium lg:px-4">
      <div className={"w-full"}>
        {sidebarItems.map((item) => (
          <Link
            key={item.titleKey}
            href={item.href}
            className={cn(
              "flex items-center text-base gap-3 px-4 py-3 rounded-md text-muted-foreground transition-all hover:text-foreground hover:bg-muted/50",
              {
                "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground":
                  item.href === "/dashboard"
                    ? pathname === item.href
                    : pathname.startsWith(item.href),
              }
            )}
          >
            {item.icon}
            {t(item.titleKey as any)}
          </Link>
        ))}
      </div>
    </nav>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente de Navegación Atómico**: ((Implementada)) Aísla la lógica de renderizado de la lista de navegación, mejorando el SRP.
 * 2. **Arquitectura Declarativa**: ((Implementada)) La lista de enlaces se define en un array `sidebarItems`, lo que facilita su mantenimiento y expansión.
 *
 * @subsection Melhorias Futuras
 * 1. **Enlaces Basados en Roles**: ((Vigente)) El array `sidebarItems` podría ser filtrado basándose en el rol del usuario (obtenido de `useDashboard`) para mostrar/ocultar enlaces como "Dev Console".
 *
 * =====================================================================
 */
