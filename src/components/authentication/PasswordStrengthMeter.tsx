// src/components/authentication/PasswordStrengthMeter.tsx
/**
 * @file PasswordStrengthMeter.tsx
 * @description Componente de UI atómico y soberano. Muestra una barra de
 *              fortaleza de contraseña con feedback visual en tiempo real.
 *              Consume sus propias traducciones, desacoplándose de sus padres
 *              y resolviendo errores de contrato de API.
 * @author L.I.A. Legacy
 * @version 4.0.0
 * @see .docs-espejo/components/authentication/PasswordStrengthMeter.tsx.md
 */
"use client";

import { zxcvbn, type ZxcvbnResult } from "@zxcvbn-ts/core";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import React from "react";

import { useTypedTranslations } from "@/lib/i18n/hooks";
import { clientLogger } from "@/lib/logger";
import { cn } from "@/lib/utils";

interface PasswordStrengthMeterProps {
  password?: string;
}

const strengthLevels = [
  { labelKey: "strength_weak", color: "bg-destructive" },
  { labelKey: "strength_weak", color: "bg-destructive" },
  { labelKey: "strength_fair", color: "bg-yellow-500" },
  { labelKey: "strength_good", color: "bg-green-500" },
  { labelKey: "strength_strong", color: "bg-green-500" },
];

export function PasswordStrengthMeter({
  password,
}: PasswordStrengthMeterProps): React.ReactElement | null {
  const t = useTypedTranslations("app.[locale].signup.page");
  const [strength, setStrength] = useState<ZxcvbnResult | null>(null);

  useEffect(() => {
    if (password) {
      const result = zxcvbn(password);
      clientLogger.trace(
        { score: result.score },
        "[PasswordStrengthMeter] Fortaleza de contraseña calculada."
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
  const labelText = t.rich(labelKey as any, {
    strong: (chunks) => <strong>{chunks}</strong>,
  });

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
      <p className="text-xs text-muted-foreground">{labelText}</p>
    </div>
  );
}
// src/components/authentication/PasswordStrengthMeter.tsx
