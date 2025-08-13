// src/components/layout/LandingHeader.tsx
/**
 * @file src/components/layout/LandingHeader.tsx
 * @description Componente de presentación puro que renderiza el encabezado para
 *              las páginas públicas (no autenticadas). Es completamente agnóstico
 *              al contenido, recibiendo todos sus textos y datos de enlace a través
 *              de su contrato de props. Compone otros aparatos atómicos como `SmartLink`
 *              y `ThemeSwitcher`.
 * @author L.I.A. Legacy
 * @version 1.0.0
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
import { cn } from "@/lib/utils";

/**
 * @public
 * @interface LandingHeaderProps
 * @description Define el contrato de props para el `LandingHeader`.
 */
export interface LandingHeaderProps {
  navLinks: NavLinkItem[];
  signInText: string;
  signUpText: string;
  openMenuText: string;
}

/**
 * @public
 * @component LandingHeader
 * @description Renderiza una cabecera responsiva con navegación principal para
 *              escritorio y un menú lateral (`Sheet`) para dispositivos móviles.
 * @param {LandingHeaderProps} props - Propiedades para configurar el encabezado.
 * @returns {React.ReactElement}
 */
export function LandingHeader({
  navLinks,
  signInText,
  signUpText,
  openMenuText,
}: LandingHeaderProps): React.ReactElement {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const rootPath = "/";
  const loginPath = "/auth/login";
  const signupPath = "/auth/signup";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href={rootPath} className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Logo de MetaShark"
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
          {navLinks.map((link) => (
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
              <Link href={loginPath}>{signInText}</Link>
            </Button>
            <Button asChild>
              <Link href={signupPath}>{signUpText}</Link>
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
                  {navLinks.map((link) => (
                    <div
                      key={
                        typeof link.href === "string"
                          ? link.href
                          : link.href.pathname
                      }
                      onClick={() => setIsSheetOpen(false)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        (e.key === "Enter" || e.key === " ") &&
                        setIsSheetOpen(false)
                      }
                    >
                      <SmartLink {...link} />
                    </div>
                  ))}
                </nav>
                <div className="mt-8 pt-8 border-t border-border/40 flex flex-col gap-4">
                  <ThemeSwitcher />
                  <LanguageSwitcher />
                  <Button variant="ghost" asChild>
                    <Link href={loginPath}>{signInText}</Link>
                  </Button>
                  <Button asChild>
                    <Link href={signupPath}>{signUpText}</Link>
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Composición Atómica**: ((Implementada)) El componente demuestra excelentemente la "Filosofía LEGO", ensamblando `SmartLink`, `LanguageSwitcher`, y el nuevo `ThemeSwitcher`.
 * 2. **Componente Puro e Internacionalizable**: ((Implementada)) El componente es 100% agnóstico al contenido, permitiendo que la `HomePage` construya sus props con textos internacionalizados.
 *
 * @subsection Melhorias Futuras
 * 1. **Menú Móvil Atómico**: ((Vigente)) La lógica y el JSX para el menú móvil (`<Sheet>`) podrían ser extraídos a su propio componente (`MobileMenu.tsx`) para una mayor atomicidad y simplificación del `LandingHeader`.
 *
 * =====================================================================
 */
// src/components/layout/LandingHeader.tsx
