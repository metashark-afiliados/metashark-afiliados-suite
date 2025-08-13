// src/app/[locale]/auth/signup/signup-client.tsx
/**
 * @file src/app/[locale]/auth/signup/signup-client.tsx
 * @description Componente de cliente que renderiza la UI animada para la página de registro.
 *              Este aparato ha sido extraído para respetar el límite Servidor-Cliente
 *              y permitir que la página contenedora siga siendo un Server Component.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { AuthFooter } from "@/components/auth/AuthFooter";
import { SignUpForm } from "@/components/auth/SignUpForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SignUpPageClientProps {
  title: string;
  subtitle: string;
}

export function SignUpPageClient({
  title,
  subtitle,
}: SignUpPageClientProps): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <div className="mb-8 flex flex-col items-center text-center">
        <Image
          src="/images/logo.png"
          alt="Logo de ConvertiKit"
          width={64}
          height={64}
          priority
        />
        <h1 className="mt-4 text-3xl font-bold">{title}</h1>
        <p className="max-w-sm text-muted-foreground">{subtitle}</p>
      </div>
      <Card className="border-border/60 bg-card/50 backdrop-blur-lg">
        <CardHeader />
        <CardContent>
          <SignUpForm />
        </CardContent>
        <AuthFooter type="signup" />
      </Card>
    </motion.div>
  );
}
// src/app/[locale]/auth/signup/signup-client.tsx
