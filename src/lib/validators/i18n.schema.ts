// src/lib/validators/i18n.schema.ts
/**
 * @file src/lib/validators/i18n.schema.ts
 * @description Manifiesto de Tipos y Única Fuente de Verdad (SSoT) para el contrato de
 *              internacionalización (i18n). Ha sido refactorizado para ordenar
 *              alfabéticamente sus importaciones y su ensamblaje, mejorando drásticamente
 *              la mantenibilidad y la facilidad de auditoría.
 * @author Raz Podestá
 * @version 9.0.0
 */
import { z } from "zod";

import { AboutPageSchema } from "./i18n/AboutPage.schema";
import { AdminDashboardSchema } from "./i18n/AdminDashboard.schema";
import { AuthLayoutSchema } from "./i18n/AuthLayout.schema";
import { AuthNoticePageSchema } from "./i18n/AuthNoticePage.schema";
import { BlogPageSchema } from "./i18n/BlogPage.schema";
import { BottomCTASchema } from "./i18n/BottomCTA.schema";
import { BreadcrumbsSchema } from "./i18n/Breadcrumbs.schema";
import { BridgepagesGalleryPageSchema } from "./i18n/BridgepagesGalleryPage.schema";
import { BuilderPageSchema } from "./i18n/BuilderPage.schema";
import { CampaignsPageSchema } from "./i18n/CampaignsPage.schema";
import { ChooseLanguagePageSchema } from "./i18n/ChooseLanguagePage.schema";
import { ContactPageSchema } from "./i18n/ContactPage.schema";
import { CookiePolicyPageSchema } from "./i18n/CookiePolicyPage.schema";
import { DashboardHeaderSchema } from "./i18n/DashboardHeader.schema";
import { DashboardPageSchema } from "./i18n/DashboardPage.schema";
import { DashboardSidebarSchema } from "./i18n/DashboardSidebar.schema";
import { DevConsoleSchema } from "./i18n/DevConsole.schema";
import { DevConsoleSidebarSchema } from "./i18n/DevConsoleSidebar.schema";
import { DialogsSchema } from "./i18n/Dialogs.schema";
import { DisclaimerPageSchema } from "./i18n/DisclaimerPage.schema";
import { DocsPageSchema } from "./i18n/DocsPage.schema";
import { FAQSchema } from "./i18n/FAQ.schema";
import { FeaturesSectionSchema } from "./i18n/FeaturesSection.schema";
import { ForgotPasswordPageSchema } from "./i18n/ForgotPasswordPage.schema";
import { HeroSectionSchema } from "./i18n/HeroSection.schema";
import { InvitationBellSchema } from "./i18n/InvitationBell.schema";
import { LandingFooterSchema } from "./i18n/LandingFooter.schema";
import { LandingHeaderSchema } from "./i18n/LandingHeader.schema";
import { LandingsGalleryPageSchema } from "./i18n/LandingsGalleryPage.schema";
import { LanguageSwitcherSchema } from "./i18n/LanguageSwitcher.schema";
import { LegalNoticePageSchema } from "./i18n/LegalNoticePage.schema";
import { LiaChatWidgetSchema } from "./i18n/LiaChatWidget.schema";
import { LoginPageSchema } from "./i18n/LoginPage.schema";
import { MetricsSchema } from "./i18n/Metrics.schema";
import { NewsletterSchema } from "./i18n/Newsletter.schema";
import { PrivacyPolicyPageSchema } from "./i18n/PrivacyPolicyPage.schema";
import { ProcessStepsSchema } from "./i18n/ProcessSteps.schema";
import { PublicSitePageSchema } from "./i18n/PublicSitePage.schema";
import { ResetPasswordPageSchema } from "./i18n/ResetPasswordPage.schema";
import { SignUpPageSchema } from "./i18n/SignUpPage.schema";
import { SitesPageSchema } from "./i18n/SitesPage.schema";
import { SmartLinkSchema } from "./i18n/SmartLink.schema";
import { SocialProofSchema } from "./i18n/SocialProof.schema";
import { SupabaseAuthUISchema } from "./i18n/SupabaseAuthUI.schema";
import { SupportCTASchema } from "./i18n/SupportCTA.schema";
import { SupportPageSchema } from "./i18n/SupportPage.schema";
import { TermsOfServicePageSchema } from "./i18n/TermsOfServicePage.schema";
import { TestimonialsSchema } from "./i18n/Testimonials.schema";
import { ThemeSwitcherSchema } from "./i18n/ThemeSwitcher.schema";
import { UnauthorizedPageSchema } from "./i18n/UnauthorizedPage.schema";
import { WelcomePageSchema } from "./i18n/WelcomePage.schema";
import { WikiPageSchema } from "./i18n/WikiPage.schema";
import { WorkspaceSwitcherSchema } from "./i18n/WorkspaceSwitcher.schema";

