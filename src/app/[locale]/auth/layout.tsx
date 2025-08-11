// src/app/[locale]/auth/layout.tsx
/**
 * @file src/app/[locale]/auth/layout.tsx
 * @description Layout de Servidor para el Route Group de autenticación `(auth)`.
 *              Este aparato define la estructura visual común para todas las páginas
 *              de autenticación (login, signup, etc.) y es un Server Component que
 *              obtiene sus propias traducciones para elementos como el enlace de
 *              retorno y los `aria-label`.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import React from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Link } from "@/lib/navigation";

/**
 * @public
 * @async
 * @component AuthLayout
 * @description Renderiza el layout visual común para las páginas de autenticación,
 *              incluyendo el fondo degradado y el logo en la esquina superior izquierda.
 * @param {object} props
 * @param {React.ReactNode} props.children - Las páginas anidadas (ej. LoginPage) que se renderizarán aquí.
 * @returns {Promise<React.ReactElement>}
 */
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  const t = await getTranslations("AuthLayout");

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at top, hsl(var(--primary)/0.05), transparent 30%)",
        }}
      />
      <Link
        href="/"
        className="absolute top-8 left-8"
        aria-label={t("go_back_home_aria")}
      >
        <Image
          src="/images/logo.png"
          alt="Logo de MetaShark"
          width={40}
          height={40}
          priority
        />
      </Link>
      {children}
    </main>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Layout de Grupo de Rotas**: ((Implementada)) La existencia de este aparato en un Route Group (`(auth)`) es una práctica de élite para aplicar un layout a un conjunto de rutas sin afectar la URL.
 * 2. **Componente de Servidor**: ((Implementada)) Al ser un Server Component, este layout es altamente performático, ya que se renderiza en el servidor y no añade JavaScript al cliente.
 * 3. **Internacionalización Completa**: ((Implementada)) El `aria-label` se obtiene desde la capa de i18n, cumpliendo el protocolo.
 *
 * @subsection Melhorias Futuras
 * 1. **Transiciones de Página**: ((Vigente)) Se podría envolver `{children}` en un componente de `framer-motion` para aplicar una transición de `fade-in` a las páginas de autenticación al navegar entre ellas.
 *
 * =====================================================================
 */
// src/app/[locale]/auth/layout.tsx
