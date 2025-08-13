// src/components/ui/DynamicIcon.tsx
/**
 * @file src/components/ui/DynamicIcon.tsx
 * @description Componente de UI atómico para renderizar iconos de `lucide-react`
 *              dinámicamente. Actualizado para usar el `clientLogger` ligero.
 * @author L.I.A. Legacy
 * @version 1.1.0
 */
"use client";

import React from "react";
import { icons, type LucideProps } from "lucide-react";

// CORRECCIÓN: Se importa el logger específico para el cliente.
import { clientLogger } from "@/lib/logging";

interface DynamicIconProps extends LucideProps {
  name: string;
}

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  const LucideIcon = icons[name as keyof typeof icons];

  if (!LucideIcon) {
    // CORRECCIÓN: Se utiliza el logger de cliente.
    clientLogger.warn(
      `[DynamicIcon] Ícono no encontrado en lucide-react: "${name}"`
    );
    return null;
  }

  return <LucideIcon {...props} />;
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Desacoplamento de Dependências**: ((Implementada)) O componente agora utiliza o `clientLogger`, que não tem dependências do Sentry, resolvendo o problema de empacotamento de código de servidor no cliente.
 *
 * =====================================================================
 */
// src/components/ui/DynamicIcon.tsx
