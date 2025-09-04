// src/components/authentication/PasswordStrengthMeter.tsx
/**
 * @file PasswordStrengthMeter.tsx
 * @description Componente de UI atómico y de presentación 100% puro.
 *              Refactorizado para ser agnóstico al contenido, recibiendo
 *              sus textos a través de props.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
"use client";

import { zxcvbn, type ZxcvbnResult } from "@zxcvbn-ts/core";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { clientLogger } from "@/lib/logger";
import { cn } from "@/lib/utils";

export interface StrengthMeterTexts {
  strength_weak: React.ReactNode;
  strength_fair: React.ReactNode;
  strength_good: React.ReactNode;
  strength_strong: React.ReactNode;
}

interface PasswordStrengthMeterProps {
  password?: string;
  texts: StrengthMeterTexts;
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
  texts,
}: PasswordStrengthMeterProps) {
  const [strength, setStrength] = useState<ZxcvbnResult | null>(null);

  useEffect(() => {
    if (password) {
      const result = zxcvbn(password);
      clientLogger.trace(
        "[PasswordStrengthMeter] Fortaleza de contraseña calculada.",
        { score: result.score }
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
  const labelText = texts[labelKey as keyof StrengthMeterTexts];

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
