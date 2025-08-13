// src/components/ui/SearchInput.tsx
/**
 * @file src/components/ui/SearchInput.tsx
 * @description Conjunto de primitivas de UI de élite y un componente de conveniencia
 *              para construir campos de búsqueda. Proporciona control total a través
 *              del patrón de Componente Compuesto y simplicidad a través de un
 *              ensamblaje por defecto.
 * @author Raz Podestá
 * @version 5.0.0
 */
"use client";

import React, { createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input, type InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// --- Contexto Interno ---
interface SearchInputContextType {
  value: string;
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInputContext = createContext<SearchInputContextType | undefined>(
  undefined
);

const useSearchInput = () => {
  const context = useContext(SearchInputContext);
  if (!context) {
    throw new Error(
      "useSearchInput debe ser usado dentro de un SearchInput.Root"
    );
  }
  return context;
};

// --- Primitiva #1: Raíz y Proveedor ---
interface SearchInputRootProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading?: boolean;
}

const SearchInputRoot = React.forwardRef<HTMLDivElement, SearchInputRootProps>(
  ({ className, value, onChange, isLoading = false, ...props }, ref) => {
    const contextValue = { value, onChange, isLoading };
    return (
      <SearchInputContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn("relative w-full", className)}
          {...props}
        />
      </SearchInputContext.Provider>
    );
  }
);
SearchInputRoot.displayName = "SearchInputRoot";

// --- Primitiva #2: Campo de Entrada ---
const SearchInputInput = React.forwardRef<
  HTMLInputElement,
  Omit<InputProps, "value" | "onChange">
>(({ className, ...props }, ref) => {
  const { value, onChange, isLoading } = useSearchInput();
  return (
    <>
      <label htmlFor={props.id} className="sr-only">
        {props.placeholder || "Search"}
      </label>
      <Input
        ref={ref}
        type="search"
        className={cn("pl-10 pr-10", className)}
        value={value}
        onChange={onChange}
        disabled={isLoading}
        {...props}
      />
    </>
  );
});
SearchInputInput.displayName = "SearchInputInput";

// --- Primitiva #3: Icono de Estado ---
const SearchInputIcon = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { isLoading } = useSearchInput();
  return (
    <div
      className={cn(
        "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
        className
      )}
      {...props}
    >
      {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
    </div>
  );
};
SearchInputIcon.displayName = "SearchInputIcon";

// --- Primitiva #4: Botón de Limpiar ---
const SearchInputClearButton = ({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { value, onChange, isLoading } = useSearchInput();
  return (
    <AnimatePresence>
      {value && !isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute right-2 top-1/2 -translate-y-1/2"
        >
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-7 w-7", className)}
            onClick={() => {
              const syntheticEvent = {
                target: { value: "" },
              } as React.ChangeEvent<HTMLInputElement>;
              onChange(syntheticEvent);
            }}
            {...props}
          >
            <X className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
SearchInputClearButton.displayName = "SearchInputClearButton";

// --- Componente de Conveniencia (Ensamblaje por Defecto) ---
export interface SearchInputProps extends InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearAriaLabel: string;
  isLoading?: boolean;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, isLoading, clearAriaLabel, ...props }, ref) => {
    return (
      <SearchInputRoot value={value} onChange={onChange} isLoading={isLoading}>
        <SearchInputIcon />
        <SearchInputInput ref={ref} {...props} />
        <SearchInputClearButton aria-label={clearAriaLabel} />
      </SearchInputRoot>
    );
  }
);
SearchInput.displayName = "SearchInput";

export {
  SearchInput,
  SearchInputRoot,
  SearchInputInput,
  SearchInputIcon,
  SearchInputClearButton,
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente de Conveniencia**: ((Implementada)) Se ha añadido el componente `SearchInput` que ensambla las cuatro primitivas en el patrón más común. Esto simplifica drásticamente su uso en el 90% de los casos, sin sacrificar la flexibilidad del patrón compuesto para personalizaciones avanzadas.
 *
 * @subsection Melhorias Futuras
 * 1. **Renderizado Condicional de Hijos**: ((Vigente)) El componente `SearchInput` de conveniencia podría ser aún más inteligente y solo renderizar el `SearchInputClearButton` si se le proporciona un `clearAriaLabel`, haciéndolo opcional.
 *
 * =====================================================================
 */
// src/components/ui/SearchInput.tsx
