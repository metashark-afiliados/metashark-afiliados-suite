// src/app/[locale]/auth/login/page.tsx
/**
 * @file src/app/[locale]/auth/login/page.tsx
 * @description Contenedor de Servidor para la página de inicio de sesión. Su única
 *              responsabilidad es la seguridad (redirigir usuarios ya autenticados),
 *              la obtención de traducciones para el encabezado y el ensamblaje de los
 *              componentes de cliente.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { LoginForm } from "@/components/auth/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SmartLink } from "@/components/ui/SmartLink";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "LoginPage" });
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

  const t = await getTranslations("LoginPage");

  return (
    <Card className="w-full max-w-md border-border/60 bg-card/50 backdrop-blur-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">{t("title")}</CardTitle>
        <CardDescription>{t("subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <div className="mt-4 text-center text-sm">
          <SmartLink
            href="/auth/signup"
            label={t("dontHaveAccount")}
            className="underline"
          />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Arquitectura de Contenedor Puro**: ((Implementada)) La página actúa como un Server Component puro, responsable de la seguridad y la composición, siguiendo el patrón de élite.
 *
 * @subsection Melhorias Futuras
 * 1. **Proveedores de OAuth**: ((Vigente)) Añadir una sección de "Iniciar sesión con" que renderice botones para proveedores de OAuth (Google, GitHub), consumiendo una nueva Server Action `signInWithOAuth`.
 *
 * =====================================================================
 */
// src/app/[locale]/auth/login/page.tsx
