// src/components/sites/SubdomainInput.tsx
/**
 * @file src/components/sites/SubdomainInput.tsx
 * @description Componente de campo de formulario atómico y especializado para la
 *              validación de subdominios. Este aparato encapsula la interacción
 *              con el hook `useSubdomainAvailability` para proporcionar feedback
 *              visual en tiempo real al usuario. Es un componente de presentación
 *              puro, completamente agnóstico al contenido, recibiendo todos sus
 *              textos y el estado del formulario a través de props.
 * @author L.I.A. Legacy
 * @version 1.1.0
 */
"use client";

import { type UseFormReturn } from "react-hook-form";
import { Check, Loader2, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  useSubdomainAvailability,
  type AvailabilityStatus,
} from "@/lib/hooks/use-subdomain-availability";
import { rootDomain } from "@/lib/utils";

/**
 * @public
 * @interface SubdomainInputProps
 * @description Define el contrato de props para el componente `SubdomainInput`.
 */
interface SubdomainInputProps {
  /**
   * La instancia del formulario de `react-hook-form` del componente padre.
   * Esto permite al `SubdomainInput` registrarse y acceder al estado del formulario.
   */
  form: UseFormReturn<any>;
  /**
   * El texto de error internacionalizado a mostrar cuando el subdominio no está disponible.
   */
  errorText: string;
}

/**
 * @public
 * @component SubdomainInput
 * @description Renderiza un campo de entrada para subdominios con validación de
 *              disponibilidad en tiempo real y feedback visual.
 * @param {SubdomainInputProps} props - Las propiedades para configurar el componente.
 * @returns {React.ReactElement}
 */
export function SubdomainInput({ form, errorText }: SubdomainInputProps) {
  const {
    register,
    watch,
    formState: { errors, dirtyFields },
  } = form;

  const subdomainValue = watch("subdomain");

  const { availability } = useSubdomainAvailability(
    subdomainValue,
    !!dirtyFields.subdomain,
    !!errors.subdomain
  );

  /**
   * @private
   * @function renderAvailabilityIcon
   * @description Renderiza un icono basado en el estado de disponibilidad del subdominio.
   * @returns {React.ReactElement | null} El icono correspondiente o null.
   */
  const renderAvailabilityIcon = (): React.ReactElement | null => {
    switch (availability) {
      case "checking":
        return (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        );
      case "available":
        return <Check className="h-4 w-4 text-green-500" />;
      case "unavailable":
        return <X className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex items-center">
        <div className="relative w-full">
          <Input
            id="subdomain"
            placeholder="tu-sitio-unico"
            className="w-full rounded-r-none focus:z-10 bg-input"
            aria-invalid={!!errors.subdomain || availability === "unavailable"}
            {...register("subdomain")}
          />
          <div className="absolute inset-y-0 right-3 flex items-center">
            {renderAvailabilityIcon()}
          </div>
        </div>
        <span className="flex h-10 items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-muted-foreground">
          .{rootDomain}
        </span>
      </div>
      {errors.subdomain && (
        <p className="text-sm text-destructive" role="alert">
          {errors.subdomain.message as string}
        </p>
      )}
      {availability === "unavailable" && !errors.subdomain && (
        <p className="text-sm text-destructive" role="alert">
          {errorText}
        </p>
      )}
    </>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Corrección de Modularidad**: ((Implementada)) Se ha añadido la palabra clave `export` a `function SubdomainInput`. Esta corrección crítica transforma el archivo de un script a un módulo ES6, permitiendo que sea importado y resolviendo el error `TS2306`.
 *
 * @subsection Melhorias Futuras
 * 1. **Tooltip de Contexto**: ((Vigente)) Añadir un `<Tooltip>` al icono de disponibilidad para proporcionar más información al usuario (ej. "¡Este subdominio está disponible!").
 *
 * =====================================================================
 */
// src/components/sites/SubdomainInput.tsx
