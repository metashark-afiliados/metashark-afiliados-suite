// src/app/[locale]/page.tsx
/**
 * @file src/app/[locale]/page.tsx
 * @description Página de Inicio Pública (Landing Page) de élite. Este Server Component
 *              orquesta la obtención de todo el contenido de la UI desde la capa de
 *              internacionalización. Ha sido refactorizado para consumir la SSoT
 *              canónica de íconos (`ICONS`), resolviendo un error de compilación crítico.
 * @author Raz Podestá
 * @version 7.0.0
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
import { ICONS } from "@/config/icon-map";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";

const DICEBEAR_API_URL =
  process.env.NEXT_PUBLIC_DICEBEAR_API_URL ||
  "https://api.dicebear.com/7.x/personas/svg";

/**
 * @public
 * @async
 * @page HomePage
 * @description Orquesta y ensambla la landing page completa.
 * @param {object} props - Propiedades de la página, incluyendo `params`.
 * @returns {Promise<JSX.Element>} El componente de la página de inicio renderizado.
 */
export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<JSX.Element> {
  unstable_setRequestLocale(locale);
  logger.trace(
    "[HomePage] Renderizando página de inicio para el locale:",
    locale
  );

  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    logger.info(
      `[HomePage] Sesión activa detectada. Redirigiendo al dashboard.`,
      { userId: session.user.id }
    );
    redirect("/dashboard");
  }

  const t = await getTranslations();

  // --- Construcción de Props para Componentes Hijos ---

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

  const socialProofProps = {
    title: t("SocialProof.title"),
    logos: t.raw("SocialProof.logos"),
  };

  const featuresProps = {
    title: t("FeaturesSection.title"),
    subtitle: t("FeaturesSection.subtitle"),
    features: t.raw("FeaturesSection.features").map((feature: any) => ({
      ...feature,
      icon:
        ICONS.TOOLS[feature.icon as keyof typeof ICONS.TOOLS] ||
        ICONS.FEEDBACK.HELP,
    })),
  };

  const processStepsProps = {
    tag: t("ProcessSteps.tag"),
    title: t("ProcessSteps.title"),
    description: t("ProcessSteps.description"),
    steps: t.raw("ProcessSteps.steps").map((step: any) => ({
      ...step,
      iconName:
        ICONS.ACTIONS[step.iconName as keyof typeof ICONS.ACTIONS] ||
        ICONS.FEEDBACK.HELP,
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
        authorImage: `${DICEBEAR_API_URL}?seed=${testimonial.authorName.replace(/\s/g, "")}&size=64&backgroundColor=transparent`,
      })),
  };

  const metricsProps = {
    metrics: t.raw("Metrics.metrics").map((metric: any) => ({
      ...metric,
      iconName:
        ICONS.FEEDBACK[metric.iconName as keyof typeof ICONS.FEEDBACK] ||
        ICONS.FEEDBACK.INFO,
    })),
  };

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
      { href: "/about", label: t("AboutPage.hero.title") },
      { href: "/blog", label: t("BlogPage.hero.title") },
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
 * 1. **Resolución de Error de Build (TS2305)**: ((Implementada)) Se ha eliminado la importación y el uso de la función obsoleta `getMappedIconName`. La lógica de construcción de props ahora consume directamente el manifiesto de íconos `ICONS`, resolviendo el error de compilación y alineando el componente con la SSoT canónica.
 * 2. **Mapeo Robusto de Íconos**: ((Implementada)) La nueva lógica de mapeo es más robusta. Busca la clave del ícono en la categoría semántica apropiada del objeto `ICONS` y proporciona un ícono de fallback (`HELP` o `INFO`) si la clave no se encuentra, previniendo errores de renderizado.
 *
 * @subsection Melhorias Futuras
 * 1. **Carga de Datos desde CMS**: ((Vigente)) Para una flexibilidad de élite, el contenido de la landing page (especialmente `features`, `testimonials`, `faq`) podría ser obtenido desde un CMS Headless en lugar de los archivos de mensajes, permitiendo al equipo de marketing actualizar el contenido sin necesidad de un despliegue de código.
 *
 * =====================================================================
 */
