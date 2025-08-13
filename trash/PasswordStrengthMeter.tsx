// src/components/auth/PasswordStrengthMeter.tsx
/**
 * @file src/components/auth/PasswordStrengthMeter.tsx
 * @description Aparato de UI atómico y de presentación puro. Ha sido nivelado
 *              a un estándar de élite con transiciones animadas usando `framer-motion`
 *              para una experiencia de usuario más fluida y profesional.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

interface PasswordStrengthMeterProps {
  /**
   * Puntuación de fortaleza de 0 a 4.
   */
  score: number;
}

export function PasswordStrengthMeter({
  score,
}: PasswordStrengthMeterProps): React.ReactElement {
  const t = useTranslations("SignUpPage.passwordStrength");
  const strengthLevels = [
    { textKey: "veryWeak", color: "bg-destructive" },
    { textKey: "weak", color: "bg-destructive" },
    { textKey: "medium", color: "bg-yellow-500" },
    { textKey: "strong", color: "bg-green-500" },
    { textKey: "veryStrong", color: "bg-green-500" },
  ];

  const currentStrength = strengthLevels[score] || strengthLevels[0];

  return (
    <div className="space-y-2 pt-2">
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden"
          >
            <motion.div
              className={cn("h-full rounded-full", currentStrength.color)}
              initial={{ width: "0%" }}
              animate={{ width: score > i ? "100%" : "0%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        {t("strength")}:{" "}
        <span
          className={cn(
            "font-semibold transition-colors",
            score === 2 && "text-yellow-500",
            score > 2 && "text-green-500"
          )}
        >
          {t(currentStrength.textKey as any)}
        </span>
      </p>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Animación Fluida**: ((Implementada)) El componente ahora utiliza `motion.div` para animar el llenado de la barra de fortaleza, proporcionando un feedback visual de alta calidad al usuario.
 *
 * @subsection Melhorias Futuras
 * 1. **Sugerencias Detalladas**: ((Vigente)) El componente podría recibir un array de `sugerencias` (ej. "Añadir un número") y renderizarlas.
 *
 * =====================================================================
 */
// src/components/auth/PasswordStrengthMeter.tsx
