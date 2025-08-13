// src/components/landing/NewsletterForm.tsx
/**
 * @file src/components/landing/NewsletterForm.tsx
 * @description Aparato de cliente atómico y soberano para el formulario de suscripción.
 *              Su `SubmitButton` ha sido refactorizado para aceptar un icono opcional,
 *              aumentando su flexibilidad y reutilización para diferentes contextos de UI.
 * @author Raz Podestá
 * @version 3.0.0
 */
"use client";

import React, { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { motion, useAnimation } from "framer-motion";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletterAction } from "@/lib/actions/newsletter.actions";
import { type ActionResult } from "@/lib/validators";

type FormState =
  | ActionResult<{ messageKey: string }>
  | { success: false; error: null };

const initialState: FormState = { success: false, error: null };

function SubmitButton({
  text,
  icon: Icon,
}: {
  text: string;
  icon?: React.ElementType;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="flex-shrink-0" disabled={pending}>
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {text}
          {Icon && <Icon className="ml-2 h-4 w-4" />}
        </>
      )}
    </Button>
  );
}

export interface NewsletterFormProps {
  ctaText: string;
  placeholderText: string;
  ctaIcon?: React.ElementType;
}

export function NewsletterForm({
  ctaText,
  placeholderText,
  ctaIcon,
}: NewsletterFormProps) {
  const t = useTranslations();
  const formRef = useRef<HTMLFormElement>(null);
  const animationControls = useAnimation();
  const [state, formAction] = useFormState(
    subscribeToNewsletterAction,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      if (state.data?.messageKey) {
        toast.success(t(state.data.messageKey as any));
        formRef.current?.reset();
      }
    } else if (state.error) {
      toast.error(t(state.error as any));
      animationControls.start({
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.4, ease: "easeInOut" },
      });
    }
  }, [state, t, animationControls]);

  return (
    <motion.form
      ref={formRef}
      action={formAction}
      className="flex gap-2"
      animate={animationControls}
    >
      <Input
        type="email"
        name="email"
        placeholder={placeholderText}
        className="bg-input"
        required
        aria-describedby={
          !state.success && state.error ? "newsletter-error" : undefined
        }
      />
      <SubmitButton text={ctaText} icon={ctaIcon} />
      {!state.success && state.error && (
        <p id="newsletter-error" className="sr-only">
          {t(state.error as any)}
        </p>
      )}
    </motion.form>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Flexibilidad de UI**: ((Implementada)) El `SubmitButton` ahora acepta una prop `icon` opcional. Esto lo convierte en un componente más reutilizable y permite al `BottomCTA` renderizar el formulario sin el icono de flecha, corrigiendo la regresión de diseño.
 *
 * @subsection Melhorias Futuras
 * 1. **Animación de Éxito**: ((Vigente)) Tras una suscripción exitosa, se podría mostrar una animación de confeti o un icono de "check" animado para una experiencia de usuario aún más gratificante.
 *
 * =====================================================================
 */
// src/components/landing/NewsletterForm.tsx
