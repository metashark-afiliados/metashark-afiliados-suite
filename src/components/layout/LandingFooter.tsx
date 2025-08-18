// src/components/layout/LandingFooter.tsx
/**
 * @file src/components/layout/LandingFooter.tsx
 * @description Componente de presentación puro para el pie de página público.
 *              Ha sido refactorizado a un estándar de élite para componer el
 *              aparato atómico `NewsletterForm`, eliminando la lógica de
 *              formulario duplicada y resolviendo errores de tipo.
 * @author Raz Podestá
 * @version 3.0.0
 */
"use client";

import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

import { NewsletterForm } from "@/components/landing/NewsletterForm";
import { type NavLinkItem, SmartLink } from "@/components/ui/SmartLink";
import { Link } from "@/lib/navigation";

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
  const tFooter = useTranslations("LandingFooter");

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Logo de ConvertiKit"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <span className="text-lg font-bold text-foreground">
                ConvertiKit
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
            <div className="mt-4">
              <NewsletterForm
                ctaText={subscribeButtonText}
                placeholderText={tFooter("placeholder_email")}
              />
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {allRightsReservedText}
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
 * 1. **Resolución de Error Crítico (TS2769)**: ((Implementada)) Al abstraer la lógica del formulario al componente `NewsletterForm`, se elimina la llamada incorrecta a `useFormState`, resolviendo el error de compilación.
 * 2. **Adhesión al Principio DRY**: ((Implementada)) El componente ahora reutiliza `NewsletterForm`, eliminando código duplicado y mejorando la mantenibilidad.
 * 3. **Simplificación y Cohesión**: ((Implementada)) `LandingFooter` es ahora un componente de presentación puro, enfocado únicamente en el layout, lo cual se alinea perfectamente con la "Filosofía LEGO".
 *
 * @subsection Melhorias Futuras
 * 1. **Listas de Enlaces Dinámicas**: ((Vigente)) Las listas de enlaces podrían ser abstraídas a un componente `LinkList` para simplificar aún más el JSX del footer.
 *
 * =====================================================================
 */
// src/components/layout/LandingFooter.tsx
