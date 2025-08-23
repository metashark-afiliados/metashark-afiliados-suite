// src/components/authentication/PasswordStrengthMeter.tsx
/**
 * @file PasswordStrengthMeter.tsx
 * @description Componente de UI atómico y de presentación puro que visualiza la
 *              fortaleza de una contraseña en tiempo real. Migrado al directorio
 *              canónico `/authentication`.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { zxcvbn, type ZxcvbnResult } from "@zxcvbn-ts/core";
import { motion } from "framer-motion";

import { clientLogger } from "@/lib/logging";
import { cn } from "@/lib/utils";

interface PasswordStrengthMeterProps {
  password?: string;
}

const strengthLevels = [
  { labelKey: "strength_weak", color: "bg-destructive" }, // score 0
  { labelKey: "strength_weak", color: "bg-destructive" }, // score 1
  { labelKey: "strength_fair", color: "bg-yellow-500" }, // score 2
  { labelKey: "strength_good", color: "bg-green-500" }, // score 3
  { labelKey: "strength_strong", color: "bg-green-500" }, // score 4
];

export function PasswordStrengthMeter({
  password,
}: PasswordStrengthMeterProps) {
  const t = useTranslations("SignUpPage");
  const [strength, setStrength] = useState<ZxcvbnResult | null>(null);

  useEffect(() => {
    if (password) {
      const result = zxcvbn(password);
      clientLogger.trace(
        "[PasswordStrengthMeter] Fortaleza de contraseña calculada.",
        {
          score: result.score,
        }
      );
      setStrength(result);
    } else {
      setStrength(null);
    }
  }, [password]);

  if (!password) {
    return null;
  }

  const score = strength?.score ?? 0;
  const { labelKey, color } = strengthLevels[score];

  return (
    <div className="space-y-1">
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full bg-muted overflow-hidden"
          >
            <motion.div
              className={cn("h-full", score > i ? color : "bg-muted")}
              initial={{ width: "0%" }}
              animate={{ width: score > i ? "100%" : "0%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        {t.rich(labelKey as any, {
          strong: (chunks) => (
            <strong className={cn(score > 1 && "text-foreground")}>
              {chunks}
            </strong>
          ),
        })}
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
 * 1. **Migración a Directorio Canónico**: ((Implementada)) El componente ha sido movido de `src/components/auth` a `src/components/authentication`, consolidando la SSoT de la UI de autenticación.
 * 2. **Full Observabilidad**: ((Implementada)) Se ha añadido `clientLogger.trace` para registrar el cálculo de la fortaleza de la contraseña, mejorando la visibilidad en desarrollo.
 *
 * @subsection Melhorias Futuras
 * 1. **Sugerencias de Mejora**: ((Vigente)) La librería `zxcvbn-ts` devuelve sugerencias (`strength?.feedback?.suggestions`). Se podría mostrar este texto para ayudar al usuario a crear una contraseña más fuerte.
 *
 * =====================================================================
 */
// src/components/authentication/PasswordStrengthMeter.tsx
