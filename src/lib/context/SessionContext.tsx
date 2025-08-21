// src/lib/context/SessionContext.tsx
"use client";

import { createContext, type ReactNode, useContext } from "react";
import { type User } from "@supabase/supabase-js";
import { type Tables } from "@/lib/types/database";

export interface SessionContextProps {
  user: User;
  profile: Tables<"profiles">;
}

const SessionContext = createContext<SessionContextProps | undefined>(
  undefined
);

export const SessionProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: SessionContextProps;
}) => {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export const useSession = (): SessionContextProps => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession debe ser usado dentro de un SessionProvider");
  }
  return context;
};
