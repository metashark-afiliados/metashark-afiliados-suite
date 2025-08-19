// src/messages/manifest.ts
/**
 * @file src/messages/manifest.ts
 * @description Manifiesto de Importación Dinámica. Ha sido actualizado para
 *              registrar la entrada del nuevo namespace `pages.NotFoundPage`.
 * @author L.I.A. Legacy
 * @version 10.0.0
 */
import { type ManifestModule } from "./types";

export const messagesManifest: Record<string, ManifestModule> = {
  // --- Global/Shared ---
  ActionDock: () => import("./shared/ActionDock.json"),
  ValidationErrors: () => import("./shared/ValidationErrors.json"),
  WelcomeModal: () => import("./shared/WelcomeModal.json"),

  // --- App Routes (Server-consumed pages) ---
  "pages.AboutPage": () => import("./pages/AboutPage.json"),
  "pages.AuthNoticePage": () => import("./pages/AuthNoticePage.json"),
  "pages.BlogPage": () => import("./pages/BlogPage.json"),
  "pages.ContactPage": () => import("./pages/ContactPage.json"),
  "pages.CookiePolicyPage": () => import("./pages/CookiePolicyPage.json"),
  "pages.DisclaimerPage": () => import("./pages/DisclaimerPage.json"),
  "pages.ForgotPasswordPage": () => import("./pages/ForgotPasswordPage.json"),
  "pages.LegalNoticePage": () => import("./pages/LegalNoticePage.json"),
  "pages.NotFoundPage": () => import("./pages/NotFoundPage.json"), // <-- NUEVO REGISTRO
  "pages.PrivacyPolicyPage": () => import("./pages/PrivacyPolicyPage.json"),
  "pages.ResetPasswordPage": () => import("./pages/ResetPasswordPage.json"),
  "pages.TermsOfServicePage": () => import("./pages/TermsOfServicePage.json"),

  // --- Client Components (useTranslations) & App-level Schemas ---
  "app.dev-console.CampaignsTable": () =>
    import("./app/[locale]/dev-console/CampaignsTable.json"),
  "app.dev-console.ImpersonationDialog": () =>
    import("./app/[locale]/dev-console/ImpersonationDialog.json"),
  "app.dev-console.TelemetryTable": () =>
    import("./app/[locale]/dev-console/TelemetryTable.json"),
  "app.dev-console.UserManagementTable": () =>
    import("./app/[locale]/dev-console/UserManagementTable.json"),
  AuthLayout: () => import("./app/[locale]/auth/layout.json"),
  AuthFooter: () => import("./components/auth/AuthFooter.json"),
  LoginForm: () => import("./components/auth/LoginForm.json"),
  OAuthButton: () => import("./components/auth/OAuthButton.json"),
  BuilderPage: () => import("./app/[locale]/builder/page.json"),
  CampaignsPage: () =>
    import("./app/[locale]/dashboard/sites/[siteId]/campaigns/page.json"),
  CommandPalette: () => import("./components/feedback/CommandPalette.json"),
  DashboardHeader: () => import("./components/layout/DashboardHeader.json"),
  DashboardPage: () => import("./app/[locale]/dashboard/page.json"),
  DashboardSidebar: () => import("./components/layout/DashboardSidebar.json"),
  DevConsoleSidebar: () => import("./components/dev-console/DevSidebar.json"),
  Dialogs: () => import("./components/ui/Dialogs.json"),
  EmojiPicker: () => import("./components/ui/EmojiPicker.json"),
  InvitationBell: () => import("./components/dashboard/InvitationBell.json"),
  LiaChatWidget: () => import("./components/feedback/LiaChatWidget.json"),
  LoginPage: () => import("./app/[locale]/auth/login/page.json"),
  SignUpPage: () => import("./app/[locale]/auth/signup/page.json"),
  SiteAssignmentControl: () =>
    import("./components/builder/SiteAssignmentControl.json"),
  SitesPage: () => import("./app/[locale]/dashboard/sites/page.json"),
  SupabaseAuthUI: () => import("./components/auth/SupabaseAuthUI.json"),
  ThemeSwitcher: () => import("./components/ui/ThemeSwitcher.json"),
  WorkspaceSwitcher: () =>
    import("./components/workspaces/WorkspaceSwitcher.json"),
  LanguageSwitcher: () => import("./components/ui/LanguageSwitcher.json"),

  // --- Landing Page Sections ---
  BottomCTA: () => import("./components/landing/BottomCTA.json"),
  FAQ: () => import("./components/landing/FAQ.json"),
  FeaturesSection: () => import("./components/landing/Features.json"),
  HeroSection: () => import("./components/landing/Hero.json"),
  LandingFooter: () => import("./components/layout/LandingFooter.json"),
  LandingHeader: () => import("./components/layout/LandingHeader.json"),
  Metrics: () => import("./components/landing/Metrics.json"),
  Newsletter: () => import("./components/landing/Newsletter.json"),
  ProcessSteps: () => import("./components/landing/ProcessSteps.json"),
  SocialProof: () => import("./components/landing/SocialProof.json"),
  SupportCTA: () => import("./components/landing/SupportCTA.json"),
  Testimonials: () => import("./components/landing/Testimonials.json"),
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Registro de Namespace**: ((Implementada)) El manifiesto ahora registra la importación dinámica para `NotFoundPage.json`, permitiendo que `i18n.ts` lo cargue.
 *
 * =====================================================================
 */
// src/messages/manifest.ts
