// src/app/[locale]/page.tsx
/**
 * @file src/app/[locale]/page.tsx
 * @description Página de Inicio Pública (Landing Page) de élite. Refactorizado
 *              para respetar el Principio de Responsabilidad Única, delegando
 *              la obtención de traducciones a sus componentes hijos.
 * @author Raz Podestá
 * @version 8.0.0
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
      <LandingFooter />
    </div>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de `IntlError: MISSING_MESSAGE`**: ((Implementada)) Se eliminó la lógica que intentaba obtener traducciones de otros namespaces (`AboutPage`, `BlogPage`, etc.). Esto resuelve la causa raíz del error de renderizado del servidor.
 * 2. **Adhesión al Principio de Responsabilidad Única**: ((Implementada)) El componente ahora se enfoca únicamente en orquestar el contenido de la página de inicio, delegando la responsabilidad de i18n a sus hijos.
 * 3. **Corrección de Mapeo de Iconos**: ((Implementada)) Se corrigió la lógica de mapeo de iconos para que consulte la categoría correcta del manifiesto `ICONS`, resolviendo las advertencias de `DynamicIcon`.
 *
 * @subsection Melhorias Futuras
 * 1. **Carga de Datos desde CMS**: ((Vigente)) Para una flexibilidad de élite, el contenido de la landing page podría ser obtenido desde un CMS Headless en lugar de los archivos de mensajes.
 *
 * =====================================================================
 */
