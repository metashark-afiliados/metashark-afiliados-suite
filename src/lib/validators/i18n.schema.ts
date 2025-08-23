// src/lib/validators/i18n.schema.ts
/**
 * @file i18n.schema.ts
 * @description Manifiesto de Tipos y SSoT para el contrato de i18n.
 *              ESTE ARCHIVO ES GENERADO AUTOMÁTICAMENTE. NO LO EDITE MANUALMENTE.
 *              Ejecute `pnpm gen:i18n:schema` para regenerarlo.
 * @author Script de Generación Automática
 * @version 2025-08-23T16:00:00.000Z
 */
import { z } from "zod";

// --- Importaciones de Schemas Atómicos (Generado Automáticamente) ---
import { ActionDockSchema } from "./i18n/ActionDock.schema";
import { ValidationErrorsSchema } from "./i18n/ValidationErrors.schema";
import { WelcomeModalSchema } from "./i18n/WelcomeModal.schema";
import { AboutPageSchema } from "./i18n/AboutPage.schema";
import { AuthNoticePageSchema } from "./i18n/AuthNoticePage.schema";
import { BlogPageSchema } from "./i18n/BlogPage.schema";
import { ContactPageSchema } from "./i18n/ContactPage.schema";
import { CookiePolicyPageSchema } from "./i18n/CookiePolicyPage.schema";
import { DisclaimerPageSchema } from "./i18n/DisclaimerPage.schema";
import { ForgotPasswordPageSchema } from "./i18n/ForgotPasswordPage.schema";
import { LegalNoticePageSchema } from "./i18n/LegalNoticePage.schema";
import { NotFoundPageSchema } from "./i18n/NotFoundPage.schema";
import { PrivacyPolicyPageSchema } from "./i18n/PrivacyPolicyPage.schema";
import { ResetPasswordPageSchema } from "./i18n/ResetPasswordPage.schema";
import { TermsOfServicePageSchema } from "./i18n/TermsOfServicePage.schema";
import { CampaignsTableSchema } from "./i18n/CampaignsTable.schema";
import { ImpersonationDialogSchema } from "./i18n/ImpersonationDialog.schema";
import { TelemetryTableSchema } from "./i18n/TelemetryTable.schema";
import { UserManagementTableSchema } from "./i18n/UserManagementTable.schema";
import { pageSchema as builderPageSchema } from "./i18n/page.schema";
import { CampaignsPageSchema } from "./i18n/CampaignsPage.schema";
import { SitesPageSchema } from "./i18n/SitesPage.schema";
import { DashboardPageSchema } from "./i18n/DashboardPage.schema";
import { LoginFormSchema } from "./i18n/LoginForm.schema";
import { OAuthButtonSchema } from "./i18n/OAuthButton.schema";
import { SupabaseAuthUISchema } from "./i18n/SupabaseAuthUI.schema";
import { BlocksPaletteSchema } from "./i18n/BlocksPalette.schema";
import { BuilderHeaderSchema } from "./i18n/BuilderHeader.schema";
import { CanvasSchema } from "./i18n/Canvas.schema";
import { SettingsPanelSchema } from "./i18n/SettingsPanel.schema";
import { SiteAssignmentControlSchema } from "./i18n/SiteAssignmentControl.schema";
import { InvitationBellSchema } from "./i18n/InvitationBell.schema";
import { DevSidebarSchema } from "./i18n/DevSidebar.schema";
import { CommandPaletteSchema } from "./i18n/CommandPalette.schema";
import { LiaChatWidgetSchema } from "./i18n/LiaChatWidget.schema";
import { BottomCTASchema } from "./i18n/BottomCTA.schema";
import { FAQSchema } from "./i18n/FAQ.schema";
import { FeaturesSchema } from "./i18n/Features.schema";
import { HeroSchema } from "./i18n/Hero.schema";
import { MetricsSchema } from "./i18n/Metrics.schema";
import { NewsletterSchema } from "./i18n/Newsletter.schema";
import { ProcessStepsSchema } from "./i18n/ProcessSteps.schema";
import { SocialProofSchema } from "./i18n/SocialProof.schema";
import { SupportCTASchema } from "./i18n/SupportCTA.schema";
import { TestimonialsSchema } from "./i18n/Testimonials.schema";
import { DashboardHeaderSchema } from "./i18n/DashboardHeader.schema";
import { DashboardSidebarSchema } from "./i18n/DashboardSidebar.schema";
import { LandingFooterSchema } from "./i18n/LandingFooter.schema";
import { LandingHeaderSchema } from "./i18n/LandingHeader.schema";
import { DialogsSchema } from "./i18n/Dialogs.schema";
import { EmojiPickerSchema } from "./i18n/EmojiPicker.schema";
import { LanguageSwitcherSchema } from "./i18n/LanguageSwitcher.schema";
import { ThemeSwitcherSchema } from "./i18n/ThemeSwitcher.schema";
import { WorkspaceSwitcherSchema } from "./i18n/WorkspaceSwitcher.schema";
import { LoginPageSchema } from "./i18n/LoginPage.schema";
import { SignUpPageSchema } from "./i18n/SignUpPage.schema";
import { AuthLayoutSchema } from "./i18n/AuthLayout.schema";
import { IconGalleryPageSchema } from "./i18n/IconGalleryPage.schema";
import { ActionDockSchema as SharedActionDockSchema } from "./i18n/ActionDock.schema";
import { ValidationErrorsSchema as SharedValidationErrorsSchema } from "./i18n/ValidationErrors.schema";
import { WelcomeModalSchema as SharedWelcomeModalSchema } from "./i18n/WelcomeModal.schema";

