// src/app/[locale]/page.tsx
/**
 * @file src/app/[locale]/page.tsx
 * @description Página de Inicio Pública (Landing Page) de élite. Este Server Component
 *              orquesta la obtención de todo el contenido de la UI desde la capa de
 *              internacionalización y lo pasa como props serializables a los
 *              componentes de cliente puros. Ha sido nivelado para corregir las
 *              regresiones de datos (iconos), de activos (imágenes), y alineado
 *              con el nuevo manifiesto de diseño y branding.
 * @author Raz Podestá
 * @version 5.1.0
 */
import { redirect } from "next/navigation";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { BottomCTA } from "@/components/landing/BottomCTA";
import { FAQ } from "@/components/landing/FAQ";
import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { Metrics } from "@/components/landing/Metrics";
import { ProcessSteps } from "@/components/landing/ProcessSteps";
import { SocialProof } from "@/components/landing/SocialProof";
import { SupportCTA } from "@/components/landing/SupportCTA";
import { Testimonials } from "@/components/landing/Testimonials";
import { LandingFooter } from "@/components/layout/LandingFooter";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { CursorTrail } from "@/components/ui/CursorTrail";
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

  const t = await getTranslations();

  // --- Construcción de Props para Componentes Hijos (Nivelada y Corregida) ---

  const socialProofProps = {
    title: t("SocialProof.title"),
    logos: [
      {
        name: "LogoPlaceholder1",
        src: "https://via.placeholder.com/158x48/1A1A1A/666666.svg?text=CLIENT",
      },
      {
        name: "LogoPlaceholder2",
        src: "https://via.placeholder.com/158x48/1A1A1A/666666.svg?text=PARTNER",
      },
      {
        name: "LogoPlaceholder3",
        src: "https://via.placeholder.com/158x48/1A1A1A/666666.svg?text=COMPANY",
      },
      {
        name: "LogoPlaceholder4",
        src: "https://via.placeholder.com/158x48/1A1A1A/666666.svg?text=AGENCY",
      },
      {
        name: "LogoPlaceholder5",
        src: "https://via.placeholder.com/158x48/1A1A1A/666666.svg?text=BRAND",
      },
    ],
  };

  const featuresProps = {
    title: t("FeaturesSection.title"),
    subtitle: t("FeaturesSection.subtitle"),
    features: t.raw("FeaturesSection.features").map((feature: any) => ({
      ...feature,
      // --- INICIO DE CORRECCIÓN DE ICONOS ---
      icon:
        feature.icon === "PenSquare"
          ? "FilePen" // Corregido de "FilePenSquare"
          : feature.icon === "PieChart"
            ? "ChartPie"
            : feature.icon,
      // --- FIN DE CORRECCIÓN DE ICONOS ---
    })),
  };

  const processStepsProps = {
    tag: t("ProcessSteps.tag"),
    title: t("ProcessSteps.title"),
    description: t("ProcessSteps.description"),
    steps: t.raw("ProcessSteps.steps").map((step: any) => ({
      ...step,
      // --- INICIO DE CORRECCIÓN DE ICONOS ---
      iconName: step.iconName === "BarChart" ? "BarChartBig" : step.iconName, // Corregido de "BarChart3"
      // --- FIN DE CORRECCIÓN DE ICONOS ---
    })),
  };

  const testimonialsProps = {
    tag: t("Testimonials.tag"),
    title: t("Testimonials.title"),
    subtitle: t("Testimonials.subtitle"),
    testimonials: t
      .raw("Testimonials.testimonials")
      .map((testimonial: any) => ({
        ...testimonial,
        authorImage: `https://api.dicebear.com/7.x/personas/svg?seed=${testimonial.authorName.replace(/\s/g, "")}&size=64&backgroundColor=transparent`,
      })),
  };

  const headerProps = {
    navLinks: [
      { href: "#features", label: t("LandingHeader.features") },
      { href: "#process", label: t("ProcessSteps.navLink") },
      { href: "/pricing", label: t("LandingHeader.pricing") },
    ],
    signInText: t("LandingHeader.signIn"),
    signUpText: t("LandingHeader.signUp"),
    openMenuText: t("LandingHeader.openMenu"),
  };

  const heroProps = {
    title: t("HeroSection.title"),
    subtitle: t("HeroSection.subtitle"),
    ctaPrimaryText: t("HeroSection.ctaPrimary"),
    ctaSecondaryText: t("HeroSection.ctaSecondary"),
  };

  const metricsProps = { metrics: t.raw("Metrics.metrics") };

  const faqProps = {
    tag: t("FAQ.tag"),
    title: t("FAQ.title"),
    subtitle: t("FAQ.subtitle"),
    items: t.raw("FAQ.items"),
    searchPlaceholder: t("FAQ.searchPlaceholder"),
    noResultsText: t("FAQ.noResultsText"),
    clearSearchAriaLabel: t("FAQ.clearSearchAriaLabel"),
  };

  const supportCTAProps = {
    title: t("SupportCTA.title"),
    description: t("SupportCTA.description"),
    contactButtonText: t("SupportCTA.contactButtonText"),
    docsButtonText: t("SupportCTA.docsButtonText"),
  };

  const bottomCTAProps = {
    title: t("BottomCTA.title"),
    subtitle: t("BottomCTA.subtitle"),
    featuresTitle: t("BottomCTA.featuresTitle"),
    features: t.raw("BottomCTA.features"),
    ctaPrimaryText: t("BottomCTA.ctaPrimaryText"),
    ctaPlaceholderText: t("BottomCTA.ctaPlaceholderText"),
    pricingNote: t("BottomCTA.pricingNote"),
    guaranteeNote: t("BottomCTA.guaranteeNote"),
    creditCardNote: t("BottomCTA.creditCardNote"),
  };

  const footerProps = {
    slogan: t("LandingFooter.slogan"),
    productColumnTitle: t("LandingFooter.product"),
    companyColumnTitle: t("LandingFooter.company"),
    productLinks: [
      { href: "#features", label: t("LandingHeader.features") },
      { href: "#process", label: t("ProcessSteps.navLink") },
      { href: "/pricing", label: t("LandingHeader.pricing") },
    ],
    companyLinks: [
      { href: "/about", label: t("AboutPage.title") },
      { href: "/blog", label: t("BlogPage.title") },
    ],
    legalLinks: [
      { href: "/privacy", label: t("PrivacyPolicyPage.title") },
      { href: "/terms", label: t("TermsOfServicePage.title") },
    ],
    newsletterTitle: t("LandingFooter.stayUpdated"),
    newsletterPrompt: t("LandingFooter.newsletterPrompt"),
    subscribeButtonText: t("LandingFooter.subscribe"),
    allRightsReservedText: t("LandingFooter.allRightsReserved", {
      year: new Date().getFullYear(),
    }),
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <CursorTrail />
      <LandingHeader {...headerProps} />
      <main className="flex-1">
        <Hero {...heroProps} />
        <SocialProof {...socialProofProps} />
        <Features {...featuresProps} />
        <ProcessSteps {...processStepsProps} />
        <Testimonials {...testimonialsProps} />
        <Metrics {...metricsProps} />
        <FAQ {...faqProps} />
        <SupportCTA {...supportCTAProps} />
        <BottomCTA {...bottomCTAProps} />
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
 * 1. **Corrección de Regresión Visual**: ((Implementada)) Se ha corregido el mapeo de nombres de iconos para que coincidan con la librería `lucide-react`, eliminando las advertencias `[DynamicIcon]` de los logs y restaurando los iconos faltantes en la UI. Cero regresiones funcionales.
 *
 * @subsection Melhorias Futuras
 * 1. **Mapeo Centralizado de Iconos**: ((Vigente)) Para una mantenibilidad de élite, se podría crear un manifiesto de configuración `icon-map.ts` que centralice todos los mapeos de iconos, evitando que esta lógica de negocio resida en un componente de presentación.
 *
 * =====================================================================
 */
// src/app/[locale]/page.tsx
