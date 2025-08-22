// tests/mocks/messages.manifest.mock.ts
/**
 * @file tests/mocks/messages.manifest.mock.ts
 * @description Manifiesto de Mocks de Mensajes de i18n para el Entorno de Pruebas.
 *              Esta es la Única Fuente de Verdad para la carga de mensajes de
 *              i18n mockeados. Ha sido calibrado para devolver un `Promise`
 *              que resuelve un objeto con una exportación `default`, alineándose
 *              con el tipo `ManifestModule` y resolviendo el error `TS2739`.
 *              CORRECCIÓN: Se han reemplazado los `require()` por `import()`
 *              para compatibilidad con el entorno de módulos de Vitest.
 * @author L.I.A. Legacy
 * @version 1.0.3
 */
import { type ManifestModule } from "@/messages/types";

// Este mock directamente proporciona el mapeo que `src/messages/manifest.ts` normalmente proporcionaría.
// La clave para resolver los errores de "Cannot find module" es usar `import()` en lugar de `require()`.
// `import()` es asíncrono, pero se envuelve en `Promise.resolve()` para satisfacer el contrato de `ManifestModule`.
export const mockedMessagesManifest: Record<string, ManifestModule> = {
  // Global/Shared
  ActionDock: () =>
    Promise.resolve(import("@/messages/shared/ActionDock.json")),
  ValidationErrors: () =>
    Promise.resolve(import("@/messages/shared/ValidationErrors.json")),
  WelcomeModal: () =>
    Promise.resolve(import("@/messages/shared/WelcomeModal.json")),

  // App Routes (Server-consumed pages)
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

  // Client Components (useTranslations) & App-level Schemas
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
  AuthLayout: () =>
    Promise.resolve(import("@/messages/app/[locale]/auth/layout.json")),
  AuthFooter: () =>
    Promise.resolve(import("@/messages/components/auth/AuthFooter.json")),
  LoginForm: () =>
    Promise.resolve(import("@/messages/components/auth/LoginForm.json")),
  OAuthButton: () =>
    Promise.resolve(import("@/messages/components/auth/OAuthButton.json")),
  BuilderPage: () =>
    Promise.resolve(import("@/messages/app/[locale]/builder/page.json")),
  CampaignsPage: () =>
    Promise.resolve(
      import(
        "@/messages/app/[locale]/dashboard/sites/[siteId]/campaigns/page.json"
      )
    ),
  CommandPalette: () =>
    Promise.resolve(
      import("@/messages/components/feedback/CommandPalette.json")
    ),
  DashboardHeader: () =>
    Promise.resolve(
      import("@/messages/components/layout/DashboardHeader.json")
    ),
  DashboardPage: () =>
    Promise.resolve(import("@/messages/app/[locale]/dashboard/page.json")),
  DashboardSidebar: () =>
    Promise.resolve(
      import("@/messages/components/layout/DashboardSidebar.json")
    ),
  DevConsoleSidebar: () =>
    Promise.resolve(
      import("@/messages/components/dev-console/DevSidebar.json")
    ),
  Dialogs: () =>
    Promise.resolve(import("@/messages/components/ui/Dialogs.json")),
  EmojiPicker: () =>
    Promise.resolve(import("@/messages/components/ui/EmojiPicker.json")),
  InvitationBell: () =>
    Promise.resolve(
      import("@/messages/components/dashboard/InvitationBell.json")
    ),
  LiaChatWidget: () =>
    Promise.resolve(
      import("@/messages/components/feedback/LiaChatWidget.json")
    ),
  LoginPage: () =>
    Promise.resolve(import("@/messages/app/[locale]/auth/login/page.json")),
  SignUpPage: () =>
    Promise.resolve(import("@/messages/app/[locale]/auth/signup/page.json")),
  SiteAssignmentControl: () =>
    Promise.resolve(
      import("@/messages/components/builder/SiteAssignmentControl.json")
    ),
  SitesPage: () =>
    Promise.resolve(
      import("@/messages/app/[locale]/dashboard/sites/page.json")
    ),
  SupabaseAuthUI: () =>
    Promise.resolve(import("@/messages/components/auth/SupabaseAuthUI.json")),
  ThemeSwitcher: () =>
    Promise.resolve(import("@/messages/components/ui/ThemeSwitcher.json")),
  WorkspaceSwitcher: () =>
    Promise.resolve(
      import("@/messages/components/workspaces/WorkspaceSwitcher.json")
    ),
  LanguageSwitcher: () =>
    Promise.resolve(import("@/messages/components/ui/LanguageSwitcher.json")),

  // Landing Page Sections
  BottomCTA: () =>
    Promise.resolve(import("@/messages/components/landing/BottomCTA.json")),
  FAQ: () => Promise.resolve(import("@/messages/components/landing/FAQ.json")),
  FeaturesSection: () =>
    Promise.resolve(import("@/messages/components/landing/Features.json")),
  HeroSection: () =>
    Promise.resolve(import("@/messages/components/landing/Hero.json")),
  LandingFooter: () =>
    Promise.resolve(import("@/messages/components/layout/LandingFooter.json")),
  LandingHeader: () =>
    Promise.resolve(import("@/messages/components/layout/LandingHeader.json")),
  Metrics: () =>
    Promise.resolve(import("@/messages/components/landing/Metrics.json")),
  Newsletter: () =>
    Promise.resolve(import("@/messages/components/landing/Newsletter.json")),
  ProcessSteps: () =>
    Promise.resolve(import("@/messages/components/landing/ProcessSteps.json")),
  SocialProof: () =>
    Promise.resolve(import("@/messages/components/landing/SocialProof.json")),
  SupportCTA: () =>
    Promise.resolve(import("@/messages/components/landing/SupportCTA.json")),
  Testimonials: () =>
    Promise.resolve(import("@/messages/components/landing/Testimonials.json")),
};
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Compatibilidad con Entorno ESM de Vitest**: ((Implementada)) Se han reemplazado todas las llamadas `require()` por `import()`. Esto resuelve los errores `MODULE_NOT_FOUND` y alinea el mock con el entorno de ejecución de Vitest.
 * 2. **Integridad de Contrato de `ManifestModule`**: ((Implementada)) Cada `import()` se envuelve en `Promise.resolve()`, asegurando que el tipo de retorno coincida con el contrato `ManifestModule` (que espera una promesa que resuelve un objeto con `default`).
 *
 * @subsection Melhorias Futuras
 * 1. **Garantizar la Sincronía en Mocks**: ((Vigente)) Aunque `import()` es asíncrono, dado que estamos en un entorno de pruebas, podríamos considerar la posibilidad de precargar todos estos módulos en un `beforeAll` con `await Promise.all(...)` y luego usar los valores resueltos directamente para evitar cualquier potencial asincronía en las aserciones. (Esto se abordará en `vitest.setup.ts` y `render.tsx`).
 *
 * =====================================================================
 */
// tests/mocks/messages.manifest.mock.ts
