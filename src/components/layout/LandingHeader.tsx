// src/components/layout/LandingHeader.tsx
/**
 * @file src/components/layout/LandingHeader.tsx
 * @description Componente de presentación puro que renderiza el encabezado para las
 *              páginas públicas. Refactorizado a un estándar de élite para aplicar
 *              el branding canónico y microinteracciones a los botones de acción.
 * @author Raz Podestá
 * @version 3.1.0
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

export function LandingHeader({
  navLinks,
  signInText,
  signUpText,
  openMenuText,
}: LandingHeaderProps): React.ReactElement {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const { openModal } = useAuthModalStore();

  const handleAuthAction = (view: "login" | "signup") => {
    clientLogger.info(`[LandingHeader] Intento de autenticación iniciado.`, {
      view,
    });
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
            <Button
              onClick={() => handleAuthAction("signup")}
              className="transition-transform hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
            >
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
 * 1. **Alineación con Branding**: ((Implementada)) El botón "Sign Up" ahora utiliza la variante `default` (implícita), que consume `bg-primary`, alineándose con el manifiesto de branding. El botón "Sign In" utiliza `variant="ghost"`, estableciendo una clara jerarquía visual.
 * 2. **Feedback Visual (Microinteracciones)**: ((Implementada)) Se han añadido clases de `hover` al CTA primario para proporcionar un feedback de interactividad claro y una sensación de mayor calidad.
 * 3. **Consistencia y No Regresión**: ((Implementada)) Todas las funcionalidades, incluyendo la navegación, la apertura de modales y el menú móvil, se han preservado intactas. El componente sigue siendo un presentador puro.
 *
 * @subsection Melhorias Futuras
 * 1. **Animación con Framer Motion**: ((Vigente)) Para una UX de élite, los botones podrían ser envueltos en `<motion.button>` para añadir animaciones más sofisticadas en el estado `whileHover`.
 *
 * =====================================================================
 */
