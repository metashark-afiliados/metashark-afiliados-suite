// src/lib/validators/i18n.schema.ts
/**
 * @file i18n.schema.ts
 * @description Manifiesto de Tipos y SSoT para el contrato de i18n. Sincronizado
 *              para ensamblar el nuevo schema atómico `SitesHeaderSchema`.
 * @author L.I.A. Legacy
 * @version 55.0.0
 */
import { z } from "zod";

import { AboutPageSchema } from "./i18n/AboutPage.schema";
import { ActionDockSchema } from "./i18n/ActionDock.schema";
import { AuthLayoutSchema } from "./i18n/AuthLayout.schema";
import { AuthNoticePageSchema } from "./i18n/AuthNoticePage.schema";
import { BlogPageSchema } from "./i18n/BlogPage.schema";
import { BlocksPaletteSchema } from "./i18n/BlocksPalette.schema";
import { BuilderHeaderSchema } from "./i18n/BuilderHeader.schema";
import { CampaignsPageSchema } from "./i18n/CampaignsPage.schema";
import { CampaignsTableSchema } from "./i18n/CampaignsTable.schema";
import { CanvasSchema } from "./i18n/Canvas.schema";
import { CommandPaletteSchema } from "./i18n/CommandPalette.schema";
import { ContactPageSchema } from "./i18n/ContactPage.schema";
import { CookiePolicyPageSchema } from "./i18n/CookiePolicyPage.schema";
import { DashboardHeaderSchema } from "./i18n/DashboardHeader.schema";
import { DashboardPageSchema } from "./i18n/DashboardPage.schema";
import { DashboardSidebarSchema } from "./i18n/DashboardSidebar.schema";
import { DashboardSubscriptionCardSchema } from "./i18n/DashboardSubscriptionCard.schema";
import { DashboardTeamMembersCardSchema } from "./i18n/DashboardTeamMembersCard.schema";
import { DashboardTutorialCardSchema } from "./i18n/DashboardTutorialCard.schema";
import { DashboardUsageCardGroupSchema } from "./i18n/DashboardUsageCardGroup.schema";
import { DevConsoleSidebarSchema } from "./i18n/DevConsoleSidebar.schema";
import { DialogsSchema } from "./i18n/Dialogs.schema";
import { DisclaimerPageSchema } from "./i18n/DisclaimerPage.schema";
import { EmojiPickerSchema } from "./i18n/EmojiPicker.schema";
import { ForgotPasswordPageSchema } from "./i18n/ForgotPasswordPage.schema";
import { IconGalleryPageSchema } from "./i18n/IconGalleryPage.schema";
import { ImpersonationDialogSchema } from "./i18n/ImpersonationDialog.schema";
import { InvitationBellSchema } from "./i18n/InvitationBell.schema";
import { JsonViewerDialogSchema } from "./i18n/JsonViewerDialog.schema";
import { LandingPageSchema } from "./i18n/LandingPage.schema";
import { LanguageSwitcherSchema } from "./i18n/LanguageSwitcher.schema";
import { LegalNoticePageSchema } from "./i18n/LegalNoticePage.schema";
import { LiaChatWidgetSchema } from "./i18n/LiaChatWidget.schema";
import { LoginPageSchema } from "./i18n/LoginPage.schema";
import { NotFoundPageSchema } from "./i18n/NotFoundPage.schema";
import { PrivacyPolicyPageSchema } from "./i18n/PrivacyPolicyPage.schema";
import { RecentActivitySchema } from "./i18n/RecentActivity.schema";
import { ResetPasswordPageSchema } from "./i18n/ResetPasswordPage.schema";
import { SettingsPanelSchema } from "./i18n/SettingsPanel.schema";
import { SignUpPageSchema } from "./i18n/SignUpPage.schema";
import { SiteAssignmentControlSchema } from "./i18n/SiteAssignmentControl.schema";
import { SitesHeaderSchema } from "./i18n/SitesHeader.schema";
import { SitesPageSchema } from "./i18n/SitesPage.schema";
import { SupabaseAuthUISchema } from "./i18n/SupabaseAuthUI.schema";
import { TelemetryTableSchema } from "./i18n/TelemetryTable.schema";
import { TemplateGallerySchema } from "./i18n/TemplateGallery.schema";
import { TermsOfServicePageSchema } from "./i18n/TermsOfServicePage.schema";
import { ThemeSwitcherSchema } from "./i18n/ThemeSwitcher.schema";
import { UserManagementTableSchema } from "./i18n/UserManagementTable.schema";
import { ValidationErrorsSchema } from "./i18n/ValidationErrors.schema";
import { WelcomeHeroSchema } from "./i18n/WelcomeHero.schema";
import { WelcomeModalSchema } from "./i18n/WelcomeModal.schema";
import { WorkspaceSwitcherSchema } from "./i18n/WorkspaceSwitcher.schema";

