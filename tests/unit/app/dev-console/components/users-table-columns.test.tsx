// tests/unit/app/dev-console/components/users-table-columns.test.tsx
/**
 * @file users-table-columns.test.tsx
 * @description Arnés de pruebas unitarias para la factoría `getUsersColumns`.
 *              Corregido para utilizar un mock de `t` de alta fidelidad.
 * @author Raz Podestá
 * @version 2.0.0
 */
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import {
  getUsersColumns,
  type GetUsersColumnsParams,
} from "@/app/[locale]/dev-console/components/users-table-columns";
import { type UserProfilesWithEmail } from "@/lib/types/database/views";
import { createMockUser } from "@tests/utils/factories";

type ProfileRow = UserProfilesWithEmail["Row"];

// --- INICIO DE CORRECCIÓN (MOCK DE ALTA FIDELIDAD) ---
const t = (key: string) => `[i18n] app.dev-console.UserManagementTable.${key}`;
t.rich = (key: string, values: any) => (
  <span>{`[i18n-rich] ${key} ${JSON.stringify(values || {})}`}</span>
);
t.raw = (key: string) => ({});
// --- FIN DE CORRECCIÓN ---

const mockParams: GetUsersColumnsParams = {
  t: t as any, // El type assertion sigue siendo útil aquí
  isPending: false,
  handleRoleChange: vi.fn(),
};

// Componente de arnés para renderizar la tabla con las columnas generadas
const TestTable = ({
  data,
  params,
}: {
  data: ProfileRow[];
  params: GetUsersColumnsParams;
}) => {
  const columns = React.useMemo(() => getUsersColumns(params), [params]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

describe("Factoría de UI: getUsersColumns", () => {
  it("debe renderizar correctamente los datos de un usuario", () => {
    // Arrange
    const mockUser = createMockUser({
      email: "test@dev.com",
      user_metadata: { full_name: "Dev User" },
      app_metadata: { app_role: "developer" },
    }) as unknown as ProfileRow;

    // Act
    render(<TestTable data={[mockUser]} params={mockParams} />);

    // Assert
    expect(screen.getByText("test@dev.com")).toBeInTheDocument();
    expect(screen.getByText("Dev User")).toBeInTheDocument();
    expect(screen.getByText("Developer")).toBeInTheDocument();
  });

  it("debe invocar a handleRoleChange con los argumentos correctos al cambiar un rol", async () => {
    // Arrange
    const user = userEvent.setup();
    const mockUser = createMockUser({ id: "user-to-change" }) as any;
    const paramsWithSpy = { ...mockParams, handleRoleChange: vi.fn() };
    render(<TestTable data={[mockUser]} params={paramsWithSpy} />);

    // Act
    const selectTrigger = screen.getByRole("combobox");
    await user.click(selectTrigger);
    const adminOption = screen.getByRole("option", { name: "Admin" });
    await user.click(adminOption);

    // Assert
    expect(paramsWithSpy.handleRoleChange).toHaveBeenCalledOnce();
    expect(paramsWithSpy.handleRoleChange).toHaveBeenCalledWith(
      "user-to-change",
      "admin"
    );
  });
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Tipos (TS2739)**: ((Implementada)) Se ha mejorado el mock local de la función `t` para que incluya las propiedades `.rich` y `.raw`, cumpliendo con el contrato de `ReturnType<typeof useTranslations>` y resolviendo el error de compilación.
 *
 * @subsection Melhorias Futuras
 * 1. **Exportar Mock de `t`**: ((Vigente)) El mock de `t` de alta fidelidad podría ser extraído a un archivo en `tests/mocks/factories` para ser reutilizado en otras pruebas unitarias que no renderizan hooks.
 *
 * =====================================================================
 */
// tests/unit/app/dev-console/components/users-table-columns.test.tsx