/**
 * @public
 * @constant i18nSchema
 * @description El schema Zod aplanado que representa la estructura completa
 *              de todos los mensajes de internacionalización.
 */
export const i18nSchema = z.object({
  ActionDock: SharedActionDockSchema,
  ValidationErrors: SharedValidationErrorsSchema,
  WelcomeModal: SharedWelcomeModalSchema,
  "pages.AboutPage": AboutPageSchema,
  "pages.AuthNoticePage": AuthNoticePageSchema,
  "pages.BlogPage": BlogPageSchema,
  "pages.ContactPage": ContactPageSchema,
  "pages.CookiePolicyPage": CookiePolicyPageSchema,
  "pages.DisclaimerPage": DisclaimerPageSchema,
  "pages.ForgotPasswordPage": ForgotPasswordPageSchema,
  "pages.IconGalleryPage": IconGalleryPageSchema,
  "pages.LegalNoticePage": LegalNoticePageSchema,
  "pages.LoginPage": LoginPageSchema,
  "pages.NotFoundPage": NotFoundPageSchema,
  "pages.PrivacyPolicyPage": PrivacyPolicyPageSchema,
  "pages.ResetPasswordPage": ResetPasswordPageSchema,
  "pages.TermsOfServicePage": TermsOfServicePageSchema,
  "app.dev-console.CampaignsTable": CampaignsTableSchema,
  "app.dev-console.ImpersonationDialog": ImpersonationDialogSchema,
  "app.dev-console.TelemetryTable": TelemetryTableSchema,
  "app.dev-console.UserManagementTable": UserManagementTableSchema,
  "app.[locale].auth.layout": AuthLayoutSchema,
  "app.[locale].auth.login.page": LoginPageSchema,
  "app.[locale].auth.signup.page": SignUpPageSchema,
  "app.[locale].builder.page": builderPageSchema,
  "app.[locale].dashboard.page": DashboardPageSchema,
  "app.[locale].dashboard.sites.page": SitesPageSchema,
  "app.[locale].dashboard.sites.[siteId].campaigns.page": CampaignsPageSchema,
  "components.auth.LoginForm": LoginFormSchema,
  "components.auth.OAuthButton": OAuthButtonSchema,
  "components.auth.SupabaseAuthUI": SupabaseAuthUISchema,
  "components.builder.BlocksPalette": BlocksPaletteSchema,
  "components.builder.BuilderHeader": BuilderHeaderSchema,
  "components.builder.Canvas": CanvasSchema,
  "components.builder.SettingsPanel": SettingsPanelSchema,
  "components.builder.SiteAssignmentControl": SiteAssignmentControlSchema,
  "components.dashboard.InvitationBell": InvitationBellSchema,
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
  "components.ui.Dialogs": DialogsSchema,
  "components.ui.EmojiPicker": EmojiPickerSchema,
  "components.ui.LanguageSwitcher": LanguageSwitcherSchema,
  "components.ui.ThemeSwitcher": ThemeSwitcherSchema,
  "components.workspaces.WorkspaceSwitcher": WorkspaceSwitcherSchema,
});

export type Messages = z.infer<typeof i18nSchema>;

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Integridad Sistémica**: ((Implementada)) Este archivo, ahora completo, resuelve la cascada de errores de i18n (`TS2307`, `TS2345`, `IntlError`). Es el engranaje central que sincroniza la capa de datos de i18n con la capa de consumo.
 * 2. **Automatización Robusta**: ((Implementada)) Al ser generado por un script, se garantiza que siempre estará sincronizado con la SSoT del `messagesManifest`.
 *
 * =====================================================================
 */
// src/lib/validators/i18n.schema.ts
