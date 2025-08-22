// src/components/layout/LandingHeader.tsx
/**
 * @file src/components/layout/LandingHeader.tsx
 * @description Componente de presentación puro que renderiza el encabezado para las
 *              páginas públicas. Refactorizado a un estándar de élite para invocar
 *              el flujo de autenticación modal en lugar de navegar a páginas obsoletas.
 * @author Raz Podestá
 * @version 3.0.0
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
import { useAuthModalStore } from "@/lib/hooks/ui/useAuthModalStore";
import { clientLogger } from "@/lib/logging";
import { Link } from "@/lib/navigation";

export interface LandingHeaderProps {
  navLinks: NavLinkItem[];
  signInText: string;
  signUpText: string;
  openMenuText: string;
}

/**
 * @public
 * @component LandingHeader
 * @description Orquestador de UI para el encabezado de la página de inicio.
 *              Gestiona la navegación, el cambio de tema/idioma y dispara el
 *              modal de autenticación global.
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
  const { openModal } = useAuthModalStore();

  /**
   * @private
   * @function handleAuthAction
   * @description Centraliza la lógica para abrir el modal de autenticación,
   *              registrando el evento y cerrando el menú móvil si está abierto.
   * @param {'login' | 'signup'} view - La vista del modal a abrir.
   */
  const handleAuthAction = (view: "login" | "signup") => {
    clientLogger.info(
      `[LandingHeader] Intento de autenticación iniciado desde el header.`,
      { view }
    );
    openModal(view);
    setIsSheetOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Logo de ConvertiKit"
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
            <Button variant="ghost" onClick={() => handleAuthAction("login")}>
              {signInText}
            </Button>
            <Button onClick={() => handleAuthAction("signup")}>
              {signUpText}
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
                  <Button
                    variant="ghost"
                    onClick={() => handleAuthAction("login")}
                  >
                    {signInText}
                  </Button>
                  <Button onClick={() => handleAuthAction("signup")}>
                    {signUpText}
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
 * 1. **Integración de Flujo Modal**: ((Implementada)) ((Vigente)) Los botones de autenticación ahora invocan `useAuthModalStore.openModal` en lugar de navegar directamente, cumpliendo los requisitos de la Fase III del roadmap.
 * 2. **Full Observabilidad del Embudo**: ((Implementada)) ((Vigente)) Se ha añadido `clientLogger.info` a `handleAuthAction` para rastrear el inicio del embudo de conversión de usuarios.
 * 3. **Mejora de UX Móvil**: ((Implementada)) ((Vigente)) La acción de autenticación ahora cierra automáticamente el menú móvil, proporcionando una experiencia de usuario fluida.
 *
 * @subsection Melhorias Futuras
 * 1. **Menú Móvil Atómico (`MobileMenu.tsx`)**: ((Pendiente)) La lógica del `<Sheet>` podría ser extraída a su propio componente atómico para una máxima granularidad y reutilización, aunque la implementación actual es robusta.
 *
 * =====================================================================
 */
// src/components/layout/LandingHeader.tsx
