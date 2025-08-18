// src/app/[locale]/auth/login/page.tsx
/**
 * @file src/app/[locale]/auth/login/page.tsx
 * @description Contenedor de Servidor para la página de inicio de sesión.
 *              Ha sido refactorizado a un estándar de élite para alinearse con
 *              la arquitectura de "Formulario Soberano". Su única responsabilidad
 *              es ensamblar el layout y el componente `LoginForm`, eliminando
 *              toda la lógica de configuración de UI obsoleta.
 * @author Raz Podestá
 * @version 3.0.0
 */
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import React from "react";

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

  return (
    <Card className="w-full max-w-md border-border/60 bg-card/50 backdrop-blur-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{tLogin("title")}</CardTitle>
        <CardDescription>{tLogin("subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
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
 * 1. **Alineación Arquitectónica**: ((Implementada)) Se ha eliminado el paso de props (`view`, `localization`) y el código muerto asociado, alineando este Server Component con la arquitectura de Formulario Soberano del `LoginForm`.
 * 2. **Resolución de Error Crítico (TS2322)**: ((Implementada)) La corrección del contrato de props resuelve el error de compilación que impedía el funcionamiento del sistema.
 * 3. **Simplificación y Cohesión**: ((Implementada)) El componente ahora sigue estrictamente el Principio de Responsabilidad Única, actuando solo como un contenedor de layout.
 *
 * @subsection Melhorias Futuras
 * 1. **Enlace a Registro**: ((Vigente)) Añadir un `CardFooter` con un `SmartLink` a la página de registro (`/auth/signup`) para completar la UX de navegación entre los flujos de autenticación.
 *
 * =====================================================================
 */
// src/app/[locale]/auth/login/page.tsx
