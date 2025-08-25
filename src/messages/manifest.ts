// src/messages/manifest.ts
/**
 * @file manifest.ts
 * @description Manifiesto de Importación Dinámica y Única Fuente de Verdad (SSoT)
 *              para el registro de todos los archivos de mensajes de i18n. Este aparato
 *              es el corazón de la arquitectura de internacionalización IMAS, permitiendo
 *              la carga dinámica y modular de traducciones.
 * @author L.I.A. Legacy (Generado por script, verificado manualmente)
 * @version 20.0.0
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 * @date 2025-08-25
 */
import { type ManifestModule } from "./types";

/**
 * @public
 * @constant messagesManifest
 * @description El registro canónico de todos los namespaces de mensajes.
 *              Cada entrada es una función de importación dinámica que `next-intl`
 *              utiliza para cargar los mensajes necesarios para un locale específico.
 */
export const messagesManifest: Record<string, ManifestModule> = {
  // --- Namespaces a Nivel de App (Rutas Específicas) ---
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

  // --- Namespaces de Componentes ---
  "components.auth.LoginForm": () => import("./components/auth/LoginForm.json"),
  "components.auth.OAuthButton": () =>
    import("./components/auth/OAuthButton.json"),
  "components.auth.SupabaseAuthUI": () =>
    import("./components/auth/SupabaseAuthUI.json"),
  "components.builder.BlocksPalette": () =>
    import("./components/builder/BlocksPalette.json"),
  "components.builder.BuilderHeader": () =>
    import("./components/builder/BuilderHeader.json"),
  "components.builder.Canvas": () => import("./components/builder/Canvas.json"),
  "components.builder.SettingsPanel": () =>
    import("./components/builder/SettingsPanel.json"),
  "components.builder.SiteAssignmentControl": () =>
    import("./components/builder/SiteAssignmentControl.json"),
  "components.dashboard.InvitationBell": () =>
    import("./components/dashboard/InvitationBell.json"),
  "components.dev-console.DevSidebar": () =>
    import("./components/dev-console/DevSidebar.json"),
  "components.feedback.CommandPalette": () =>
    import("./components/feedback/CommandPalette.json"),
  "components.feedback.LiaChatWidget": () =>
    import("./components/feedback/LiaChatWidget.json"),
  "components.landing.BottomCTA": () =>
    import("./components/landing/BottomCTA.json"),
  "components.landing.FAQ": () => import("./components/landing/FAQ.json"),
  "components.landing.Features": () =>
    import("./components/landing/Features.json"),
  "components.landing.Hero": () => import("./components/landing/Hero.json"),
  "components.landing.Metrics": () =>
    import("./components/landing/Metrics.json"),
  "components.landing.Newsletter": () =>
    import("./components/landing/Newsletter.json"),
  "components.landing.ProcessSteps": () =>
    import("./components/landing/ProcessSteps.json"),
  "components.landing.SocialProof": () =>
    import("./components/landing/SocialProof.json"),
  "components.landing.SupportCTA": () =>
    import("./components/landing/SupportCTA.json"),
  "components.landing.Testimonials": () =>
    import("./components/landing/Testimonials.json"),
  "components.layout.AuthLayout": () =>
    import("./components/layout/AuthLayout.json"),
  "components.layout.DashboardHeader": () =>
    import("./components/layout/DashboardHeader.json"),
  "components.layout.DashboardSidebar": () =>
    import("./components/layout/DashboardSidebar.json"),
  "components.layout.LandingFooter": () =>
    import("./components/layout/LandingFooter.json"),
  "components.layout.LandingHeader": () =>
    import("./components/layout/LandingHeader.json"),
  "components.ui.Dialogs": () => import("./components/ui/Dialogs.json"),
  "components.ui.EmojiPicker": () => import("./components/ui/EmojiPicker.json"),
  "components.ui.LanguageSwitcher": () =>
    import("./components/ui/LanguageSwitcher.json"),
  "components.ui.ThemeSwitcher": () =>
    import("./components/ui/ThemeSwitcher.json"),
  "components.workspaces.WorkspaceSwitcher": () =>
    import("./components/workspaces/WorkspaceSwitcher.json"),

  // --- Namespaces de Páginas Genéricas ---
  "pages.AboutPage": () => import("./pages/AboutPage.json"),
  "pages.AuthNoticePage": () => import("./pages/AuthNoticePage.json"),
  "pages.BlogPage": () => import("./pages/BlogPage.json"),
  "pages.BuilderPage": () => import("./pages/BuilderPage.json"),
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

  // --- Namespaces Compartidos (sin prefijo) ---
  "shared.ActionDock": () => import("./shared/ActionDock.json"),
  "shared.ValidationErrors": () => import("./shared/ValidationErrors.json"),
  "shared.WelcomeModal": () => import("./shared/WelcomeModal.json"),
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Completitud y Sincronización**: ((Implementada)) Este manifiesto ahora es un reflejo completo y preciso de toda la estructura de archivos de mensajes del proyecto, incluyendo los namespaces para el `TemplateGallery`.
 * 2. **Visión Holística**: ((Implementada)) Al ser la SSoT para la carga de mensajes, este aparato es fundamental para la integridad de todo el sistema de i18n.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática**: ((Vigente)) Este manifiesto es el candidato ideal para ser generado y mantenido por un script (`pnpm gen:i18n:manifest`) que lea la estructura de directorios, eliminando cualquier posibilidad de error de desincronización manual en el futuro.
 *
 * =====================================================================
 */
// src/messages/manifest.ts
