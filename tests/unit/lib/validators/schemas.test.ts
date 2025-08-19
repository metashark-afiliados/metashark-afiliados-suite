// tests/unit/lib/validators/schemas.test.ts
/**
 * @file tests/unit/lib/validators/schemas.test.ts
 * @description Arnés de pruebas unitarias para el schema `CreateWorkspaceSchema`.
 *              Ha sido sincronizado para reflejar la eliminación del campo `icon`,
 *              resolviendo los fallos de aserción.
 * @author Raz Podestá
 * @version 1.1.0
 */
import { describe, expect, it } from "vitest";
import { CreateWorkspaceSchema } from "@/lib/validators/schemas";

describe("Arnés de Pruebas: CreateWorkspaceSchema", () => {
  describe("Casos de Éxito", () => {
    it("debe validar correctamente un objeto con un nombre válido", () => {
      // Arrange
      const validInput = { workspaceName: "Mi Proyecto de Éxito" };
      // Act & Assert
      expect(() => CreateWorkspaceSchema.parse(validInput)).not.toThrow();
    });

    it("debe transformar la clave a snake_case en una validación exitosa", () => {
      // Arrange
      const validInput = { workspaceName: "Otro Proyecto" };
      // Act
      const parsed = CreateWorkspaceSchema.parse(validInput);
      // Assert
      expect(parsed).toEqual({ workspace_name: "Otro Proyecto" });
    });
  });

  describe("Casos de Falla", () => {
    it.each([
      [{}, "ValidationErrors.name_required"], // Objeto vacío
      [{ workspaceName: "  " }, "ValidationErrors.name_required"], // Nombre solo con espacios
      [{ workspaceName: "ab" }, "ValidationErrors.name_too_short"], // Nombre demasiado corto
    ])(
      "debe fallar la validación para la entrada inválida %j y devolver el mensaje de i18n correcto",
      (invalidInput, expectedMessageKey) => {
        // Act
        const result = CreateWorkspaceSchema.safeParse(invalidInput);
        // Assert
        expect(result.success).toBe(false);
        if (!result.success) {
          const fieldErrors = result.error.flatten().fieldErrors;
          const messages = Object.values(fieldErrors).flat();
          expect(messages).toContain(expectedMessageKey);
        }
      }
    );
  });
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Contrato de Pruebas**: ((Implementada)) La suite de pruebas ha sido actualizada para reflejar el contrato de datos simplificado del `CreateWorkspaceSchema` (sin `icon`), resolviendo los fallos de prueba.
 *
 * =====================================================================
 */
// tests/unit/lib/validators/schemas.test.ts
