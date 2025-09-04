// src/messages/manifest.ts
/**
 * @file manifest.ts
 * @description Manifiesto de Importación Dinámica y SSoT. Sincronizado para
 *              reflejar la estructura de archivos real del proyecto, resolviendo
 *              errores de módulos no encontrados.
 * @author L.I.A. Legacy
 * @version 29.0.0
 */
import { type ManifestModule } from "./types";

export const messagesManifest: Record<string, ManifestModule> = {
  "app.dev-console.CampaignsTable": () =>
    import("./app/[locale]/dev-console/CampaignsTable.json"),
  "app.dev-console.ImpersonationDialog": () =>
    import("./app/[locale]/dev-console/ImpersonationDialog.json"),
  "app.dev-console.TelemetryTable": () =>
    import("./app/[locale]/dev-console/TelemetryTable.json"),
  "app.dev-console.UserManagementTable": () =>
    import("./app/[locale]/dev-console/UserManagementTable.json"),
  "app.[locale].dashboard.page": () =>
    import("./app/[locale]/dashboard/page.json"),
  "app.[locale].dashboard.sites.page": () =>
    import("./app/[locale]/dashboard/sites/page.json"),
  "app.[locale].dashboard.sites.[siteId].campaigns.page": () =>
    import("./app/[locale]/dashboard/sites/[siteId]/campaigns/page.json"),
  "app.[locale].login.page": () => import("./app/[locale]/login/page.json"),
  "app.[locale].signup.page": () => import("./app/[locale]/signup/page.json"),
  "components.auth.OAuthButton": () =>
    import("./components/auth/OAuthButton.json"),
  "components.builder.BlocksPalette": () =>
    import("./components/builder/BlocksPalette.json"),
  "components.builder.BuilderHeader": () =>
    import("./components/builder/BuilderHeader.json"),
  "components.builder.Canvas": () => import("./components/builder/Canvas.json"),
  "components.builder.SettingsPanel": () =>
    import("./components/builder/SettingsPanel.json"),
  "components.builder.SiteAssignmentControl": () =>
    import("./components/builder/SiteAssignmentControl.json"),
  "components.dashboard.DashboardSubscriptionCard": () =>
    import("./components/dashboard/DashboardSubscriptionCard.json"),
  "components.dashboard.DashboardTeamMembersCard": () =>
    import("./components/dashboard/DashboardTeamMembersCard.json"),
  "components.dashboard.DashboardTutorialCard": () =>
    import("./components/dashboard/DashboardTutorialCard.json"),
  "components.dashboard.DashboardUsageCardGroup": () =>
    import("./components/dashboard/DashboardUsageCardGroup.json"),
  "components.dashboard.InvitationBell": () =>
    import("./components/dashboard/InvitationBell.json"),
  "components.dashboard.RecentActivity": () =>
    import("./components/dashboard/RecentActivity.json"),
  "components.dashboard.WelcomeHero": () =>
    import("./components/dashboard/WelcomeHero.json"),
  "components.dev-console.DevSidebar": () =>
    import("./components/dev-console/DevSidebar.json"),
  "components.dev-console.JsonViewerDialog": () =>
    import("./components/dev-console/JsonViewerDialog.json"),
  "components.feedback.CommandPalette": () =>
    import("./components/feedback/CommandPalette.json"),
  "components.feedback.LiaChatWidget": () =>
    import("./components/feedback/LiaChatWidget.json"),
  "components.layout.AuthLayout": () =>
    import("./components/layout/AuthLayout.json"),
  "components.layout.DashboardHeader": () =>
    import("./components/layout/DashboardHeader.json"),
  "components.layout.DashboardSidebar": () =>
    import("./components/layout/DashboardSidebar.json"),
  "components.sites.SitesHeader": () =>
    import("./components/sites/SitesHeader.json"),
  "components.ui.Dialogs": () => import("./components/ui/Dialogs.json"),
  "components.ui.EmojiPicker": () => import("./components/ui/EmojiPicker.json"),
  "components.ui.LanguageSwitcher": () =>
    import("./components/ui/LanguageSwitcher.json"),
  "components.ui.ThemeSwitcher": () =>
    import("./components/ui/ThemeSwitcher.json"),
  "components.workspaces.WorkspaceSwitcher": () =>
    import("./components/workspaces/WorkspaceSwitcher.json"),
  "pages.AboutPage": () => import("./pages/AboutPage.json"),
  "pages.AuthNoticePage": () => import("./pages/AuthNoticePage.json"),
  "pages.BlogPage": () => import("./pages/BlogPage.json"),
  "pages.ContactPage": () => import("./pages/ContactPage.json"),
  "pages.CookiePolicyPage": () => import("./pages/CookiePolicyPage.json"),
  "pages.DisclaimerPage": () => import("./pages/DisclaimerPage.json"),
  "pages.ForgotPasswordPage": () => import("./pages/ForgotPasswordPage.json"),
  "pages.IconGalleryPage": () => import("./pages/IconGalleryPage.json"),
  "pages.LegalNoticePage": () => import("./pages/LegalNoticePage.json"),
  "pages.NotFoundPage": () => import("./pages/NotFoundPage.json"),
  "pages.PrivacyPolicyPage": () => import("./pages/PrivacyPolicyPage.json"),
  "pages.ResetPasswordPage": () => import("./pages/ResetPasswordPage.json"),
  "pages.TemplateGallery": () => import("./pages/TemplateGallery.json"),
  "pages.TermsOfServicePage": () => import("./pages/TermsOfServicePage.json"),
  "pages.landing": () => import("./pages/landing.json"),
  "shared.ActionDock": () => import("./shared/ActionDock.json"),
  "shared.ValidationErrors": () => import("./shared/ValidationErrors.json"),
  "shared.WelcomeModal": () => import("./shared/WelcomeModal.json"),
};
// src/messages/manifest.ts
