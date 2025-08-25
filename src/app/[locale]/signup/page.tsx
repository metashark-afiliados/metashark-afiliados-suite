/**
 * @file page.tsx
 * @description Página de registro de usuario. Ha sido refactorizada a un estándar de
 *              élite para consumir los namespaces de i18n completos y canónicos,
 *              resolviendo un error crítico de `MISSING_MESSAGE` que impedía el
 *              despliegue en Vercel.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useTranslations } from "next-intl";

import { SignupForm } from "@/components/authentication/sign-up-form";
import { AuthCardLayout } from "@/components/layout/AuthCardLayout";
import { clientLogger } from "@/lib/logging";
import { SmartLink } from "@/components/ui/SmartLink";

/**
 * @public
 * @page SignupPage
 * @description Ensambla el `AuthCardLayout` y el `SignupForm` para construir la
 *              vista de registro completa, actuando como un orquestador de UI puro.
 * @returns {React.ReactElement}
 */
export default function SignupPage(): React.ReactElement {
  clientLogger.trace("[SignupPage] Renderizando página de registro.");
  // --- INICIO DE CORRECCIÓN ARQUITECTÓNICA (I18N Namespace) ---
  // Se consumen los namespaces completos y canónicos según la SSoT (i18n.ts),
  // resolviendo el error `MISSING_MESSAGE` que bloqueaba el build.
  const t = useTranslations("app.[locale].signup.page");
  const tLogin = useTranslations("app.[locale].login.page");
  // --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---

  const bottomLink = tLogin.rich("alreadyHaveAccount", {
    signin: (chunks) => (
      <SmartLink
        href="/login"
        label={chunks}
        className="text-primary hover:underline"
      />
    ),
  });

  return (
    <AuthCardLayout bottomLink={bottomLink}>
      <SignupForm />
    </AuthCardLayout>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Blocker de Build**: ((Implementada)) Se han corregido las llamadas a `useTranslations` con los namespaces canónicos, resolviendo las múltiples instancias del error `MISSING_MESSAGE` asociadas a esta página y reportadas en el log de Vercel.
 * 2. **Full Observabilidad**: ((Implementada)) Se ha añadido `clientLogger` para trazar el renderizado del componente.
 *
 * @subsection Melhorias Futuras
 * 1. **Metadatos Dinámicos (SEO/UX)**: ((Vigente)) Convertir este aparato a un Server Component para poder implementar la función `generateMetadata`. Esto permitiría establecer el título de la pestaña del navegador de forma dinámica y traducida (ej. "Crear Cuenta - ConvertiKit"), mejorando el SEO y la experiencia de usuario.
 *
 * =====================================================================
 */
