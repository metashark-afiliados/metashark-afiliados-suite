// src/components/shared/error-state-card.tsx
/**
 * @file src/components/shared/error-state-card.tsx
 * @description Un componente de presentación atómico y puro para mostrar un estado de error
 *              consistente en la UI. Es 100% agnóstico al contenido, recibiendo todos sus textos
 *              y el icono a través de su contrato de props explícito.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import React from "react";
import { type LucideProps } from "lucide-react";

import { Card } from "@/components/ui/card";

/**
 * @public
 * @interface ErrorStateCardProps
 * @description Contrato de props para el componente de presentación ErrorStateCard.
 */
export interface ErrorStateCardProps {
  /**
   * El componente de icono de `lucide-react` a ser renderizado.
   */
  icon: React.ElementType<LucideProps>;
  /**
   * El título principal del mensaje de error.
   */
  title: string;
  /**
   * La descripción detallada del error o la acción sugerida.
   */
  description: string;
}

/**
 * @public
 * @exports ErrorStateCard
 * @description Componente de presentación para mostrar un estado de error consistente.
 * @component
 * @param {ErrorStateCardProps} props Las propiedades para configurar el componente.
 * @returns {React.ReactElement} El componente de tarjeta de error renderizado.
 */
export function ErrorStateCard({
  icon: Icon,
  title,
  description,
}: ErrorStateCardProps): React.ReactElement {
  return (
    <Card className="flex flex-col items-center justify-center h-full p-8 text-center bg-destructive/10 border-destructive/50">
      <Icon className="h-12 w-12 text-destructive mb-4" />
      <h2 className="text-xl font-bold text-destructive-foreground">{title}</h2>
      <p className="text-muted-foreground mt-2">{description}</p>
    </Card>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Botón de Acción Reutilizable**: ((Vigente)) Añadir props opcionales `actionText` y `onAction` para renderizar un botón que permita al usuario realizar una acción, como "Intentar de nuevo", que podría invocar un `router.refresh()`.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Dependencia**: ((Implementada)) La reconstrucción de este aparato resuelve el error `TS2307` en `sites-page-loader.tsx`.
 * 2. **Componente de UI Resiliente**: ((Implementada)) Proporciona un patrón de UI canónico para el manejo de errores, mejorando la resiliencia y la experiencia del usuario en toda la aplicación.
 *
 * =====================================================================
 */
// src/components/shared/error-state-card.tsx
