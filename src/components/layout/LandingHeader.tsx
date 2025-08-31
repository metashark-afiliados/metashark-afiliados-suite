// src/components/layout/LandingHeader.tsx
/**
 * @file src/components/layout/LandingHeader.tsx
 * @description Componente de presentación 100% puro para el encabezado público.
 *              Recibe todo su contenido a través de props para alinearse con
 *              la arquitectura de orquestador de servidor de la `HomePage`.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
"use client";

import React from "react";
import Image from "next/image";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { type NavLinkItem, SmartLink } from "@/components/ui/SmartLink";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { Link } from "@/lib/navigation";
import { clientLogger } from "@/lib/logging";

export interface LandingHeaderProps {
  navLinks: NavLinkItem[];
  signInText: string;
  signUpText: string;
  openMenuText: string;
}

/**
 * @public
 * @component LandingHeader
 * @description Renderiza la cabecera de la landing page. Es un componente de
 *              presentación puro que recibe todos los textos y datos de
 *              navegación como props.
 * @param {LandingHeaderProps} props - Propiedades para configurar el encabezado.
 * @returns {React.ReactElement}
 */
export function LandingHeader({
  navLinks,
  signInText,
  signUpText,
  openMenuText,
}: LandingHeaderProps): React.ReactElement {
  clientLogger.trace(
    "[LandingHeader] Renderizando componente de presentación puro."
  );
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="ConvertiKit Logo"
            width={40}
            height={40}
            priority
            className="h-10 w-auto object-contain"
          />
        </Link>

        <nav
          aria-label="Navegación Principal"
          className="hidden items-center gap-6 text-sm font-medium md:flex"
        >
          {(navLinks || []).map((link) => (
            <SmartLink
              key={
                typeof link.href === "string" ? link.href : link.href.pathname
              }
              {...link}
            />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <ThemeSwitcher />
            <LanguageSwitcher />
            <Button variant="ghost" asChild>
              <Link href="/login">{signInText}</Link>
            </Button>
            <Button
              asChild
              className="transition-transform hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
            >
              <Link href="/signup">{signUpText}</Link>
            </Button>
          </div>

          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">{openMenuText}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav
                  aria-label="Navegación Móvil"
                  className="grid gap-6 text-lg font-medium mt-8"
                >
                  {(navLinks || []).map((link) => (
                    <SmartLink
                      key={
                        typeof link.href === "string"
                          ? link.href
                          : link.href.pathname
                      }
                      onClick={() => setIsSheetOpen(false)}
                      {...link}
                    />
                  ))}
                </nav>
                <div className="mt-8 pt-8 border-t border-border/40 flex flex-col gap-4">
                  <Button
                    variant="ghost"
                    asChild
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <Link href="/login">{signInText}</Link>
                  </Button>
                  <Button asChild onClick={() => setIsSheetOpen(false)}>
                    <Link href="/signup">{signUpText}</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
// src/components/layout/LandingHeader.tsx