export const i18nSchema = z.object({
  "app.dev-console.CampaignsTable": CampaignsTableSchema,
  "app.dev-console.ImpersonationDialog": ImpersonationDialogSchema,
  "app.dev-console.TelemetryTable": TelemetryTableSchema,
  "app.dev-console.UserManagementTable": UserManagementTableSchema,
  "app.[locale].dashboard.page": DashboardPageSchema,
  "app.[locale].dashboard.sites.page": SitesPageSchema,
  "app.[locale].dashboard.sites.[siteId].campaigns.page": CampaignsPageSchema,
  "app.[locale].login.page": LoginPageSchema,
  "app.[locale].signup.page": SignUpPageSchema,
  "components.auth.SupabaseAuthUI": SupabaseAuthUISchema,
  "components.builder.BlocksPalette": BlocksPaletteSchema,
  "components.builder.BuilderHeader": BuilderHeaderSchema,
  "components.builder.Canvas": CanvasSchema,
  "components.builder.SettingsPanel": SettingsPanelSchema,
  "components.builder.SiteAssignmentControl": SiteAssignmentControlSchema,
  "components.dashboard.DashboardSubscriptionCard":
    DashboardSubscriptionCardSchema,
  "components.dashboard.DashboardTeamMembersCard":
    DashboardTeamMembersCardSchema,
  "components.dashboard.DashboardTutorialCard": DashboardTutorialCardSchema,
  "components.dashboard.DashboardUsageCardGroup": DashboardUsageCardGroupSchema,
  "components.dashboard.InvitationBell": InvitationBellSchema,
  "components.dashboard.RecentActivity": RecentActivitySchema,
  "components.dashboard.WelcomeHero": WelcomeHeroSchema,
  "components.dev-console.DevSidebar": DevConsoleSidebarSchema,
  "components.dev-console.JsonViewerDialog": JsonViewerDialogSchema,
  "components.feedback.CommandPalette": CommandPaletteSchema,
  "components.feedback.LiaChatWidget": LiaChatWidgetSchema,
  "components.layout.AuthLayout": AuthLayoutSchema,
  "components.layout.DashboardHeader": DashboardHeaderSchema,
  "components.layout.DashboardSidebar": DashboardSidebarSchema,
  "components.sites.SitesHeader": SitesHeaderSchema,
  "components.ui.Dialogs": DialogsSchema,
  "components.ui.EmojiPicker": EmojiPickerSchema,
  "components.ui.LanguageSwitcher": LanguageSwitcherSchema,
  "components.ui.ThemeSwitcher": ThemeSwitcherSchema,
  "components.workspaces.WorkspaceSwitcher": WorkspaceSwitcherSchema,
  "pages.AboutPage": AboutPageSchema,
  "pages.AuthNoticePage": AuthNoticePageSchema,
  "pages.BlogPage": BlogPageSchema,
  "pages.ContactPage": ContactPageSchema,
  "pages.CookiePolicyPage": CookiePolicyPageSchema,
  "pages.DisclaimerPage": DisclaimerPageSchema,
  "pages.ForgotPasswordPage": ForgotPasswordPageSchema,
  "pages.IconGalleryPage": IconGalleryPageSchema,
  "pages.LegalNoticePage": LegalNoticePageSchema,
  "pages.NotFoundPage": NotFoundPageSchema,
  "pages.PrivacyPolicyPage": PrivacyPolicyPageSchema,
  "pages.ResetPasswordPage": ResetPasswordPageSchema,
  "pages.TemplateGallery": TemplateGallerySchema,
  "pages.TermsOfServicePage": TermsOfServicePageSchema,
  "pages.landing": LandingPageSchema,
  "shared.ActionDock": ActionDockSchema,
  "shared.ValidationErrors": ValidationErrorsSchema,
  "shared.WelcomeModal": WelcomeModalSchema,
});

export type Messages = z.infer<typeof i18nSchema>;
// src/lib/validators/i18n.schema.ts
