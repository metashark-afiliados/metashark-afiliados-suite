// src/components/authentication/authentication-form.tsx
/**
 * @file authentication-form.tsx
 * @description Componente de presentación puro y atómico que contiene los campos
 *              de email y contraseña compartidos entre los formularios de login y signup.
 * @author Raz Podestá (adaptado de paddle-nextjs-starter-kit)
 * @version 1.0.0
 */
"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
}

export function AuthenticationForm({
  email,
  onEmailChange,
  onPasswordChange,
  password,
}: Props) {
  const t = useTranslations("SupabaseAuthUI");

  return (
    <>
      <div className="grid w-full max-w-sm items-center gap-1.5 mt-2">
        <Label htmlFor="email">{t("email_label")}</Label>
        <Input
          type="email"
          id="email"
          autoComplete={"username"}
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="password">{t("password_label")}</Label>
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
        />
      </div>
    </>
  );
}
