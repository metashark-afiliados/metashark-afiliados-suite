// src/components/builder/header/HeaderActions.tsx
/**
 * @file HeaderActions.tsx
 * @description Aparato de UI atómico y puro. Renderiza la sección de
 *              acciones derecha del `BuilderHeader`.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import { type useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { SaveStatusButton } from "../ui/SaveStatusButton";

interface HeaderActionsProps {
  isDirty: boolean;
  isLoading: boolean;
  onSave: () => void;
  t: ReturnType<typeof useTranslations>;
}

export function HeaderActions(props: HeaderActionsProps) {
  return (
    <div className="flex w-1/3 items-center justify-end gap-2">
      <Button variant="ghost" aria-label={props.t("preview_aria")}>
        {props.t("preview_button")}
      </Button>
      <SaveStatusButton
        isDirty={props.isDirty}
        isLoading={props.isLoading}
        onSave={props.onSave}
      />
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Hiper-Atomicidad (SRP)**: ((Implementada)) Componente de ensamblaje puro que agrupa otros átomos de UI.
 *
 * =====================================================================
 */
// src/components/builder/header/HeaderActions.tsx
