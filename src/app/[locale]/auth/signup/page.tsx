// src/app/[locale]/auth/signup/page.tsx
/**
 * @file src/app/[locale]/auth/signup/page.tsx
 * @description Contenedor de Servidor para la página de registro. Ha sido
 *              refactorizado para renderizar un futuro `SignUpForm` soberano
 *              y eliminar las props obsoletas.
 * @author Raz Podestá
 * @version 9.0.0
 */
import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

// Nota: Se importará un SignUpForm futuro. Por ahora, podemos usar LoginForm como placeholder si la UI es similar.
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
           {/* --- INICIO DE CORRECCIÓN (RUPTURA DE CONTRATO) --- */}
          <LoginForm />
           {/* --- FIN DE CORRECCIÓN --- */}
        </CardContent>
      </Card>
    </>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Ruptura de Contrato**: ((Implementada)) Se ha eliminado el paso de props obsoletas a `LoginForm`, resolviendo el error de tipo `TS2322`.
 *
 * @subsection Melhorias Futuras
 * 1. **Crear `SignUpForm` Soberano**: ((Vigente)) Crear un `SignUpForm.tsx` específico que invoque la `signUpAction` para un flujo de registro completo.
 *
 * =====================================================================
 */
// src/app/[locale]/auth/signup/page.tsx