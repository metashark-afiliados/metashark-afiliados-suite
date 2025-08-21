// tests/mocks/index.ts
import React from "react";
import { type User } from "@supabase/supabase-js";
import { vi } from "vitest";

import { type DashboardContextProps } from "@/lib/context/DashboardContext";
import * as DUMMY_DATA from "@tests/mocks/data/database-state";
import { setupActionsMock } from "./vi/actions.mock";
import { setupDashboardContextMock } from "./vi/context.mock";
import { setupNavigationMock } from "./vi/navigation.mock";
import { setupNextIntlMock } from "./vi/next-intl.mock";
import { setupSupabaseMock } from "./vi/supabase.mock";

/**
 * @file tests/mocks/index.ts
 * @description Orquestador de Mocks de Módulos Definitivo v14.1.0.
 *              El mock para 'next/cache' ha sido corregido para exportar
 *              funciones, resolviendo un TypeError crítico en las pruebas.
 * @author Raz Podestá
 * @version 14.1.0
 */

// --- MOCKS DE INFRAESTRUCTURA ---
vi.mock("server-only", () => ({}));

// --- INICIO DE CORRECCIÓN (TypeError: cache is not a function) ---
// La API real de `cache` es una función que recibe una función.
// El mock ahora replica este comportamiento.
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  unstable_cache: (fn: any) => fn,
  cache: (fn: any) => fn,
}));
// --- FIN DE CORRECCIÓN ---

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    promise: vi.fn(),
  },
}));

export const setupGlobalMocks = () => {
  setupNextIntlMock();
  setupNavigationMock();
  setupActionsMock();
  setupSupabaseMock();
  setupDashboardContextMock();
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de TypeError Crítico**: ((Implementada)) Se ha corregido el mock de `next/cache` para que exporte funciones, alineándolo con la API real y resolviendo la causa raíz de la falla de la suite de pruebas.
 *
 * =====================================================================
 */
