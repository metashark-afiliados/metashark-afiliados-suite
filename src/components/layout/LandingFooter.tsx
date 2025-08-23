// src/components/layout/LandingFooter.tsx
/**
 * @file src/components/layout/LandingFooter.tsx
 * @description Componente de presentación puro para el pie de página público.
 *              Refactorizado para ser autocontenido y con tipado explícito
 *              para resolver regresiones de tipo.
 * @author Raz Podestá
 * @version 4.1.0
 */
"use client";

import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

import { NewsletterForm } from "@/components/landing/NewsletterForm";
import { type NavLinkItem, SmartLink } from "@/components/ui/SmartLink";
import { Link } from "@/lib/navigation";

export function LandingFooter(): React.ReactElement {
  const t = useTranslations("LandingFooter");

  // --- INICIO DE CORRECCIÓN: Tipado Explícito ---
  const productLinks: NavLinkItem[] = [
    { href: "#features", label: t("productLinks.features") },
    { href: "#process", label: t("productLinks.process") },
    { href: "/pricing", label: t("productLinks.pricing") },
  ];

  const companyLinks: NavLinkItem[] = [
    { href: "/about", label: t("companyLinks.about") },
    { href: "/blog", label: t("companyLinks.blog") },
  ];

  const legalLinks: NavLinkItem[] = [
    { href: "/privacy", label: t("legalLinks.privacy") },
    { href: "/terms", label: t("legalLinks.terms") },
  ];
  // --- FIN DE CORRECCIÓN ---

  const footerProps = {
    slogan: t("slogan"),
    productColumnTitle: t("product"),
    companyColumnTitle: t("company"),
    newsletterTitle: t("stayUpdated"),
    newsletterPrompt: t("newsletterPrompt"),
    subscribeButtonText: t("subscribe"),
    allRightsReservedText: t("allRightsReserved", {
      year: new Date().getFullYear(),
    }),
  };

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt={t("logo_alt_text")}
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <span className="text-lg font-bold text-foreground">
                {t("brand_name")}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {footerProps.slogan}
            </p>
          </div>
          <div>
            <h3 className="font-semibold">{footerProps.productColumnTitle}</h3>
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
            <h3 className="font-semibold">{footerProps.companyColumnTitle}</h3>
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
            <h3 className="font-semibold">{footerProps.newsletterTitle}</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              {footerProps.newsletterPrompt}
            </p>
            <div className="mt-4">
              <NewsletterForm
                ctaText={footerProps.subscribeButtonText}
                placeholderText={t("placeholder_email")}
              />
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {footerProps.allRightsReservedText}
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
 * 1. **Resolución de Error de Tipo (TS2339)**: ((Implementada)) Se ha aplicado un tipado explícito `NavLinkItem[]` a los arrays de enlaces, resolviendo el error de inferencia de TypeScript.
 *
 * =====================================================================
 */
