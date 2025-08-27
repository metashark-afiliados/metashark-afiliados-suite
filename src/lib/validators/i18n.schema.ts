// src/lib/validators/i18n.schema.ts
/**
 * @file i18n.schema.ts
 * @description Manifiesto de Tipos y SSoT para el contrato de i18n. Ha sido
 *              actualizado para ensamblar todos los nuevos schemas soberanos,
 *              resolviendo la desincronización de tipos y completando la
 *              cascada de correcciones.
 * @author L.I.A. Legacy (Generado por script, verificado manualmente)
 * @version 23.0.0
 * @date 2025-08-27
 */
import { z } from "zod";

// --- Importaciones de Schemas Atómicos (Ensamblaje "LEGO") ---
import { AboutPageSchema } from "./i18n/AboutPage.schema";
import { ActionDockSchema } from "./i18n/ActionDock.schema";
import { AuthLayoutSchema } from "./i18n/AuthLayout.schema";
import { AuthNoticePageSchema } from "./i18n/AuthNoticePage.schema";
import { BlocksPaletteSchema } from "./i18n/BlocksPalette.schema";
import { BlogPageSchema } from "./i18n/BlogPage.schema";
import { BottomCTASchema } from "./i18n/BottomCTA.schema";
import { BuilderHeaderSchema } from "./i18n/BuilderHeader.schema";
import { BuilderPageSchema } from "./i18n/BuilderPage.schema";
import { CampaignsPageSchema } from "./i18n/CampaignsPage.schema";
import { CampaignsTableSchema } from "./i18n/CampaignsTable.schema";
import { CanvasSchema } from "./i18n/Canvas.schema";
import { CommandPaletteSchema } from "./i18n/CommandPalette.schema";
import { ContactPageSchema } from "./i18n/ContactPage.schema";
import { CookiePolicyPageSchema } from "./i18n/CookiePolicyPage.schema";
import { DashboardHeaderSchema } from "./i18n/DashboardHeader.schema";
import { DashboardPageSchema } from "./i18n/DashboardPage.schema";
import { DashboardSidebarSchema } from "./i18n/DashboardSidebar.schema";
import { DevSidebarSchema } from "./i18n/DevSidebar.schema";
import { DialogsSchema } from "./i18n/Dialogs.schema";
import { DisclaimerPageSchema } from "./i18n/DisclaimerPage.schema";
import { EmojiPickerSchema } from "./i18n/EmojiPicker.schema";
import { FAQSchema } from "./i18n/FAQ.schema";
import { FeaturesSchema } from "./i18n/Features.schema";
import { ForgotPasswordPageSchema } from "./i18n/ForgotPasswordPage.schema";
import { HeroSchema } from "./i18n/Hero.schema";
import { IconGalleryPageSchema } from "./i18n/IconGalleryPage.schema";
import { ImpersonationDialogSchema } from "./i18n/ImpersonationDialog.schema";
import { InvitationBellSchema } from "./i18n/InvitationBell.schema";
import { LandingFooterSchema } from "./i18n/LandingFooter.schema";
import { LandingHeaderSchema } from "./i18n/LandingHeader.schema";
import { LanguageSwitcherSchema } from "./i18n/LanguageSwitcher.schema";
import { LegalNoticePageSchema } from "./i18n/LegalNoticePage.schema";
import { LiaChatWidgetSchema } from "./i18n/LiaChatWidget.schema";
import { LoginFormSchema } from "./i18n/LoginForm.schema";
import { LoginPageSchema } from "./i18n/LoginPage.schema";
import { MetricsSchema } from "./i18n/Metrics.schema";
import { NewsletterSchema } from "./i18n/Newsletter.schema";
import { NotFoundPageSchema } from "./i18n/NotFoundPage.schema";
import { OAuthButtonSchema } from "./i18n/OAuthButton.schema";
import { PrivacyPolicyPageSchema } from "./i18n/PrivacyPolicyPage.schema";
import { ProcessStepsSchema } from "./i18n/ProcessSteps.schema";
import { RecentActivitySchema } from "./i18n/RecentActivity.schema";
import { ResetPasswordPageSchema } from "./i18n/ResetPasswordPage.schema";
import { SettingsPanelSchema } from "./i18n/SettingsPanel.schema";
import { SignUpPageSchema } from "./i18n/SignUpPage.schema";
import { SiteAssignmentControlSchema } from "./i18n/SiteAssignmentControl.schema";
import { SitesHeaderSchema } from "./i18n/SitesHeader.schema"; // <-- SINCRONIZADO
import { SitesPageSchema } from "./i18n/SitesPage.schema";
import { SocialProofSchema } from "./i18n/SocialProof.schema";
import { SupabaseAuthUISchema } from "./i18n/SupabaseAuthUI.schema";
import { SupportCTASchema } from "./i18n/SupportCTA.schema";
import { TelemetryTableSchema } from "./i18n/TelemetryTable.schema";
import { TemplateGallerySchema } from "./i18n/TemplateGallery.schema";
import { TermsOfServicePageSchema } from "./i18n/TermsOfServicePage.schema";
import { TestimonialsSchema } from "./i18n/Testimonials.schema";
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
  "components.auth.LoginForm": LoginFormSchema,
  "components.auth.OAuthButton": OAuthButtonSchema,
  "components.auth.SupabaseAuthUI": SupabaseAuthUISchema,
  "components.builder.BlocksPalette": BlocksPaletteSchema,
  "components.builder.BuilderHeader": BuilderHeaderSchema,
  "components.builder.Canvas": CanvasSchema,
  "components.builder.SettingsPanel": SettingsPanelSchema,
  "components.builder.SiteAssignmentControl": SiteAssignmentControlSchema,
  "components.dashboard.InvitationBell": InvitationBellSchema,
  "components.dashboard.RecentActivity": RecentActivitySchema,
  "components.dashboard.WelcomeHero": WelcomeHeroSchema,
  "components.dev-console.DevSidebar": DevSidebarSchema,
  "components.feedback.CommandPalette": CommandPaletteSchema,
  "components.feedback.LiaChatWidget": LiaChatWidgetSchema,
  "components.landing.BottomCTA": BottomCTASchema,
  "components.landing.FAQ": FAQSchema,
  "components.landing.Features": FeaturesSchema,
  "components.landing.Hero": HeroSchema,
  "components.landing.Metrics": MetricsSchema,
  "components.landing.Newsletter": NewsletterSchema,
  "components.landing.ProcessSteps": ProcessStepsSchema,
  "components.landing.SocialProof": SocialProofSchema,
  "components.landing.SupportCTA": SupportCTASchema,
  "components.landing.Testimonials": TestimonialsSchema,
  "components.layout.AuthLayout": AuthLayoutSchema,
  "components.layout.DashboardHeader": DashboardHeaderSchema,
  "components.layout.DashboardSidebar": DashboardSidebarSchema,
  "components.layout.LandingFooter": LandingFooterSchema,
  "components.layout.LandingHeader": LandingHeaderSchema,
  "components.sites.SitesHeader": SitesHeaderSchema, // <-- SINCRONIZADO
  "components.ui.Dialogs": DialogsSchema,
  "components.ui.EmojiPicker": EmojiPickerSchema,
  "components.ui.LanguageSwitcher": LanguageSwitcherSchema,
  "components.ui.ThemeSwitcher": ThemeSwitcherSchema,
  "components.workspaces.WorkspaceSwitcher": WorkspaceSwitcherSchema,
  "pages.AboutPage": AboutPageSchema,
  "pages.AuthNoticePage": AuthNoticePageSchema,
  "pages.BlogPage": BlogPageSchema,
  "pages.BuilderPage": BuilderPageSchema,
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
  "shared.ActionDock": ActionDockSchema,
  "shared.ValidationErrors": ValidationErrorsSchema,
  "shared.WelcomeModal": WelcomeModalSchema,
});

export type Messages = z.infer<typeof i18nSchema>;

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución Sistémica de `TS2345`**: ((Implementada)) Se han importado y registrado todos los schemas atómicos que corresponden a los namespaces del `messagesManifest`. Esto sincroniza completamente la SSoT de tipos con la SSoT de mensajes, resolviendo la causa raíz de todos los errores de i18n.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática**: ((Vigente)) El script `pnpm gen:i18n:schema` debe ser ejecutado para mantener este archivo sincronizado automáticamente.
 *
 * =====================================================================
 */
// src/lib/validators/i18n.schema.ts
