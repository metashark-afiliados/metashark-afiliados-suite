// tests/unit/lib/validators/schemas.test.ts
/**
 * @file schemas.test.ts
 * @description Arnés de pruebas unitarias de élite para la biblioteca de schemas
 *              de Zod. Valida los casos de éxito y fallo para las reglas de
 *              negocio más críticas, incluyendo el nuevo `SignUpSchema`.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { describe, it, expect } from "vitest";

import { SignUpSchema, CreateSiteServerSchema } from "@/lib/validators/schemas";

describe("Biblioteca de Schemas de Zod", () => {
  describe("SignUpSchema", () => {
    const validData = {
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
      termsAccepted: true,
      newsletterSubscribed: false,
    };

    it("debe validar con éxito datos correctos", () => {
      const result = SignUpSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("debe fallar si el email es inválido", () => {
      const result = SignUpSchema.safeParse({
        ...validData,
        email: "not-an-email",
      });
      expect(result.success).toBe(false);
    });

    it("debe fallar si las contraseñas no coinciden", () => {
      const result = SignUpSchema.safeParse({
        ...validData,
        confirmPassword: "differentpassword",
      });
      expect(result.success).toBe(false);
      // @ts-ignore
      expect(result.error.flatten().fieldErrors.confirmPassword).toContain(
        "passwords_do_not_match"
      );
    });

    it("debe fallar si los términos no son aceptados", () => {
      const result = SignUpSchema.safeParse({
        ...validData,
        termsAccepted: false,
      });
      expect(result.success).toBe(false);
      // @ts-ignore
      expect(result.error.flatten().fieldErrors.termsAccepted).toContain(
        "terms_must_be_accepted"
      );
    });
  });

  describe("CreateSiteServerSchema", () => {
    const validData = {
      name: "Mi Sitio de Prueba",
      subdomain: "mi-sitio-prueba",
      workspaceId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    };

    it("debe transformar los datos a snake_case correctamente", () => {
      const result = CreateSiteServerSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Mi Sitio de Prueba");
        expect(result.data.subdomain).toBe("mi-sitio-prueba");
        expect(result.data.workspace_id).toBe(
          "f47ac10b-58cc-4372-a567-0e02b2c3d479"
        );
      }
    });

    it("debe usar el subdominio como nombre si el nombre no se proporciona", () => {
      const { name, ...dataWithoutName } = validData;
      const result = CreateSiteServerSchema.safeParse(dataWithoutName);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("mi-sitio-prueba");
      }
    });
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Blindaje de Lógica de Negocio**: ((Implementada)) Este arnés de pruebas valida las reglas de negocio clave definidas en los schemas, garantizando que cambios futuros no introduzcan regresiones en la validación de datos.
 * 2. **Cobertura de Casos de Éxito y Fallo**: ((Implementada)) Las pruebas cubren tanto los datos válidos como los inválidos, asegurando que las reglas de Zod (como `refine` y `literal`) funcionen como se espera.
 *
 * @subsection Melhorias Futuras
 * 1. **Cobertura Completa de Schemas**: ((Vigente)) El arnés actual cubre los schemas más críticos. Debería ser expandido para incluir pruebas para todos los demás schemas exportados (`UpdateSiteSchema`, `InvitationClientSchema`, etc.) para una cobertura del 100%.
 *
 * =====================================================================
 */
