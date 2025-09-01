// tests/mocks/messages.manifest.mock.ts
/**
 * @file messages.manifest.mock.ts
 * @description Manifiesto de Importación Dinámica para el entorno de pruebas.
 *              Esta es la SSoT para cargar los archivos de mensajes .json en Vitest.
 *              ESTE ARCHIVO DEBE MANTENERSE SINCRONIZADO CON `src/messages/manifest.ts`.
 * @author L.I.A. Legacy (Reconstrucción)
 * @version 1.0.0
 * @see .docs-espejo/tests/mocks/messages.manifest.mock.ts.md
 */
import { type ManifestModule } from "@/messages/types";

export const mockedMessagesManifest: Record<string, ManifestModule> = {
  "app.dev-console.CampaignsTable": () =>
    import("../../src/messages/app/[locale]/dev-console/CampaignsTable.json"),
  "app.dev-console.ImpersonationDialog": () =>
    import(
      "../../src/messages/app/[locale]/dev-console/ImpersonationDialog.json"
    ),
  "app.dev-console.TelemetryTable": () =>
    import("../../src/messages/app/[locale]/dev-console/TelemetryTable.json"),
  "app.dev-console.UserManagementTable": () =>
    import(
      "../../src/messages/app/[locale]/dev-console/UserManagementTable.json"
    ),
  "app.[locale].dashboard.page": () =>
    import("../../src/messages/app/[locale]/dashboard/page.json"),
  "app.[locale].dashboard.sites.page": () =>
    import("../../src/messages/app/[locale]/dashboard/sites/page.json"),
  "app.[locale].dashboard.sites.[siteId].campaigns.page": () =>
    import(
      "../../src/messages/app/[locale]/dashboard/sites/[siteId]/campaigns/page.json"
    ),
  "app.[locale].login.page": () =>
    import("../../src/messages/app/[locale]/login/page.json"),
  "app.[locale].signup.page": () =>
    import("../../src/messages/app/[locale]/signup/page.json"),
  "components.auth.SupabaseAuthUI": () =>
    import("../../src/messages/components/auth/SupabaseAuthUI.json"),
  "components.builder.SiteAssignmentControl": () =>
    import("../../src/messages/components/builder/SiteAssignmentControl.json"),
  "components.dashboard.DashboardSubscriptionCard": () =>
    import(
      "../../src/messages/components/dashboard/DashboardSubscriptionCard.json"
    ),
  "components.dashboard.DashboardTeamMembersCard": () =>
    import(
      "../../src/messages/components/dashboard/DashboardTeamMembersCard.json"
    ),
  "components.dashboard.DashboardTutorialCard": () =>
    import(
      "../../src/messages/components/dashboard/DashboardTutorialCard.json"
    ),
  "components.dashboard.DashboardUsageCardGroup": () =>
    import(
      "../../src/messages/components/dashboard/DashboardUsageCardGroup.json"
    ),
  "components.dashboard.InvitationBell": () =>
    import("../../src/messages/components/dashboard/InvitationBell.json"),
  "components.dashboard.RecentActivity": () =>
    import("../../src/messages/components/dashboard/RecentActivity.json"),
  "components.dashboard.WelcomeHero": () =>
    import("../../src/messages/components/dashboard/WelcomeHero.json"),
  "components.dev-console.DevSidebar": () =>
    import("../../src/messages/components/dev-console/DevSidebar.json"),
  "components.dev-console.JsonViewerDialog": () =>
    import("../../src/messages/components/dev-console/JsonViewerDialog.json"),
  "components.feedback.CommandPalette": () =>
    import("../../src/messages/components/feedback/CommandPalette.json"),
  "components.feedback.LiaChatWidget": () =>
    import("../../src/messages/components/feedback/LiaChatWidget.json"),
  "components.layout.DashboardHeader": () =>
    import("../../src/messages/components/layout/DashboardHeader.json"),
  "components.layout.DashboardSidebar": () =>
    import("../../src/messages/components/layout/DashboardSidebar.json"),
  "components.sites.SitesHeader": () =>
    import("../../src/messages/components/sites/SitesHeader.json"),
  "components.ui.Dialogs": () =>
    import("../../src/messages/components/ui/Dialogs.json"),
  "components.ui.EmojiPicker": () =>
    import("../../src/messages/components/ui/EmojiPicker.json"),
  "components.ui.LanguageSwitcher": () =>
    import("../../src/messages/components/ui/LanguageSwitcher.json"),
  "components.ui.ThemeSwitcher": () =>
    import("../../src/messages/components/ui/ThemeSwitcher.json"),
  "components.workspaces.WorkspaceSwitcher": () =>
    import("../../src/messages/components/workspaces/WorkspaceSwitcher.json"),
  "pages.AboutPage": () => import("../../src/messages/pages/AboutPage.json"),
  "pages.AuthNoticePage": () =>
    import("../../src/messages/pages/AuthNoticePage.json"),
  "pages.BlogPage": () => import("../../src/messages/pages/BlogPage.json"),
  "pages.ContactPage": () =>
    import("../../src/messages/pages/ContactPage.json"),
  "pages.CookiePolicyPage": () =>
    import("../../src/messages/pages/CookiePolicyPage.json"),
  "pages.DisclaimerPage": () =>
    import("../../src/messages/pages/DisclaimerPage.json"),
  "pages.ForgotPasswordPage": () =>
    import("../../src/messages/pages/ForgotPasswordPage.json"),
  "pages.IconGalleryPage": () =>
    import("../../src/messages/pages/IconGalleryPage.json"),
  "pages.LegalNoticePage": () =>
    import("../../src/messages/pages/LegalNoticePage.json"),
  "pages.NotFoundPage": () =>
    import("../../src/messages/pages/NotFoundPage.json"),
  "pages.PrivacyPolicyPage": () =>
    import("../../src/messages/pages/PrivacyPolicyPage.json"),
  "pages.ResetPasswordPage": () =>
    import("../../src/messages/pages/ResetPasswordPage.json"),
  "pages.TemplateGallery": () =>
    import("../../src/messages/pages/TemplateGallery.json"),
  "pages.TermsOfServicePage": () =>
    import("../../src/messages/pages/TermsOfServicePage.json"),
  "pages.landing": () => import("../../src/messages/pages/landing.json"),
  "shared.ActionDock": () =>
    import("../../src/messages/shared/ActionDock.json"),
  "shared.ValidationErrors": () =>
    import("../../src/messages/shared/ValidationErrors.json"),
  "shared.WelcomeModal": () =>
    import("../../src/messages/shared/WelcomeModal.json"),
};
// tests/mocks/messages.manifest.mock.ts
