// tests/unit/components/layout/sidebar/user-menu/UserMenu.test.tsx
import { describe, expect, it, vi } from "vitest";

import { UserMenu } from "@/components/layout/sidebar/user-menu/UserMenu";
import * as UserMenuContentModule from "@/components/layout/sidebar/user-menu/UserMenuContent";
import * as UserMenuSkeletonModule from "@/components/layout/sidebar/user-menu/UserMenuSkeleton";
import * as UserMenuTriggerModule from "@/components/layout/sidebar/user-menu/UserMenuTrigger";
import { useDashboard } from "@/lib/context/DashboardContext";
import { MOCKED_USER } from "@tests/mocks/data/database-state";
import { render, screen } from "@tests/utils/render";

vi.mock("@/lib/context/DashboardContext");
const mockedUseDashboard = vi.mocked(useDashboard);

// Espiamos los componentes hijos para verificar que son llamados.
const skeletonSpy = vi.spyOn(UserMenuSkeletonModule, "UserMenuSkeleton");
const triggerSpy = vi.spyOn(UserMenuTriggerModule, "UserMenuTrigger");
const contentSpy = vi.spyOn(UserMenuContentModule, "UserMenuContent");

describe("Componente Orquestador: UserMenu", () => {
  it("debe renderizar UserMenuSkeleton cuando el usuario no está definido", () => {
    mockedUseDashboard.mockReturnValue({ user: null } as any);
    render(<UserMenu />);
    expect(skeletonSpy).toHaveBeenCalledOnce();
  });

  it("debe renderizar UserMenuTrigger y UserMenuContent cuando el usuario está definido", () => {
    mockedUseDashboard.mockReturnValue({ user: MOCKED_USER } as any);
    render(<UserMenu />);
    expect(triggerSpy).toHaveBeenCalledOnce();
    expect(contentSpy).toHaveBeenCalledOnce();
  });
});
