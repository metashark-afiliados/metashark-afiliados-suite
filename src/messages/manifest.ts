// src/messages/manifest.ts
/**
 * @file src/messages/manifest.ts
 * @description Manifiesto de Importación Dinámica para la arquitectura IMAS.
 *              Ha sido refactorizado para ordenar alfabéticamente sus entradas
 *              por grupos lógicos, mejorando drásticamente la mantenibilidad y
 *              la facilidad para localizar namespaces.
 * @author Raz Podestá
 * @version 2.0.0
 */
import { type ManifestModule } from "./types";

export const messagesManifest: Record<string, ManifestModule> = {
  // --- App Routes ---
  CampaignsPage: () =>
    import("./app/[locale]/dashboard/sites/[siteId]/campaigns/page.json"),
  DashboardPage: () => import("./app/[locale]/dashboard/page.json"),
  LoginPage: () => import("./app/[locale]/auth/login/page.json"),
  SignUpPage: () => import("./app/[locale]/auth/signup/page.json"),
  SitesPage: () => import("./app/[locale]/dashboard/sites/page.json"),
  WelcomePage: () => import("./app/[locale]/welcome/page.json"),

  // --- Auth Components ---
  AuthFooter: () => import("./components/auth/AuthFooter.json"),
  SupabaseAuthUI: () => import("./components/auth/SupabaseAuthUI.json"),

  // --- Dashboard Components ---
  InvitationBell: () => import("./components/dashboard/InvitationBell.json"),
  WorkspaceSwitcher: () =>
    import("./components/workspaces/WorkspaceSwitcher.json"),

  // --- Feedback Components ---
  LiaChatWidget: () => import("./components/feedback/LiaChatWidget.json"),

  // --- Landing Page Components ---
  BottomCTA: () => import("./components/landing/BottomCTA.json"),
  FAQ: () => import("./components/landing/FAQ.json"),
  FeaturesSection: () => import("./components/landing/Features.json"),
  HeroSection: () => import("./components/landing/Hero.json"),
  Metrics: () => import("./components/landing/Metrics.json"),
  Newsletter: () => import("./components/landing/Newsletter.json"),
  ProcessSteps: () => import("./components/landing/ProcessSteps.json"),
  SocialProof: () => import("./components/landing/SocialProof.json"),
  SupportCTA: () => import("./components/landing/SupportCTA.json"),
  Testimonials: () => import("./components/landing/Testimonials.json"),

  // --- Layout Components ---
  AuthLayout: () => import("./components/layout/AuthLayout.json"),
  DashboardHeader: () => import("./components/layout/DashboardHeader.json"),
  DashboardSidebar: () => import("./components/layout/DashboardSidebar.json"),
  LandingFooter: () => import("./components/layout/LandingFooter.json"),
  LandingHeader: () => import("./components/layout/LandingHeader.json"),

  // --- UI Primitives ---
  Dialogs: () => import("./components/ui/Dialogs.json"),
  LanguageSwitcher: () => import("./components/ui/LanguageSwitcher.json"),
  ThemeSwitcher: () => import("./components/ui/ThemeSwitcher.json"),

  // --- Static Pages ---
  AboutPage: () => import("./pages/AboutPage.json"),
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Mantenibilidad Mejorada**: ((Implementada)) Las entradas del manifiesto han sido agrupadas por contexto (App, Components, Layout, etc.) y ordenadas alfabéticamente dentro de cada grupo. Esto reduce significativamente la carga cognitiva y acelera la búsqueda de namespaces. Cero regresiones.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática del Manifiesto**: ((Vigente)) Este error subraya la fragilidad de un manifiesto manual. La mejora de élite sigue siendo crear un script que genere este archivo automáticamente a partir de la estructura de directorios, previniendo este tipo de error.
 *
 * =====================================================================
 */
// src/messages/manifest.ts
