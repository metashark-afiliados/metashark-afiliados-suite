// src/components/layout/LandingFooter.tsx
/**
 * @file src/components/layout/LandingFooter.tsx
 * @description Componente de presentación puro para el pie de página público.
 *              Es completamente agnóstico al contenido, recibiendo todos sus textos
 *              y datos de enlace a través de props. Utiliza el aparato atómico `SmartLink`
 *              para renderizar de forma inteligente los diferentes tipos de enlaces.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type NavLinkItem, SmartLink } from "@/components/ui/SmartLink";
import { Link } from "@/lib/navigation";

/**
 * @public
 * @interface LandingFooterProps
 * @description Define el contrato de props para el `LandingFooter`.
 */
export interface LandingFooterProps {
  slogan: string;
  productColumnTitle: string;
  productLinks: NavLinkItem[];
  companyColumnTitle: string;
  companyLinks: NavLinkItem[];
  legalLinks: NavLinkItem[];
  newsletterTitle: string;
  newsletterPrompt: string;
  subscribeButtonText: string;
  allRightsReservedText: string;
}

/**
 * @public
 * @component LandingFooter
 * @description Renderiza el pie de página completo para las páginas públicas.
 * @param {LandingFooterProps} props - Propiedades para configurar el pie de página.
 * @returns {React.ReactElement}
 */
export function LandingFooter({
  slogan,
  productColumnTitle,
  productLinks,
  companyColumnTitle,
  companyLinks,
  legalLinks,
  newsletterTitle,
  newsletterPrompt,
  subscribeButtonText,
  allRightsReservedText,
}: LandingFooterProps): React.ReactElement {
  const currentYear = new Date().getFullYear();
  const rootPath = "/";

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href={rootPath} className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Logo de MetaShark"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <span className="text-lg font-bold text-foreground">
                Metashark
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">{slogan}</p>
          </div>

          <div>
            <h3 className="font-semibold">{productColumnTitle}</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {productLinks.map((link) => (
                <li
                  key={
                    typeof link.href === "string"
                      ? link.href
                      : link.href.pathname
                  }
                >
                  <SmartLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">{companyColumnTitle}</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {companyLinks.map((link) => (
                <li
                  key={
                    typeof link.href === "string"
                      ? link.href
                      : link.href.pathname
                  }
                >
                  <SmartLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">{newsletterTitle}</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              {newsletterPrompt}
            </p>
            <form className="mt-4 flex gap-2">
              <Input
                type="email"
                name="email"
                placeholder="tu@email.com"
                className="bg-input"
                required
                disabled
              />
              <Button type="submit" disabled>
                {subscribeButtonText}
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {allRightsReservedText.replace("{year}", currentYear.toString())}
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            {legalLinks.map((link) => (
              <SmartLink
                key={
                  typeof link.href === "string" ? link.href : link.href.pathname
                }
                href={link.href}
                label={link.label}
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente de Cierre de Página**: ((Implementada)) La reconstrucción de este aparato proporciona la pieza final para la estructura visual de la `HomePage`.
 * 2. **Composición Atómica**: ((Implementada)) El componente demuestra de forma excelente la "Filosofía LEGO" al componer `SmartLink` para renderizar de forma inteligente sus listas de enlaces.
 *
 * @subsection Melhorias Futuras
 * 1. **Funcionalidad de Newsletter**: ((Vigente)) Integrar una Server Action para manejar el envío del formulario de suscripción a la newsletter, añadiendo nuevos emails a la tabla `subscribers`.
 *
 * =====================================================================
 */
// src/components/layout/LandingFooter.tsx
