/**
 * @file src/app/[locale]/auth/signup/page.tsx
 * @description Contenedor de Servidor para la página de registro. Nivelado
 *              para utilizar el componente `LoginForm` con `view="sign_up"`,
 *              alineándose con la arquitectura de autenticación delegada y
 *              resolviendo los errores de compilación de forma estructural.
 * @author Raz Podestá
 * @version 8.0.0
 */
import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { AuthFooter } from "@/components/auth/AuthFooter";
import { LoginForm } from "@/components/auth/LoginForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "SignUpPage" });
  return { title: t("metadataTitle") };
}

export default async function SignUpPage({
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

  const t = await getTranslations("SignUpPage");
  const tLogin = await getTranslations("LoginPage");
  const tSupabase = await getTranslations("SupabaseAuthUI");

  const supabaseLocalization = {
    sign_in: {
      email_label: tSupabase("email_label"),
      password_label: tSupabase("password_label"),
      button_label: tLogin("signInButton"),
    },
    sign_up: {
      email_label: tSupabase("email_label"),
      password_label: tSupabase("password_label"),
      button_label: t("signUpButton"),
    },
    forgotten_password: {
      link_text: tSupabase("forgotten_password.link_text"),
    },
    common: {
      loading_button_label: tSupabase("common.loading_button_label"),
    },
  };

  return (
    <>
      <div className="mb-8 flex flex-col items-center text-center">
        <Image
          src="/images/logo.png"
          alt="Logo de ConvertiKit"
          width={64}
          height={64}
          priority
        />
        <h1 className="mt-4 text-3xl font-bold">{t("title")}</h1>
        <p className="max-w-sm text-muted-foreground">{t("subtitle")}</p>
      </div>
      <Card className="w-full max-w-md border-border/60 bg-card/50 backdrop-blur-lg">
        <CardHeader />
        <CardContent>
          <LoginForm view="sign_up" localization={supabaseLocalization} />
        </CardContent>
        {/*
          NOTA DE ARQUITECTURA: La prop `onSwitchView` no se pasa aquí porque
          este es un flujo de página estática. El `AuthFooter` es compatible,
          pero su funcionalidad de cambio de vista solo se activará en el
          contexto de la futura UX modal del `AuthDialog`.
        */}
      </Card>
    </>
  );
}
