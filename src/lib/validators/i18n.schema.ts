// src/lib/validators/i18n.schema.ts
/**
 * @file i18n.schema.ts
 * @description Manifiesto de Tipos y Única Fuente de Verdad (SSoT) para el
 *              contrato de datos del sistema de internacionalización. Este
 *              aparato ensambla todos los schemas atómicos en un único
 *              schema Zod aplanado, garantizando la integridad y seguridad
 *              de tipos de extremo a extremo para todas las traducciones.
 * @author L.I.A. Legacy (Generado por script, verificado manualmente)
 * @version 20.0.1
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 * @date 2025-08-25
 */
import { z } from "zod";

// --- Importaciones de Schemas Atómicos (Ensamblaje "LEGO") ---
import { ActionDockSchema } from "./i18n/ActionDock.schema";
import { AboutPageSchema } from "./i18n/AboutPage.schema";
import { AdminDashboardSchema } from "./i18n/AdminDashboard.schema";
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
import { ResetPasswordPageSchema } from "./i18n/ResetPasswordPage.schema";
import { SettingsPanelSchema } from "./i18n/SettingsPanel.schema";
import { SignUpPageSchema } from "./i18n/SignUpPage.schema";
import { SiteAssignmentControlSchema } from "./i18n/SiteAssignmentControl.schema";
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
import { WelcomeModalSchema } from "./i18n/WelcomeModal.schema";
import { WorkspaceSwitcherSchema } from "./i18n/WorkspaceSwitcher.schema";

/**
 * @public
 * @constant i18nSchema
 * @description El schema Zod aplanado que representa la estructura completa
 *              de todos los mensajes de internacionalización, ensamblado a
 *              partir de todos los schemas atómicos.
 */
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

/**
 * @public
 * @typedef Messages
 * @description El tipo de TypeScript completo para todos los mensajes,
 *              inferido directamente desde el `i18nSchema`.
 */
export type Messages = z.infer<typeof i18nSchema>;

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Compilación (TS2304)**: ((Implementada)) Se ha añadido la importación faltante de `AboutPageSchema`, resolviendo el error de compilación y restaurando la integridad del sistema de tipos de i18n.
 * 2. **Completitud y Visión Holística**: ((Implementada)) Este manifiesto ahora es un reflejo completo y preciso de toda la estructura de archivos de mensajes del proyecto, actuando como la SSoT que une todos los contratos de i18n.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática**: ((Vigente)) El script `pnpm gen:i18n:schema` debe ser ejecutado para mantener este archivo sincronizado automáticamente. La importación de `AboutPageSchema` fue una corrección manual que evidencia la necesidad de automatizar este proceso para prevenir errores de omisión.
 *
 * =====================================================================
 */
// src/lib/validators/i18n.schema.ts
