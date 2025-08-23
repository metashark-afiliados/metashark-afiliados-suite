// src/components/dashboard/layout/error-content.tsx
/**
 * @file error-content.tsx
 * @description Componente de UI atómico y reutilizable para mostrar un estado
 *              de error genérico dentro del layout del dashboard.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import { useTranslations } from "next-intl";
import { AlertTriangle } from "lucide-react";

import { ErrorStateCard } from "@/components/shared/error-state-card";

export function ErrorContent() {
  const t = useTranslations("ValidationErrors"); // Usar nuestro namespace de errores

  return (
    <ErrorStateCard
      icon={AlertTriangle}
      title={t("error_server_generic")}
      description="No se pudo cargar la información. Por favor, intenta recargar la página."
    />
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Dependencia**: ((Implementada)) La creación de este aparato resuelve una de las dependencias faltantes en `DashboardSubscriptionCardGroup`.
 * 2. **Consistencia de UI**: ((Implementada)) Al utilizar `ErrorStateCard`, nos aseguramos de que los mensajes de error en el dashboard tengan una apariencia consistente con el resto de la aplicación.
 *
 * =====================================================================
 */