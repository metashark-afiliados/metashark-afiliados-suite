// tests/unit/config/dev-console-sidebar.test.ts
import { describe, expect, it } from "vitest";
import { devConsoleNavLinks } from "@/components/dev-console/sidebar/sidebar.config";
import { pathnames } from "@/lib/navigation";

describe("Manifiesto de Configuración: Dev Console Sidebar", () => {
  it("todos los href deben ser rutas válidas definidas en el manifiesto de navegación", () => {
    const validRoutes = Object.keys(pathnames);
    for (const link of devConsoleNavLinks) {
      const href =
        typeof link.href === "string" ? link.href : link.href.pathname;
      expect(validRoutes).toContain(href);
    }
  });
});
