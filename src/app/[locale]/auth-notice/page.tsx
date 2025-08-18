// src/app/[locale]/auth-notice/page.tsx
/**
 * @file page.tsx
 * @description Página de notificación genérica. Ha sido refactorizada para
 *              utilizar un Suspense Boundary, resolviendo un error de
 *              prerenderizado de Next.js.
 * @author Raz Podestá
 * @version 2.0.0
 */
import React, { Suspense } from "react";
import { unstable_setRequestLocale } from "next-intl/server";
import { AuthNoticeClient } from "./auth-notice-client";

const AuthNoticeSkeleton = () => (
  <div className="w-full max-w-md">
    <div className="border border-border/60 bg-card/50 backdrop-blur-lg rounded-lg p-6 animate-pulse">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-muted mb-4" />
        <div className="h-7 w-48 bg-muted rounded-md" />
        <div className="h-4 w-64 bg-muted rounded-md mt-2" />
      </div>
    </div>
  </div>
);

export default function AuthNoticePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return (
    <Suspense fallback={<AuthNoticeSkeleton />}>
      <AuthNoticeClient />
    </Suspense>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Build**: ((Implementada)) El uso de `<Suspense>` alrededor del componente de cliente que utiliza `useSearchParams` resuelve el error de prerenderizado.
 * 2. **Experiencia de Carga Mejorada**: ((Implementada)) Se ha añadido un `AuthNoticeSkeleton` como fallback, proporcionando un feedback visual inmediato al usuario mientras el cliente se hidrata.
 *
 * =====================================================================
 */
// src/app/[locale]/auth-notice/page.tsx
