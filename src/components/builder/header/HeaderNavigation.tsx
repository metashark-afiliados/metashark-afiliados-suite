// src/components/builder/header/HeaderNavigation.tsx
/**
 * @file HeaderNavigation.tsx
 * @description Aparato de UI atómico y puro. Renderiza la sección de
 *              navegación izquierda del `BuilderHeader`.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import { type useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";

interface HeaderNavigationProps {
  t: ReturnType<typeof useTranslations>;
}

export function HeaderNavigation({ t }: HeaderNavigationProps) {
  return (
    <div className="w-1/3">
      <Button variant="outline" asChild>
        <Link href="/dashboard" aria-label={t("back_to_dashboard_aria")}>
          {t("back_to_dashboard")}
        </Link>
      </Button>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Hiper-Atomicidad (SRP)**: ((Implementada)) Componente puro que encapsula una única responsabilidad visual.
 *
 * =====================================================================
 */
// src/components/builder/header/HeaderNavigation.tsx
