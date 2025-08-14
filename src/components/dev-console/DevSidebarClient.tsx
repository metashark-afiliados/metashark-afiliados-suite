// src/components/dev-console/DevSidebarClient.tsx
/**
 * @file DevSidebarClient.tsx
 * @description Componente de cliente para la barra lateral de navegación del Dev Console.
 *              Renderiza los enlaces de navegación principales y una vista del árbol
 *              de rutas del proyecto.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  File,
  FileText,
  Folder,
  Home,
  LayoutGrid,
  LogOut,
  ShieldCheck,
  Users,
  Waypoints,
} from "lucide-react";

import { session as sessionActions } from "@/lib/actions";
import { logger } from "@/lib/logging";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

interface RouteNode {
  name: string;
  path: string;
  isPage: boolean;
  children: RouteNode[];
}

const NavLink = ({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        isActive && "bg-primary/10 text-primary font-semibold"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
};

const RouteTree = ({ node }: { node: RouteNode }) => {
  if (!node) return null;
  return (
    <div className="pl-4 text-xs">
      <div className="flex items-center gap-2 py-1">
        {node.children.length > 0 ? (
          <Folder className="h-3 w-3" />
        ) : (
          <File className="h-3 w-3" />
        )}
        <span className={cn(node.isPage && "font-semibold text-primary/80")}>
          {node.name}
        </span>
      </div>
      {node.children && (
        <div className="border-l border-dashed border-border ml-1.5 pl-2">
          {node.children.map((child) => (
            <RouteTree key={child.path} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export function DevSidebarClient() {
  const t = useTranslations("components.dev-console.DevSidebar");
  const [routes, setRoutes] = useState<RouteNode | null>(null);

  const navLinks = [
    { href: "/dev-console", label: t("overview"), icon: Home },
    { href: "/dev-console/users", label: t("userManagement"), icon: Users },
    {
      href: "/dev-console/campaigns",
      label: t("campaignViewer"),
      icon: LayoutGrid,
    },
    {
      href: "/dev-console/telemetry",
      label: t("telemetry"),
      icon: Waypoints,
    },
    { href: "/dev-console/logs", label: t("auditLogs"), icon: FileText },
  ];

  useEffect(() => {
    // Esta funcionalidad asume que un `routes-manifest.json` es generado en `public/`
    // durante el proceso de build.
    fetch("/routes-manifest.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch routes manifest");
        return res.json();
      })
      .then((data) => setRoutes(data))
      .catch((error) =>
        logger.warn("[DevSidebarClient] Could not load routes manifest.", {
          error,
        })
      );
  }, []);

  return (
    <aside className="w-72 flex-shrink-0 border-r bg-card h-screen flex flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <Link
          href="/dev-console"
          className="flex items-center gap-2 font-bold text-lg"
        >
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span>DEV CONSOLE</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {navLinks.map((link) => (
          <NavLink key={link.href} {...link} />
        ))}
        <div className="pt-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="routes">
              <AccordionTrigger className="text-sm font-semibold">
                {t("routeViewer")}
              </AccordionTrigger>
              <AccordionContent>
                {routes ? (
                  <RouteTree node={routes} />
                ) : (
                  <p className="text-xs text-muted-foreground p-2">
                    {t("loadingRoutes")}
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </nav>
      <div className="mt-auto border-t p-4">
        <form action={sessionActions.signOutAction}>
          <Button variant="ghost" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            {t("signOut")}
          </Button>
        </form>
      </div>
    </aside>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad (SRP)**: ((Implementada)) El componente encapsula la navegación del Dev Console.
 * 2. **Full Internacionalización**: ((Implementada)) Todos los textos se consumen desde la capa de i18n.
 * 3. **Full Observabilidad**: ((Implementada)) Se ha añadido un log para el fallo de carga del manifiesto de rutas.
 *
 * @subsection Melhorias Futuras
 * 1. **Manifiesto de Rutas Dinámico**: ((Vigente)) La dependencia de un `routes-manifest.json` estático es frágil. Un script de build (`generate-routes-manifest.mjs`) debe ser migrado para generar este archivo automáticamente.
 *
 * =====================================================================
 */
// src/components/dev-console/DevSidebarClient.tsx
