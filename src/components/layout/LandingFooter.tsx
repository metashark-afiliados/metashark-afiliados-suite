// src/components/layout/LandingFooter.tsx
/**
 * @file src/components/layout/LandingFooter.tsx
 * @description Componente de presentación 100% puro para el pie de página público.
 *              Ha sido refactorizado para ser agnóstico al contenido, recibiendo
 *              todos sus textos y datos estructurados, incluyendo los del
 *              `NewsletterForm`, a través de su contrato de props.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 4.0.0
 */
"use client";

import Image from "next/image";
import React from "react";

import { NewsletterForm } from "@/components/landing/NewsletterForm";
import { type NavLinkItem, SmartLink } from "@/components/ui/SmartLink";
import { Link } from "@/lib/navigation";
import { clientLogger } from "@/lib/logging";

export interface LandingFooterProps {
  brandName: string;
  logoAltText: string;
  slogan: string;
  productColumnTitle: string;
  companyColumnTitle: string;
  newsletterTitle: string;
  newsletterPrompt: string;
  subscribeButtonText: string;
  placeholderEmail: string;
  allRightsReservedText: string;
  productLinks: NavLinkItem[];
  companyLinks: NavLinkItem[];
  legalLinks: NavLinkItem[];
}

export function LandingFooter(props: LandingFooterProps): React.ReactElement {
  clientLogger.trace(
    "[LandingFooter] Renderizando componente de presentación puro."
  );

  const {
    brandName,
    logoAltText,
    slogan,
    productColumnTitle,
    companyColumnTitle,
    newsletterTitle,
    newsletterPrompt,
    subscribeButtonText,
    placeholderEmail,
    allRightsReservedText,
    productLinks,
    companyLinks,
    legalLinks,
  } = props;

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt={logoAltText}
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <span className="text-lg font-bold text-foreground">
                {brandName}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">{slogan}</p>
          </div>
          <div>
            <h3 className="font-semibold">{productColumnTitle}</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {(productLinks || []).map((link) => (
                <li
                  key={
                    typeof link.href === "string"
                      ? link.href
                      : link.href.pathname
                  }
                >
                  <SmartLink
                    href={link.href}
                    label={link.label}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">{companyColumnTitle}</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {(companyLinks || []).map((link) => (
                <li
                  key={
                    typeof link.href === "string"
                      ? link.href
                      : link.href.pathname
                  }
                >
                  <SmartLink
                    href={link.href}
                    label={link.label}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  />
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
                placeholderText={placeholderEmail}
              />
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {allRightsReservedText}
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            {(legalLinks || []).map((link) => (
              <SmartLink
                key={
                  typeof link.href === "string" ? link.href : link.href.pathname
                }
                href={link.href}
                label={link.label}
                className="text-muted-foreground transition-colors hover:text-primary"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
// src/components/layout/LandingFooter.tsx
