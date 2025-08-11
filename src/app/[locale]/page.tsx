// src/app/[locale]/page.tsx
/**
 * @file src/app/[locale]/page.tsx
 * @description Página de Inicio Pública (Landing Page). Este Server Component
 *              orquesta la obtención de todo el contenido de la UI desde la capa de
 *              internacionalización y lo pasa como props serializables a los
 *              componentes de cliente puros, que ya han sido reconstruidos.
 * @author L.I.A. Legacy
 * @version 2.0.0 (Full UI Composition)
 */
import { redirect } from "next/navigation";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { type Feature, Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import {
  LandingFooter,
  type LandingFooterProps,
} from "@/components/layout/LandingFooter";
import {
  LandingHeader,
  type LandingHeaderProps,
} from "@/components/layout/LandingHeader";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<JSX.Element> {
  unstable_setRequestLocale(locale);
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  }

  const tHeader = await getTranslations("LandingHeader");
  const tFooter = await getTranslations("LandingFooter");
  const tHero = await getTranslations("HeroSection");
  const tFeatures = await getTranslations("FeaturesSection");
  const tDocs = await getTranslations("DocsPage");
  const tAbout = await getTranslations("AboutPage");
  const tBlog = await getTranslations("BlogPage");
  const tPrivacy = await getTranslations("PrivacyPolicyPage");
  const tTerms = await getTranslations("TermsOfServicePage");
  const tCookies = await getTranslations("CookiePolicyPage");
  const tLegal = await getTranslations("LegalNoticePage");
  const tDisclaimer = await getTranslations("DisclaimerPage");

  const headerProps: LandingHeaderProps = {
    navLinks: [
      { href: "#features", label: tHeader("features") },
      { href: "/pricing", label: tHeader("pricing") },
      { href: "/docs", label: tDocs("title") },
    ],
    signInText: tHeader("signIn"),
    signUpText: tHeader("signUp"),
    openMenuText: tHeader("openMenu"),
  };

  const footerProps: LandingFooterProps = {
    slogan: tFooter("slogan"),
    productColumnTitle: tFooter("product"),
    productLinks: [
      { href: "#features", label: tHeader("features") },
      { href: "/pricing", label: tHeader("pricing") },
      { href: "/docs", label: tDocs("title") },
    ],
    companyColumnTitle: tFooter("company"),
    companyLinks: [
      { href: "/about", label: tAbout("title") },
      { href: "/blog", label: tBlog("title") },
      { href: "/contact", label: tFooter("contact") },
    ],
    newsletterTitle: tFooter("stayUpdated"),
    newsletterPrompt: tFooter("newsletterPrompt"),
    subscribeButtonText: tFooter("subscribe"),
    allRightsReservedText: tFooter("allRightsReserved"),
    legalLinks: [
      { href: "/privacy", label: tPrivacy("title") },
      { href: "/terms", label: tTerms("title") },
      { href: "/cookies", label: tCookies("title") },
      { href: "/legal", label: tLegal("title") },
      { href: "/disclaimer", label: tDisclaimer("title") },
    ],
  };

  const featuresData: Feature[] = [
    {
      icon: "LayoutTemplate",
      title: tFeatures("features.builder.title"),
      description: tFeatures("features.builder.description"),
    },
    {
      icon: "PenSquare",
      title: tFeatures("features.copywriter.title"),
      description: tFeatures("features.copywriter.description"),
    },
    {
      icon: "PieChart",
      title: tFeatures("features.analytics.title"),
      description: tFeatures("features.analytics.description"),
    },
    {
      icon: "Bot",
      title: tFeatures("features.assistant.title"),
      description: tFeatures("features.assistant.description"),
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader {...headerProps} />
      <main className="flex-1">
        <Hero
          title={tHero("title")}
          subtitle={tHero("subtitle")}
          ctaPrimaryText={tHero("ctaPrimary")}
          ctaSecondaryText={tHero("ctaSecondary")}
        />
        <Features
          title={tFeatures("title")}
          subtitle={tFeatures("subtitle")}
          features={featuresData}
        />
      </main>
      <LandingFooter {...footerProps} />
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Orquestração de UI Completa**: ((Implementada)) Este Server Component agora orquestra e compõe todos os aparatos da landing page.
 * 2. **Padrão de RSC Canônico**: ((Implementada)) Demonstra o padrão de arquitetura de élite, onde o Server Component atua como a camada de obtenção e preparação de dados.
 *
 * @subsection Melhorias Futuras
 * 1. **Componente `CursorTrail`**: ((Vigente)) El componente `CursorTrail` del snapshot primitivo puede ser reconstruido y añadido a este layout.
 *
 * =====================================================================
 */
// src/app/[locale]/page.tsx
