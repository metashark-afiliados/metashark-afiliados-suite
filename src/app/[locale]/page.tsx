// src/app/[locale]/page.tsx
/**
 * @file src/app/[locale]/page.tsx
 * @description Página de Inicio Pública (Landing Page) de élite. Refactorizado
 *              para consumir la función de servidor `getTranslations` en lugar
 *              del hook `useTranslations`, resolviendo una regresión crítica
 *              de `ReferenceError` causada por una violación de las reglas de
 *              los React Server Components.
 * @author Raz Podestá
 * @version 9.1.0
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

  // --- INICIO DE CORRECCIÓN DE ÉLITE: RSC `getTranslations` ---
  const tHeader = await getTranslations("components.layout.LandingHeader");
  const tHero = await getTranslations("components.landing.Hero");
  const tSocial = await getTranslations("components.landing.SocialProof");
  const tFeatures = await getTranslations("components.landing.Features");
  const tProcess = await getTranslations("components.landing.ProcessSteps");
  const tTestimonials = await getTranslations(
    "components.landing.Testimonials"
  );
  const tMetrics = await getTranslations("components.landing.Metrics");
  const tFaq = await getTranslations("components.landing.FAQ");
  const tSupport = await getTranslations("components.landing.SupportCTA");
  const tBottom = await getTranslations("components.landing.BottomCTA");
  // --- FIN DE CORRECCIÓN DE ÉLITE ---

  const headerProps = {
    navLinks: [
      { href: "#features", label: tHeader("features") },
      { href: "#process", label: tProcess("navLink") },
      { href: "/pricing", label: tHeader("pricing") },
    ],
    signInText: tHeader("signIn"),
    signUpText: tHeader("signUp"),
    openMenuText: tHeader("openMenu"),
  };

  const heroProps = {
    title: tHero("title"),
    subtitle: tHero("subtitle"),
    ctaPrimaryText: tHero("ctaPrimary"),
    ctaSecondaryText: tHero("ctaSecondary"),
  };

  const socialProofProps = {
    title: tSocial("title"),
    logos: tSocial.raw("logos"),
  };

  const featuresProps = {
    title: tFeatures("title"),
    subtitle: tFeatures("subtitle"),
    features: tFeatures.raw("features"),
  };

  const processStepsProps = {
    tag: tProcess("tag"),
    title: tProcess("title"),
    description: tProcess("description"),
    steps: tProcess.raw("steps"),
  };

  const metricsProps = {
    metrics: tMetrics.raw("metrics"),
  };

  const testimonialsProps = {
    tag: tTestimonials("tag"),
    title: tTestimonials("title"),
    subtitle: tTestimonials("subtitle"),
    testimonials: tTestimonials.raw("testimonials").map((testimonial: any) => ({
      ...testimonial,
      authorImage: `${DICEBEAR_API_URL}?seed=${testimonial.authorName.replace(
        /\s/g,
        ""
      )}&size=64&backgroundColor=transparent`,
    })),
  };

  const faqProps = {
    tag: tFaq("tag"),
    title: tFaq("title"),
    subtitle: tFaq("subtitle"),
    items: tFaq.raw("items"),
    searchPlaceholder: tFaq("searchPlaceholder"),
    noResultsText: tFaq("noResultsText"),
    clearSearchAriaLabel: tFaq("clearSearchAriaLabel"),
  };

  const supportCTAProps = {
    title: tSupport("title"),
    description: tSupport("description"),
    contactButtonText: tSupport("contactButtonText"),
    docsButtonText: tSupport("docsButtonText"),
  };

  const bottomCTAProps = {
    title: tBottom("title"),
    subtitle: tBottom("subtitle"),
    featuresTitle: tBottom("featuresTitle"),
    features: tBottom.raw("features"),
    ctaPrimaryText: tBottom("ctaPrimaryText"),
    ctaPlaceholderText: tBottom("ctaPlaceholderText"),
    pricingNote: tBottom("pricingNote"),
    guaranteeNote: tBottom("guaranteeNote"),
    creditCardNote: tBottom("creditCardNote"),
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
 * 1. **Resolución de `ReferenceError`**: ((Implementada)) Se ha reemplazado el hook `useTranslations` por la función de servidor `getTranslations`. Esta es la corrección canónica que resuelve la regresión crítica y alinea el componente con las reglas de los React Server Components.
 *
 * @subsection Melhorias Futuras
 * 1. **Abstracción de Datos de Página**: ((Vigente)) La lógica de construcción de `props` para cada sección podría ser abstraída a una función `getHomePageData(locale)` en la capa de datos (`src/lib/data`), manteniendo este Server Component como un ensamblador aún más limpio.
 *
 * =====================================================================
 */
// src/app/[locale]/page.tsx
