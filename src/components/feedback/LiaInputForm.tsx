// src/components/feedback/LiaInputForm.tsx
/**
 * @file LiaInputForm.tsx
 * @description Componente de UI atómico y de presentación puro. Renderiza el
 *              formulario de entrada para el chat de L.I.A.
 * @author L.I.A. Legacy
 * @version 1.0.0
 * @see .docs-espejo/components/feedback/LiaInputForm.tsx.md
 */
"use client";

import { Loader2, Send } from "lucide-react";
import React from "react";
import {
  FormProvider,
  type UseFormReturn,
  type SubmitHandler,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LiaInputFormProps {
  form: UseFormReturn<{ message: string }>;
  onSubmit: SubmitHandler<{ message: string }>;
  isSending: boolean;
  texts: {
    inputPlaceholder: string;
    sendButtonAriaLabel: string;
  };
}

/**
 * @public
 * @component LiaInputForm
 * @description Renderiza el formulario de entrada de texto para el chat.
 * @param {LiaInputFormProps} props - Propiedades para configurar el formulario.
 * @returns {React.ReactElement}
 */
export function LiaInputForm({
  form,
  onSubmit,
  isSending,
  texts,
}: LiaInputFormProps): React.ReactElement {
  const { register, handleSubmit } = form;

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="relative w-full">
        <Input
          {...register("message")}
          placeholder={texts.inputPlaceholder}
          className="pr-12 h-12 bg-input border-border"
          autoComplete="off"
          disabled={isSending}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-2.5 top-1/2 -translate-y-1/2"
          aria-label={texts.sendButtonAriaLabel}
          disabled={isSending || !form.formState.isValid}
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </FormProvider>
  );
}
// src/components/feedback/LiaInputForm.tsx
