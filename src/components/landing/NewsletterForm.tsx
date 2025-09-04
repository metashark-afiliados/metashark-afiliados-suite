// src/components/landing/NewsletterForm.tsx
/**
 * @file src/components/landing/NewsletterForm.tsx
 * @description Aparato de cliente atómico para el formulario de suscripción.
 *              Ha sido refactorizado a un componente de presentación 100% puro,
 *              recibiendo todos sus textos a través de props para alinearse
 *              con la arquitectura de "Mega-Orquestador" de la HomePage.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 4.0.0
 */
"use client";

import React, { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useFormState, useFormStatus } from "react-dom";
import { motion, useAnimation } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl"; // Se mantiene para los toasts genéricos

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
  // Se utiliza un namespace genérico para los mensajes de feedback
  const tErrors = useTranslations("shared.ValidationErrors");
  const formRef = useRef<HTMLFormElement>(null);
  const animationControls = useAnimation();
  const [state, formAction] = useFormState(
    subscribeToNewsletterAction,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      if (state.data?.messageKey) {
        toast.success(tErrors(state.data.messageKey as any));
        formRef.current?.reset();
      }
    } else if (state.error) {
      toast.error(tErrors(state.error as any));
      animationControls.start({
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.4, ease: "easeInOut" },
      });
    }
  }, [state, tErrors, animationControls]);

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
          {tErrors(state.error as any)}
        </p>
      )}
    </motion.form>
  );
}
// src/components/landing/NewsletterForm.tsx