/**
 * @public
 * @constant i18nSchema
 * @description El schema Zod que define la estructura completa de los archivos de mensajes (ej. en-US.json).
 *              Esta es la SSoT para todas las traducciones de la aplicación.
 */
export const i18nSchema = z.object({
  AboutPage: AboutPageSchema,
  AdminDashboard: AdminDashboardSchema,
  AuthFooter: z.object({
    dontHaveAccount: z.string(),
    alreadyHaveAccount: z.string(),
  }),
  AuthLayout: AuthLayoutSchema,
  AuthNoticePage: AuthNoticePageSchema,
  BlogPage: BlogPageSchema,
  BottomCTA: BottomCTASchema,
  Breadcrumbs: BreadcrumbsSchema,
  BridgepagesGalleryPage: BridgepagesGalleryPageSchema,
  BuilderPage: BuilderPageSchema,
  CampaignsPage: CampaignsPageSchema,
  ChooseLanguagePage: ChooseLanguagePageSchema,
  ContactPage: ContactPageSchema,
  CookiePolicyPage: CookiePolicyPageSchema,
  DashboardHeader: DashboardHeaderSchema,
  DashboardPage: DashboardPageSchema,
  DashboardSidebar: DashboardSidebarSchema,
  DevConsole: DevConsoleSchema,
  DevConsoleSidebar: DevConsoleSidebarSchema,
  Dialogs: DialogsSchema,
  DisclaimerPage: DisclaimerPageSchema,
  DocsPage: DocsPageSchema,
  FAQ: FAQSchema,
  FeaturesSection: FeaturesSectionSchema,
  ForgotPasswordPage: ForgotPasswordPageSchema,
  HeroSection: HeroSectionSchema,
  InvitationBell: InvitationBellSchema,
  LandingFooter: LandingFooterSchema,
  LandingHeader: LandingHeaderSchema,
  LandingsGalleryPage: LandingsGalleryPageSchema,
  LanguageSwitcher: LanguageSwitcherSchema,
  LegalNoticePage: LegalNoticePageSchema,
  LiaChatWidget: LiaChatWidgetSchema,
  LoginPage: LoginPageSchema,
  Metrics: MetricsSchema,
  Newsletter: NewsletterSchema,
  PrivacyPolicyPage: PrivacyPolicyPageSchema,
  ProcessSteps: ProcessStepsSchema,
  PublicSitePage: PublicSitePageSchema,
  ResetPasswordPage: ResetPasswordPageSchema,
  SignUpPage: SignUpPageSchema,
  SitesPage: SitesPageSchema,
  SmartLink: SmartLinkSchema,
  SocialProof: SocialProofSchema,
  SupabaseAuthUI: SupabaseAuthUISchema,
  SupportCTA: SupportCTASchema,
  SupportPage: SupportPageSchema,
  TermsOfServicePage: TermsOfServicePageSchema,
  Testimonials: TestimonialsSchema,
  ThemeSwitcher: ThemeSwitcherSchema,
  UnauthorizedPage: UnauthorizedPageSchema,
  WelcomePage: WelcomePageSchema,
  WikiPage: WikiPageSchema,
  WorkspaceSwitcher: WorkspaceSwitcherSchema,
});

export type MessagesType = z.infer<typeof i18nSchema>;

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Mantenibilidad Mejorada**: ((Implementada)) Las importaciones y las propiedades del objeto `i18nSchema` han sido ordenadas alfabéticamente. Esto reduce la carga cognitiva al auditar el archivo y previene errores de fusión.
 * 2. **Integridad del Contrato**: ((Implementada)) Se ha añadido el schema `AuthFooter` que estaba ausente, completando el contrato de i18n y sincronizándolo con la arquitectura de archivos. Cero regresiones.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática**: ((Vigente)) Este archivo sigue siendo el candidato ideal para ser generado y mantenido por un script que lea el directorio `src/lib/validators/i18n` y construya el objeto `i18nSchema` dinámicamente, eliminando la necesidad de mantenimiento manual.
 *
 * =====================================================================
 */
// src/lib/validators/i18n.schema.ts
