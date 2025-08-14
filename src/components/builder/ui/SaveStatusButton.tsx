// src/components/builder/ui/SaveStatusButton.tsx
/**
 * @file SaveStatusButton.tsx
 * @description Componente de UI atómico y puro. Renderiza el botón de guardado
 *              y su estado visual (dirty, loading, saved) basado en las props
 *              que recibe. Es completamente agnóstico a la lógica de negocio.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import { useTranslations } from "next-intl";
import { Check, Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";

export interface SaveStatusButtonProps {
  isDirty: boolean;
  isLoading: boolean;
  onSave: () => void;
}

/**
 * @public
 * @component SaveStatusButton
 * @description Renderiza un botón que cambia dinámicamente su texto, icono y
 *              estado para reflejar el proceso de guardado.
 * @param {SaveStatusButtonProps} props - Las propiedades del componente.
 * @returns {React.ReactElement}
 */
export function SaveStatusButton({
  isDirty,
  isLoading,
  onSave,
}: SaveStatusButtonProps): React.ReactElement {
  const t = useTranslations("components.builder.BuilderHeader.SaveButton");

  if (isLoading) {
    return (
      <Button disabled className="w-28">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {t("saving")}
      </Button>
    );
  }

  if (isDirty) {
    return (
      <Button onClick={onSave} aria-label={t("save_aria")} className="w-28">
        <Save className="mr-2 h-4 w-4" />
        {t("save_changes")}
      </Button>
    );
  }

  return (
    <Button variant="outline" disabled className="w-28">
      <Check className="mr-2 h-4 w-4" />
      {t("saved")}
    </Button>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este componente encapsula perfectamente una única responsabilidad: la presentación del estado de guardado.
 * 2. **Componente Puro y Predecible**: ((Implementada)) Es un componente de presentación 100% puro. Su estado visual es una función directa de sus props, haciéndolo predecible y fácil de probar.
 * 3. **Full Internacionalización**: ((Implementada)) Todos los textos visibles y `aria-labels` se consumen desde la capa de i18n.
 *
 * @subsection Melhorias Futuras
 * 1. **Animaciones de Transición**: ((Vigente)) Integrar `framer-motion` y `AnimatePresence` para animar las transiciones entre los diferentes estados del botón, proporcionando una UX más fluida.
 *
 * =====================================================================
 */
// src/components/builder/ui/SaveStatusButton.tsx
