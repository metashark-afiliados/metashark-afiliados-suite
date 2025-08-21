// tests/unit/app/dev-console/users/users-client.test.tsx
/**
 * @file users-client.test.tsx
 * @description Arnés de pruebas de alta calidad para el orquestador de UI `UsersClient`.
 *              Actualizado para simular la nueva dependencia `getUsersColumns`.
 * @author Raz Podestá
 * @version 2.0.0
 */
import { describe, expect, it, vi } from "vitest";

import { UsersClient } from "@/app/[locale]/dev-console/users/users-client";
import * as UsersTableColumnsModule from "@/app/[locale]/dev-console/components/users-table-columns";
import { useUsersPage } from "@/lib/hooks/useUsersPage";
import { render, screen } from "@tests/utils/render";
import { createMockUser } from "@tests/utils/factories";

// Simulamos el hook soberano
vi.mock("@/lib/hooks/useUsersPage");
const mockedUseUsersPage = vi.mocked(useUsersPage);

// Simulamos la factoría de columnas para aislar el componente
const getUsersColumnsSpy = vi.spyOn(UsersTableColumnsModule, "getUsersColumns");

const mockUser = createMockUser({
  id: "user-1",
  email: "test@example.com",
});

describe("Orquestador de UI (Hiper-Atomizado): UsersClient", () => {
  it("debe invocar la factoría getUsersColumns con las dependencias correctas", () => {
    // Arrange
    const mockHandleRoleChange = vi.fn();
    mockedUseUsersPage.mockReturnValue({
      searchTerm: "",
      setSearchTerm: vi.fn(),
      isPending: false,
      handleRoleChange: mockHandleRoleChange,
    });

    // Act
    render(
      <UsersClient
        profiles={[mockUser as any]}
        totalCount={1}
        page={1}
        limit={20}
        searchQuery=""
      />
    );

    // Assert
    expect(getUsersColumnsSpy).toHaveBeenCalledOnce();
    expect(getUsersColumnsSpy).toHaveBeenCalledWith({
      t: expect.any(Function),
      isPending: false,
      handleRoleChange: mockHandleRoleChange,
    });
  });

  it("debe renderizar los componentes de UI principales", () => {
    // Arrange
    mockedUseUsersPage.mockReturnValue({
      searchTerm: "",
      setSearchTerm: vi.fn(),
      isPending: false,
      handleRoleChange: vi.fn(),
    });

    // Act
    render(
      <UsersClient
        profiles={[]}
        totalCount={0}
        page={1}
        limit={20}
        searchQuery=""
      />
    );

    // Assert
    expect(
      screen.getByPlaceholderText(
        "[i18n] app.dev-console.UserManagementTable.search_placeholder"
      )
    ).toBeInTheDocument();
    // La tabla se renderiza a través de DataTable, podemos buscar su contenido.
    expect(
      screen.getByText(
        "[i18n] app.dev-console.UserManagementTable.table_empty_state"
      )
    ).toBeInTheDocument();
  });
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Prueba de Inyección de Dependencias**: ((Implementada)) El arnés de pruebas ahora valida que el orquestador de UI invoca a la factoría de columnas `getUsersColumns` y le pasa el conjunto correcto de dependencias (callbacks y estado), verificando que el "cableado" de la arquitectura es correcto.
 *
 * =====================================================================
 */
// tests/unit/app/dev-console/users/users-client.test.tsx
