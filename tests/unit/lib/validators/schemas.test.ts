// tests/unit/lib/validators/schemas.test.ts
/**
 * @file tests/unit/lib/validators/schemas.test.ts
 * @description Arnés de pruebas unitarias para el schema `CreateWorkspaceSchema`.
 *              Valida la integridad del contrato de datos para la creación de workspaces.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { describe, expect, it } from "vitest";
import { CreateWorkspaceSchema } from "@/lib/validators/schemas";

describe("Arnés de Pruebas: CreateWorkspaceSchema", () => {
  // Grupo de Pruebas para Casos de Éxito (Camino Feliz)
  describe("Casos de Éxito", () => {
    it("debe validar correctamente un objeto con nombre e ícono válidos", () => {
      // Arrange
      const validInput = { workspaceName: "Mi Proyecto", icon: "🚀" };
      // Act & Assert
      expect(() => CreateWorkspaceSchema.parse(validInput)).not.toThrow();
    });

    it("debe transformar las claves a snake_case en una validación exitosa", () => {
      // Arrange
      const validInput = { workspaceName: "Mi Proyecto", icon: "✨" };
      // Act
      const parsed = CreateWorkspaceSchema.parse(validInput);
      // Assert
      expect(parsed).toEqual({
        workspace_name: "Mi Proyecto",
        icon: "✨",
      });
    });
  });

  // Grupo de Pruebas para Casos de Falla (Validación)
  describe("Casos de Falla", () => {
    it.each([
      [{ icon: "👍" }, "ValidationErrors.name_required"], // Nombre faltante
      [{ workspaceName: "  ", icon: "👍" }, "ValidationErrors.name_required"], // Nombre solo con espacios
      [{ workspaceName: "ab", icon: "👍" }, "ValidationErrors.name_too_short"], // Nombre demasiado corto
      [{ workspaceName: "Proyecto Válido" }, "ValidationErrors.icon_required"], // Ícono faltante
      [
        { workspaceName: "Proyecto Válido", icon: "" },
        "ValidationErrors.icon_required",
      ], // Ícono vacío
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
 * 1. **Pruebas de Contrato**: ((Implementada)) Esta suite valida que el schema `CreateWorkspaceSchema` cumpla con su contrato, incluyendo la nueva validación del campo `icon`.
 * 2. **Pruebas Parametrizadas**: ((Implementada)) Utiliza `it.each` para validar múltiples casos de error de forma concisa y mantenible.
 * 3. **Validación de Mensajes i18n**: ((Implementada)) Verifica que Zod devuelva las *claves* de internacionalización correctas, desacoplando las pruebas del texto final.
 * 4. **Corrección Validada**: ((Implementada)) Este arnés de pruebas ahora pasa exitosamente contra el código de producción corregido, validando la efectividad de la refactorización.
 *
 * @subsection Melhorias Futuras
 * 1. **Cobertura Completa**: ((Vigente)) Añadir suites de pruebas para los demás schemas exportados en `schemas.ts` para blindar completamente la capa de validación.
 *
 * =====================================================================
 */
// tests/unit/lib/validators/schemas.test.ts
