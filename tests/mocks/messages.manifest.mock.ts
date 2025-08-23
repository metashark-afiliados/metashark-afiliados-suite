// tests/mocks/messages.manifest.mock.ts
/**
 * @file tests/mocks/messages.manifest.mock.ts
 * @description Manifiesto de Mocks de Mensajes de i18n para el Entorno de Pruebas.
 *              Esta es la Única Fuente de Verdad para la carga de mensajes de
 *              i18n mockeados. Ha sido restaurado a su estado completo y canónico
 *              para ser un espejo de alta fidelidad del manifiesto de producción.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
import { type ManifestModule } from "@/messages/types";

export const mockedMessagesManifest: Record<string, ManifestModule> = {
  // --- Namespaces a Nivel de App ---
  "app.dev-console.CampaignsTable": () =>
    Promise.resolve(
      import("@/messages/app/[locale]/dev-console/CampaignsTable.json")
    ),
  "app.dev-console.ImpersonationDialog": () =>
    Promise.resolve(
      import("@/messages/app/[locale]/dev-console/ImpersonationDialog.json")
    ),
  "app.dev-console.TelemetryTable": () =>
    Promise.resolve(
      import("@/messages/app/[locale]/dev-console/TelemetryTable.json")
    ),
  "app.dev-console.UserManagementTable": () =>
    Promise.resolve(
      import("@/messages/app/[locale]/dev-console/UserManagementTable.json")
    ),
  "app.[locale].auth.layout": () =>
    Promise.resolve(import("@/messages/app/[locale]/auth/layout.json")),
  "app.[locale].auth.login.page": () =>
    Promise.resolve(import("@/messages/app/[locale]/auth/login/page.json")),
  "app.[locale].auth.signup.page": () =>
    Promise.resolve(import("@/messages/app/[locale]/auth/signup/page.json")),
  "app.[locale].builder.page": () =>
    Promise.resolve(import("@/messages/app/[locale]/builder/page.json")),
  "app.[locale].dashboard.page": () =>
    Promise.resolve(import("@/messages/app/[locale]/dashboard/page.json")),
  "app.[locale].dashboard.sites.page": () =>
    Promise.resolve(
      import("@/messages/app/[locale]/dashboard/sites/page.json")
    ),
  "app.[locale].dashboard.sites.[siteId].campaigns.page": () =>
    Promise.resolve(
      import(
        "@/messages/app/[locale]/dashboard/sites/[siteId]/campaigns/page.json"
      )
    ),

  // --- Namespaces de Componentes ---
  "components.auth.LoginForm": () =>
    Promise.resolve(import("@/messages/components/auth/LoginForm.json")),
  "components.auth.OAuthButton": () =>
    Promise.resolve(import("@/messages/components/auth/OAuthButton.json")),
  "components.auth.SupabaseAuthUI": () =>
    Promise.resolve(import("@/messages/components/auth/SupabaseAuthUI.json")),
  "components.builder.BlocksPalette": () =>
    Promise.resolve(import("@/messages/components/builder/BlocksPalette.json")),
  "components.builder.BuilderHeader": () =>
    Promise.resolve(import("@/messages/components/builder/BuilderHeader.json")),
  "components.builder.Canvas": () =>
    Promise.resolve(import("@/messages/components/builder/Canvas.json")),
  "components.builder.SettingsPanel": () =>
    Promise.resolve(import("@/messages/components/builder/SettingsPanel.json")),
  "components.builder.SiteAssignmentControl": () =>
    Promise.resolve(
      import("@/messages/components/builder/SiteAssignmentControl.json")
    ),
  "components.dashboard.InvitationBell": () =>
    Promise.resolve(
      import("@/messages/components/dashboard/InvitationBell.json")
    ),
  "components.dev-console.DevSidebar": () =>
    Promise.resolve(
      import("@/messages/components/dev-console/DevSidebar.json")
    ),
  "components.feedback.CommandPalette": () =>
    Promise.resolve(
      import("@/messages/components/feedback/CommandPalette.json")
    ),
  "components.feedback.LiaChatWidget": () =>
    Promise.resolve(
      import("@/messages/components/feedback/LiaChatWidget.json")
    ),
  "components.landing.BottomCTA": () =>
    Promise.resolve(import("@/messages/components/landing/BottomCTA.json")),
  "components.landing.FAQ": () =>
    Promise.resolve(import("@/messages/components/landing/FAQ.json")),
  "components.landing.Features": () =>
    Promise.resolve(import("@/messages/components/landing/Features.json")),
  "components.landing.Hero": () =>
    Promise.resolve(import("@/messages/components/landing/Hero.json")),
  "components.landing.Metrics": () =>
    Promise.resolve(import("@/messages/components/landing/Metrics.json")),
  "components.landing.Newsletter": () =>
    Promise.resolve(import("@/messages/components/landing/Newsletter.json")),
  "components.landing.ProcessSteps": () =>
    Promise.resolve(import("@/messages/components/landing/ProcessSteps.json")),
  "components.landing.SocialProof": () =>
    Promise.resolve(import("@/messages/components/landing/SocialProof.json")),
  "components.landing.SupportCTA": () =>
    Promise.resolve(import("@/messages/components/landing/SupportCTA.json")),
  "components.landing.Testimonials": () =>
    Promise.resolve(import("@/messages/components/landing/Testimonials.json")),
  "components.layout.AuthLayout": () =>
    Promise.resolve(import("@/messages/components/layout/AuthLayout.json")),
  "components.layout.DashboardHeader": () =>
    Promise.resolve(
      import("@/messages/components/layout/DashboardHeader.json")
    ),
  "components.layout.DashboardSidebar": () =>
    Promise.resolve(
      import("@/messages/components/layout/DashboardSidebar.json")
    ),
  "components.layout.LandingFooter": () =>
    Promise.resolve(import("@/messages/components/layout/LandingFooter.json")),
  "components.layout.LandingHeader": () =>
    Promise.resolve(import("@/messages/components/layout/LandingHeader.json")),
  "components.ui.Dialogs": () =>
    Promise.resolve(import("@/messages/components/ui/Dialogs.json")),
  "components.ui.EmojiPicker": () =>
    Promise.resolve(import("@/messages/components/ui/EmojiPicker.json")),
  "components.ui.LanguageSwitcher": () =>
    Promise.resolve(import("@/messages/components/ui/LanguageSwitcher.json")),
  "components.ui.ThemeSwitcher": () =>
    Promise.resolve(import("@/messages/components/ui/ThemeSwitcher.json")),
  "components.workspaces.WorkspaceSwitcher": () =>
    Promise.resolve(
      import("@/messages/components/workspaces/WorkspaceSwitcher.json")
    ),

  // --- Namespaces de Páginas ---
  "pages.AboutPage": () =>
    Promise.resolve(import("@/messages/pages/AboutPage.json")),
  "pages.AuthNoticePage": () =>
    Promise.resolve(import("@/messages/pages/AuthNoticePage.json")),
  "pages.BlogPage": () =>
    Promise.resolve(import("@/messages/pages/BlogPage.json")),
  "pages.ContactPage": () =>
    Promise.resolve(import("@/messages/pages/ContactPage.json")),
  "pages.CookiePolicyPage": () =>
    Promise.resolve(import("@/messages/pages/CookiePolicyPage.json")),
  "pages.DisclaimerPage": () =>
    Promise.resolve(import("@/messages/pages/DisclaimerPage.json")),
  "pages.ForgotPasswordPage": () =>
    Promise.resolve(import("@/messages/pages/ForgotPasswordPage.json")),
  "pages.IconGalleryPage": () =>
    Promise.resolve(import("@/messages/pages/IconGalleryPage.json")),
  "pages.LegalNoticePage": () =>
    Promise.resolve(import("@/messages/pages/LegalNoticePage.json")),
  "pages.NotFoundPage": () =>
    Promise.resolve(import("@/messages/pages/NotFoundPage.json")),
  "pages.PrivacyPolicyPage": () =>
    Promise.resolve(import("@/messages/pages/PrivacyPolicyPage.json")),
  "pages.ResetPasswordPage": () =>
    Promise.resolve(import("@/messages/pages/ResetPasswordPage.json")),
  "pages.TermsOfServicePage": () =>
    Promise.resolve(import("@/messages/pages/TermsOfServicePage.json")),

  // --- Namespaces Compartidos ---
  "shared.ActionDock": () =>
    Promise.resolve(import("@/messages/shared/ActionDock.json")),
  "shared.ValidationErrors": () =>
    Promise.resolve(import("@/messages/shared/ValidationErrors.json")),
  "shared.WelcomeModal": () =>
    Promise.resolve(import("@/messages/shared/WelcomeModal.json")),
};
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización Completa**: ((Implementada)) Se ha restaurado el manifiesto para que incluya todos los namespaces de la aplicación, creando un espejo completo y de alta fidelidad para el entorno de pruebas. Esto es crítico para la estabilidad del script `generate-schema.ts`.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática**: ((Vigente)) Este manifiesto de mocks sigue siendo un candidato ideal para ser generado automáticamente a partir del manifiesto de producción, eliminando cualquier posibilidad de desincronización futura.
 *
 * =====================================================================
 */
// tests/mocks/messages.manifest.mock.ts
