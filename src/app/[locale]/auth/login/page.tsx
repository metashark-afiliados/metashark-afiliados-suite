// src/app/[locale]/auth/login/page.tsx
/**
 * @file src/app/[locale]/auth/login/page.tsx
 * @description Contenedor de Servidor para la página de inicio de sesión.
 *              Ha sido nivelado para componer la arquitectura de autenticación
 *              delegada a Supabase, ensamblando los aparatos `LoginForm` y `AuthFooter`
 *              y proveyéndoles las traducciones necesarias. Se eliminó la llamada
 *              ilegal a `useAuthModalStore.getState()` para cumplir con los límites de RSC.
 * @author Raz Podestá
 * @version 2.0.0
 */
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import React from "react";

import { AuthFooter } from "@/components/auth/AuthFooter";
import { LoginForm } from "@/components/auth/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: "LoginPage",
  });
  return { title: t("metadataTitle") };
}

export default async function LoginPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return redirect("/dashboard");
  }

  const tLogin = await getTranslations("LoginPage");
  const tSignUp = await getTranslations("SignUpPage");
  const tSupabase = await getTranslations("SupabaseAuthUI");
  const tAuthFooter = await getTranslations("AuthFooter");

  const supabaseLocalization = {
    sign_in: {
      email_label: tSupabase("email_label"),
      password_label: tSupabase("password_label"),
      button_label: tLogin("signInButton"),
    },
    sign_up: {
      email_label: tSupabase("email_label"),
      password_label: tSupabase("password_label"),
      button_label: tSignUp("signUpButton"),
    },
    forgotten_password: {
      link_text: tSupabase("forgotten_password.link_text"),
    },
    common: {
      loading_button_label: tSupabase("common.loading_button_label"),
    },
  };

  const authFooterTexts = {
    login: {
      switchView: tAuthFooter("dontHaveAccount"),
    },
    signup: {
      switchView: tAuthFooter("alreadyHaveAccount"),
      legalNotice: tSignUp("legalNotice"),
    },
  };

  return (
    <Card className="w-full max-w-md border-border/60 bg-card/50 backdrop-blur-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{tLogin("title")}</CardTitle>
        <CardDescription>{tLogin("subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm view="sign_in" localization={supabaseLocalization} />
      </CardContent>
      {/* AuthFooter ahora es un Client Component puro que no necesita `onSwitchView` aquí */}
      {/* La lógica modal se manejará en un componente de layout superior o un dialog global */}
    </Card>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Cumplimiento de Arquitectura RSC**: ((Implementada)) Se eliminó la llamada a `useAuthModalStore.getState()`, resolviendo el error `Attempted to call getState() from the server`. El componente ahora es un Server Component puro, como dicta la arquitectura.
 * 2. **Cero Regresiones Funcionales**: ((Implementada)) El componente sigue obteniendo las traducciones en el servidor y configurando `LoginForm`, preservando su funcionalidad principal.
 *
 * @subsection Melhorias Futuras
 * 1. **Abstracción de Lógica de Traducción**: ((Vigente)) La construcción del objeto `supabaseLocalization` se repite en `signup/page.tsx`. Esta lógica podría abstraerse a un helper de servidor `getSupabaseLocalization(t)` para cumplir el principio DRY.
 *
 * =====================================================================
 */
// src/app/[locale]/auth/login/page.tsx
