// src/messages/manifest.ts
/**
 * @file src/messages/manifest.ts
 * @description Manifiesto de Importación Dinámica para la arquitectura IMAS.
 *              Ha sido nivelado a un estándar de élite con tipado explícito,
 *              garantizando que cada entrada se adhiera al contrato `ManifestModule`.
 * @author Raz Podestá
 * @version 1.1.0
 */
import { type ManifestModule } from "./types";

export const messagesManifest: Record<string, ManifestModule> = {
  // --- Landing Page ---
  HeroSection: () => import("./components/landing/Hero.json"),
  SocialProof: () => import("./components/landing/SocialProof.json"),
  FeaturesSection: () => import("./components/landing/Features.json"),
  ProcessSteps: () => import("./components/landing/ProcessSteps.json"),
  Testimonials: () => import("./components/landing/Testimonials.json"),
  Metrics: () => import("./components/landing/Metrics.json"),
  FAQ: () => import("./components/landing/FAQ.json"),
  SupportCTA: () => import("./components/landing/SupportCTA.json"),
  BottomCTA: () => import("./components/landing/BottomCTA.json"),
  Newsletter: () => import("./components/landing/Newsletter.json"),

  // --- Layout ---
  LandingHeader: () => import("./components/layout/LandingHeader.json"),
  LandingFooter: () => import("./components/layout/LandingFooter.json"),
  DashboardSidebar: () => import("./components/layout/DashboardSidebar.json"),
  DashboardHeader: () => import("./components/layout/DashboardHeader.json"),
  AuthLayout: () => import("./components/layout/AuthLayout.json"),

  // --- Auth Flow ---
  LoginPage: () => import("./app/[locale]/auth/login/page.json"),
  SignUpPage: () => import("./app/[locale]/auth/signup/page.json"),
  AuthFooter: () => import("./components/auth/AuthFooter.json"),
  SupabaseAuthUI: () => import("./components/auth/SupabaseAuthUI.json"),

  // --- Dashboard ---
  DashboardPage: () => import("./app/[locale]/dashboard/page.json"),
  InvitationBell: () => import("./components/dashboard/InvitationBell.json"),
  WorkspaceSwitcher: () =>
    import("./components/workspaces/WorkspaceSwitcher.json"),
  SitesPage: () => import("./app/[locale]/dashboard/sites/page.json"),
  CampaignsPage: () =>
    import("./app/[locale]/dashboard/sites/[siteId]/campaigns/page.json"),

  // --- UI Primitives ---
  ThemeSwitcher: () => import("./components/ui/ThemeSwitcher.json"),
  LanguageSwitcher: () => import("./components/ui/LanguageSwitcher.json"),
  Dialogs: () => import("./components/ui/Dialogs.json"),

  // --- Legal & Static Pages ---
  AboutPage: () => import("./pages/AboutPage.json"),
};
// src/messages/manifest.ts
