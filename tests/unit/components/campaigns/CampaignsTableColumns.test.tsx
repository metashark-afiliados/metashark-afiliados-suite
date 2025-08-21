// tests/unit/components/campaigns/CampaignsTableColumns.test.tsx
/**
 * @file CampaignsTableColumns.test.tsx
 * @description Arnés de pruebas unitarias para la factoría de columnas `getCampaignsColumns`.
 *              Corregido para importar `createMockCampaign` desde su ruta canónica.
 * @author Raz Podestá
 * @version 1.1.0
 */
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import {
  getCampaignsColumns,
  type GetCampaignsColumnsParams,
} from "@/components/campaigns/CampaignsTableColumns";
import { type CampaignMetadata } from "@/lib/data/campaigns";
// --- INICIO DE CORRECCIÓN (TS2305) ---
import { createMockCampaign } from "@tests/utils/factories/data.factory";
// --- FIN DE CORRECCIÓN ---

const t = (key: string) => `[i18n] ${key}`;
t.rich = (key: string) => `[i18n] ${key}`;

const mockParams: GetCampaignsColumnsParams = {
  t: t as any,
  tDialogs: t as any,
  format: {
    dateTime: () => "mock-date",
  } as any,
  handleDelete: vi.fn(),
  handleDuplicate: vi.fn(),
  handleArchive: vi.fn(),
  isPending: false,
  mutatingId: null,
  toastTexts: { duplicating: "", archiving: "" },
};

const columnHelper = createColumnHelper<CampaignMetadata>();

const TestTable = ({ data }: { data: CampaignMetadata[] }) => {
  const columns = React.useMemo(() => getCampaignsColumns(mockParams), []);
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

describe("Componente Atómico: CampaignsTableColumns", () => {
  it("debe renderizar un enlace al builder con el href correcto", () => {
    // Arrange
    const mockCampaign = createMockCampaign({ id: "campaign-123" });
    render(<TestTable data={[mockCampaign]} />);

    // Assert
    const link = screen.getByRole("link", { name: mockCampaign.name });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/builder/campaign-123");
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Ambigüedad de Módulo**: ((Implementada)) Se ha actualizado la ruta de importación para que apunte directamente a `data.factory`, eliminando la ambigüedad y resolviendo el error de compilación `TS2305`.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas de Acciones**: ((Vigente)) Añadir pruebas que simulen clics en los botones del `DropdownMenu` y verifiquen que los `callbacks` (`handleDelete`, etc.) son llamados con los argumentos correctos.
 * =====================================================================
 */
// tests/unit/components/campaigns/CampaignsTableColumns.test.tsx
