// src/app/[locale]/page.tsx
/**
 * @file src/app/[locale]/page.tsx
 * @description Orquestador de datos de alto rendimiento y adaptador para la Landing Page.
 *              Esta versión completa la refactorización SSR, cargando todo el contenido
 *              con una única llamada a `getTranslations` y pasando los datos como props
 *              a sus componentes hijos puros. Resuelve la cascada de errores `IntlError`.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 13.0.0
 */
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";

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
import { type NavLinkItem } from "@/components/ui/SmartLink";
import { logger } from "@/lib/logger";
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
    `[HomePage] Iniciando renderizado de servidor para el locale: ${locale}`
  );

  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    logger.info(
      `[HomePage] Sesión activa detectada. Redirigiendo al dashboard.`
    );
    redirect("/dashboard");
  }

  const t = await getTranslations("pages.landing");

  // --- Capa de Adaptación: De i18n a Props ---

  const headerProps = {
    navLinks: t.raw("Header.navLinks"),
    signInText: t("Header.signIn"),
    signUpText: t("Header.signUp"),
    openMenuText: t("Header.openMenu"),
  };

  const heroProps = {
    title: t("Hero.title"),
    subtitle: t("Hero.subtitle"),
    ctaPrimaryText: t("Hero.ctaPrimary"),
    ctaSecondaryText: t("Hero.ctaSecondary"),
  };

  const socialProofProps = {
    title: t("SocialProof.title"),
    logos: t.raw("SocialProof.logos"),
  };

  const featuresProps = {
    title: t("Features.title"),
    subtitle: t("Features.subtitle"),
    features: t.raw("Features.features"),
  };

  const processStepsProps = {
    tag: t("ProcessSteps.tag"),
    title: t("ProcessSteps.title"),
    description: t("ProcessSteps.description"),
    steps: t.raw("ProcessSteps.steps"),
  };

  const metricsProps = {
    metrics: t.raw("Metrics.metrics"),
  };

  const testimonialsProps = {
    tag: t("Testimonials.tag"),
    title: t("Testimonials.title"),
    subtitle: t("Testimonials.subtitle"),
    testimonials: t
      .raw("Testimonials.testimonials")
      .map((testimonial: any) => ({
        ...testimonial,
        authorImage: `${DICEBEAR_API_URL}?seed=${testimonial.authorName.replace(
          /\s/g,
          ""
        )}&size=64&backgroundColor=transparent`,
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

  const rawFooterLinks = t.raw("Footer");
  const transformLinks = (links: Record<string, string>): NavLinkItem[] =>
    Object.entries(links).map(([key, label]) => ({
      label: label,
      href: key.startsWith("#") ? key : `/${key.replace(/_/g, "-")}`,
    }));

  const footerProps = {
    brandName: t("Footer.brand_name"),
    logoAltText: t("Footer.logo_alt_text"),
    slogan: t("Footer.slogan"),
    productColumnTitle: t("Footer.product"),
    companyColumnTitle: t("Footer.company"),
    newsletterTitle: t("Footer.stayUpdated"),
    newsletterPrompt: t("Footer.newsletterPrompt"),
    subscribeButtonText: t("Footer.subscribe"),
    placeholderEmail: t("Footer.placeholder_email"),
    allRightsReservedText: t("Footer.allRightsReserved", {
      year: new Date().getFullYear(),
    }),
    productLinks: transformLinks(rawFooterLinks.productLinks),
    companyLinks: transformLinks(rawFooterLinks.companyLinks),
    legalLinks: transformLinks(rawFooterLinks.legalLinks),
  };

  // --- Capa de Ensamblaje de UI ---
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
// src/app/[locale]/page.tsx
